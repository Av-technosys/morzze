"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { signIn, signOut } from "@/auth";
import {
  AWS_COGNITO_REGION,
  USER_POOL_CLIENT_ID,
  USER_POOL_CLIENT_SECRET,
} from "@/env";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type ResetPasswordInput,
  type SignupInput,
  type VerifyEmailInput,
} from "@/lib/validations/auth";

type ActionResult = {
  success?: boolean;
  message?: string;
  error?: string;
};

const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_COGNITO_REGION,
});

function calculateSecretHash(username: string) {
  return crypto
    .createHmac("sha256", USER_POOL_CLIENT_SECRET)
    .update(username + USER_POOL_CLIENT_ID)
    .digest("base64");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getSafeCallbackUrl(callbackUrl?: string | null) {
  if (
    callbackUrl &&
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//")
  ) {
    return callbackUrl;
  }

  return "/dashboard";
}

function getAuthErrorCode(error: unknown) {
  if (error instanceof AuthError) {
    const cause = error.cause as { err?: Error } | undefined;
    const code =
      "code" in error
        ? (error as AuthError & { code?: string }).code
        : undefined;

    return code ?? cause?.err?.message ?? error.type;
  }

  if (error instanceof Error) return error.message;

  return undefined;
}

function getSignInErrorCode(response: unknown) {
  if (!response || typeof response !== "object") return undefined;

  const result = response as {
    error?: string | null;
    code?: string | null;
    url?: string | null;
  };

  if (result.code) return result.code;
  if (result.error) return result.error;

  if (result.url) {
    const url = new URL(result.url, "http://localhost");
    return url.searchParams.get("code") ?? url.searchParams.get("error");
  }

  return undefined;
}

function cognitoErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    switch (error.name) {
      case "CodeMismatchException":
        return "The verification code is incorrect.";
      case "ExpiredCodeException":
        return "The verification code has expired. Please request a new one.";
      case "UsernameExistsException":
        return "An account with this email already exists.";
      case "UserNotFoundException":
        return "No account was found for this email.";
      case "InvalidPasswordException":
        return "Password does not meet the Cognito password requirements.";
      case "LimitExceededException":
      case "TooManyRequestsException":
        return "Too many attempts. Please try again later.";
      default:
        break;
    }
  }

  return fallback;
}

async function createLocalProfile(data: {
  email: string;
  name: string;
  phone?: string;
}) {
  if (!process.env.DATABASE_URL) return;

  try {
    const [{ db }, { users }] = await Promise.all([
      import("@/db"),
      import("@/db/schema"),
    ]);

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existing) {
      await db
        .update(users)
        .set({
          name: data.name,
          phone: data.phone ?? "",
          emailVerified: false,
        })
        .where(eq(users.email, data.email));
      return;
    }

    await db.insert(users).values({
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      password: "COGNITO_AUTH",
      emailVerified: false,
    });
  } catch (error) {
    console.error("Failed to create local Cognito profile:", error);
  }
}

async function markLocalEmailVerified(email: string) {
  if (!process.env.DATABASE_URL) return;

  try {
    const [{ db }, { users }] = await Promise.all([
      import("@/db"),
      import("@/db/schema"),
    ]);

    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.email, email));
  } catch (error) {
    console.error("Failed to mark local email as verified:", error);
  }
}

export async function loginWithCredentials(
  data: LoginInput & { callbackUrl?: string | null },
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid login data." };
  }

  const email = normalizeEmail(parsed.data.email);
  const redirectTo = getSafeCallbackUrl(data.callbackUrl);
  let shouldVerifyEmail = false;

  try {
    const response = await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirect: false,
    });

    const responseCode = getSignInErrorCode(response);
    if (responseCode) {
      if (responseCode === "UserNotConfirmedException") {
        shouldVerifyEmail = true;
      } else {
        return { error: "Incorrect email or password." };
      }
    }

    if (typeof response === "string") {
      const url = new URL(response, "http://localhost");
      const error = url.searchParams.get("error");
      const code = url.searchParams.get("code");

      if (error || code) {
        if (code === "UserNotConfirmedException") {
          shouldVerifyEmail = true;
        } else {
          return { error: "Incorrect email or password." };
        }
      }
    }
  } catch (error) {
    const code = getAuthErrorCode(error);

    if (code === "UserNotConfirmedException") {
      shouldVerifyEmail = true;
    } else {
      return { error: "Incorrect email or password." };
    }
  }

  if (shouldVerifyEmail) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  redirect(redirectTo);
}

export async function signupWithCognito(
  data: SignupInput,
): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid sign-up data." };
  }

  const email = normalizeEmail(parsed.data.email);
  const rawPhone = parsed.data.phone?.trim() || undefined;
  const phone =
    rawPhone && rawPhone.startsWith("+")
      ? rawPhone
      : rawPhone && /^\d{10}$/.test(rawPhone)
        ? `+91${rawPhone}`
        : rawPhone;

  try {
    await cognitoClient.send(
      new SignUpCommand({
        ClientId: USER_POOL_CLIENT_ID,
        Username: email,
        Password: parsed.data.password,
        SecretHash: calculateSecretHash(email),
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: parsed.data.name },
          ...(phone ? [{ Name: "phone_number", Value: phone }] : []),
        ],
      }),
    );

    await createLocalProfile({
      email,
      name: parsed.data.name,
      phone,
    });
  } catch (error) {
    return {
      error: cognitoErrorMessage(error, "Unable to create your account."),
    };
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function confirmWithCognito(
  data: VerifyEmailInput,
): Promise<ActionResult> {
  const parsed = verifyEmailSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid verification data.",
    };
  }

  const email = normalizeEmail(parsed.data.email);

  try {
    await cognitoClient.send(
      new ConfirmSignUpCommand({
        ClientId: USER_POOL_CLIENT_ID,
        Username: email,
        ConfirmationCode: parsed.data.code,
        SecretHash: calculateSecretHash(email),
      }),
    );

    await markLocalEmailVerified(email);
  } catch (error) {
    return {
      error: cognitoErrorMessage(error, "Unable to verify this email."),
    };
  }

  redirect("/sign-in?registered=true");
}

export async function forgotPasswordWithCognito(
  emailInput: string | ForgotPasswordInput,
): Promise<ActionResult> {
  const rawEmail =
    typeof emailInput === "string" ? emailInput : emailInput.email;
  const parsed = forgotPasswordSchema.safeParse({ email: rawEmail });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  const email = normalizeEmail(parsed.data.email);

  const result = await sendForgotPasswordCode(email);

  if (result.error) {
    return result;
  }

  redirect(`/reset-password?email=${encodeURIComponent(email)}`);
}

export async function sendForgotPasswordCode(
  emailInput: string,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({ email: emailInput });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  const email = normalizeEmail(parsed.data.email);

  try {
    await cognitoClient.send(
      new ForgotPasswordCommand({
        ClientId: USER_POOL_CLIENT_ID,
        Username: email,
        SecretHash: calculateSecretHash(email),
      }),
    );
  } catch (error) {
    return {
      error: cognitoErrorMessage(error, "Unable to send a reset code."),
    };
  }

  return { success: true, message: "Reset code sent." };
}

export async function resetPasswordWithCognito(
  data: ResetPasswordInput,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid reset password data.",
    };
  }

  const email = normalizeEmail(parsed.data.email);

  try {
    await cognitoClient.send(
      new ConfirmForgotPasswordCommand({
        ClientId: USER_POOL_CLIENT_ID,
        Username: email,
        ConfirmationCode: parsed.data.code,
        Password: parsed.data.password,
        SecretHash: calculateSecretHash(email),
      }),
    );
  } catch (error) {
    return {
      error: cognitoErrorMessage(error, "Unable to reset this password."),
    };
  }

  redirect("/sign-in?reset=true");
}

export async function resendVerificationCode(
  emailInput: string,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({ email: emailInput });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  const email = normalizeEmail(parsed.data.email);

  try {
    await cognitoClient.send(
      new ResendConfirmationCodeCommand({
        ClientId: USER_POOL_CLIENT_ID,
        Username: email,
        SecretHash: calculateSecretHash(email),
      }),
    );
  } catch (error) {
    return {
      error: cognitoErrorMessage(error, "Unable to resend the verification code."),
    };
  }

  return { success: true, message: "Verification code sent." };
}

export async function signOutToSignIn() {
  await signOut({ redirectTo: "/sign-in" });
}
