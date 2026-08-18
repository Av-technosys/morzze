import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import crypto from "crypto";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { eq } from "drizzle-orm";
import {
  AWS_COGNITO_REGION,
  USER_POOL_CLIENT_ID,
  USER_POOL_CLIENT_SECRET,
  USER_POOL_ID,
} from "@/env";

const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_COGNITO_REGION,
});

type CognitoAuthUser = {
  id: string;
  email: string;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
};

function calculateSecretHash(username: string) {
  return crypto
    .createHmac("sha256", USER_POOL_CLIENT_SECRET)
    .update(username + USER_POOL_CLIENT_ID)
    .digest("base64");
}

async function getOrCreateLocalUser(email: string) {
  try {
    const [{ db }, { users }] = await Promise.all([
      import("@/db"),
      import("@/db/schema"),
    ]);

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) return existing;

    const [created] = await db
      .insert(users)
      .values({
        name: email.split("@")[0] || "User",
        email,
        phone: "",
        password: "COGNITO_AUTH",
        emailVerified: true,
      })
      .returning();

    return created;
  } catch (error) {
    console.error("Failed to sync Cognito user profile:", error);
    return null;
  }
}

async function refreshCognitoAccessToken(token: JWT): Promise<JWT> {
  const refreshToken =
    typeof token.refreshToken === "string" ? token.refreshToken : undefined;
  const email = typeof token.email === "string" ? token.email : undefined;

  if (!refreshToken || !email) {
    return { ...token, error: "RefreshTokenMissing" };
  }

  try {
    const response = await cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: USER_POOL_CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: calculateSecretHash(email),
        },
      }),
    );

    const result = response.AuthenticationResult;
    if (!result?.AccessToken) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    return {
      ...token,
      accessToken: result.AccessToken,
      idToken: result.IdToken ?? token.idToken,
      accessTokenExpires: Date.now() + (result.ExpiresIn ?? 3600) * 1000,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Cognito({
      clientId: USER_POOL_CLIENT_ID,
      clientSecret: USER_POOL_CLIENT_SECRET,
      issuer: `https://cognito-idp.${AWS_COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`,
    }),

    Credentials({
      name: "Cognito Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim();
        const password = String(credentials.password);

        try {
          const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: USER_POOL_CLIENT_ID,
            AuthParameters: {
              USERNAME: email,
              PASSWORD: password,
              SECRET_HASH: calculateSecretHash(email),
            },
          });

          const response = await cognitoClient.send(command);
          const result = response.AuthenticationResult;

          if (!result) return null;

          const localUser = await getOrCreateLocalUser(email);

          return {
            id: localUser?.id ?? email,
            email,
            accessToken: result.AccessToken,
            idToken: result.IdToken,
            refreshToken: result.RefreshToken,
            accessTokenExpires: Date.now() + (result.ExpiresIn ?? 3600) * 1000,
          } satisfies CognitoAuthUser;
        } catch (error: unknown) {
          if (
            typeof error === "object" &&
            error &&
            "name" in error &&
            error.name === "UserNotConfirmedException"
          ) {
            throw new Error("UserNotConfirmedException");
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as CognitoAuthUser;
        token.userId = authUser.id;
        token.email = authUser.email;
        token.accessToken = authUser.accessToken;
        token.idToken = authUser.idToken;
        token.refreshToken = authUser.refreshToken;
        token.accessTokenExpires = authUser.accessTokenExpires;
      }

      const expires =
        typeof token.accessTokenExpires === "number"
          ? token.accessTokenExpires
          : 0;

      if (!token.refreshToken || (expires && Date.now() < expires - 60_000)) {
        return token;
      }

      return refreshCognitoAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          typeof token.userId === "string" ? token.userId : token.sub ?? "";
      }

      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.idToken =
        typeof token.idToken === "string" ? token.idToken : undefined;
      session.refreshToken =
        typeof token.refreshToken === "string" ? token.refreshToken : undefined;
      session.error = typeof token.error === "string" ? token.error : undefined;

      return session;
    },
  },
});

export const nextAuthSignIn = signIn;
