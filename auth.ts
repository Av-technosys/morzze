import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authSingIn, cognito, cognitoResendConfirmationCode, generateSecretHash } from "@/helper/cognito";
import { COGNITO_CLIENT_ID } from "@/env";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

type CognitoIdToken = {
  email?: string;
  name?: string;
  "cognito:username"?: string;
  "custom:userId"?: string;
  "custom:user_id"?: string;
};

type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
};

class CognitoCredentialsError extends CredentialsSignin {
  code: string;

  constructor(code = "credentials") {
    super();
    this.code = code;
  }
}

function decodeIdToken(idToken?: string): CognitoIdToken | null {
  if (!idToken) return null;
  return jwt.decode(idToken) as CognitoIdToken | null;
}

async function resendConfirmationCode(email: string) {
  try {
    await cognitoResendConfirmationCode({ email });
  } catch (error) {
    console.error("Failed to resend Cognito confirmation code:", error);
  }
}

async function getOrCreateDbUser(decoded: CognitoIdToken | null) {
  const email = decoded?.email;
  const tokenUserId = decoded?.["custom:userId"] ?? decoded?.["custom:user_id"];

  if (tokenUserId) {
    const [existing] = await db.select().from(users).where(eq(users.id, tokenUserId)).limit(1);
    if (existing) return existing;
  }

  if (!email) return null;

  const [existingByEmail] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingByEmail) return existingByEmail;

  const [created] = await db
    .insert(users)
    .values({
      ...(tokenUserId ? { id: tokenUserId } : {}),
      name: decoded?.name || email.split("@")[0] || "User",
      email,
      phone: "0000000000",
      password: "COGNITO_AUTH",
      emailVerified: true,
    })
    .returning();

  return created;
}

async function refreshCognitoAccessToken(token: JWT): Promise<JWT> {
  const refreshToken = typeof token.refreshToken === "string" ? token.refreshToken : undefined;
  const idToken = typeof token.idToken === "string" ? token.idToken : undefined;
  const decoded = decodeIdToken(idToken);
  const username = decoded?.["cognito:username"] ?? decoded?.email;

  if (!refreshToken || !username) {
    return { ...token, error: "RefreshTokenMissing" };
  }

  try {
    const response = await cognito.send(
      new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: await generateSecretHash(username),
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

export const {
  handlers: { GET, POST },
  auth,
  signIn: nextAuthSignIn,
} = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";

        if (!email || !password) {
          throw new CognitoCredentialsError("credentials");
        }

        try {
          const result = await authSingIn({ email, password });
          const decoded = decodeIdToken(result.idToken);
          const dbUser = await getOrCreateDbUser(decoded);

          if (!result.accessToken || !result.idToken || !dbUser?.id) {
            throw new CognitoCredentialsError("credentials");
          }

          return {
            id: dbUser.id,
            name: dbUser.name ?? decoded?.name ?? null,
            email: dbUser.email ?? decoded?.email ?? email,
            accessToken: result.accessToken,
            idToken: result.idToken,
            refreshToken: result.refreshToken,
            accessTokenExpires: Date.now() + (result.expiresIn ?? 3600) * 1000,
          } satisfies AuthUser;
        } catch (error) {
          const code =
            error instanceof CognitoCredentialsError
              ? error.code
              : typeof error === "object" && error && "name" in error
                ? String((error as { name?: string }).name)
                : "credentials";

          if (code === "UserNotConfirmedException") {
            await resendConfirmationCode(email);
            throw new CognitoCredentialsError(code);
          }

          throw new CognitoCredentialsError("credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.userId = authUser.id;
        token.accessToken = authUser.accessToken;
        token.idToken = authUser.idToken;
        token.refreshToken = authUser.refreshToken;
        token.accessTokenExpires = authUser.accessTokenExpires;
      }

      const expires = typeof token.accessTokenExpires === "number" ? token.accessTokenExpires : 0;
      if (expires && Date.now() < expires - 60_000) {
        return token;
      }

      return refreshCognitoAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : token.sub ?? "";
      }

      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.idToken = typeof token.idToken === "string" ? token.idToken : undefined;
      session.refreshToken = typeof token.refreshToken === "string" ? token.refreshToken : undefined;
      session.error = typeof token.error === "string" ? token.error : undefined;

      return session;
    },
  },
});
