"use server";

import { nextAuthSignIn } from "@/auth";
import { AuthError } from "next-auth";

export async function credentialsSignIn(payload: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string; code?: string }> {
  try {
    const result = await nextAuthSignIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    // With redirect: false, signIn returns a URL string.
    // If it contains an error param, auth failed.
    if (typeof result === "string") {
      try {
        const url = new URL(result, "http://localhost");
        const error = url.searchParams.get("error");
        const code = url.searchParams.get("code");

        if (error) {
          if (code === "UserNotConfirmedException") {
            return {
              success: false,
              error: "Please verify your email first. A new OTP has been sent.",
              code,
            };
          }

          return {
            success: false,
            error: "Incorrect email or password",
            code: code ?? error,
          };
        }
      } catch {
        // URL parsing failed, treat as success if no error indicator
      }
    }

    return { success: true };
  } catch (error) {
    // In auth.js v5, signIn with redirect: true (default) throws
    // NEXT_REDIRECT on success. With redirect: false it shouldn't,
    // but handle it defensively.
    if (
      error instanceof Error &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")
    ) {
      // Successful sign-in that triggers a redirect — re-throw so
      // Next.js handles the navigation.
      throw error;
    }

    if (error instanceof AuthError) {
      const code =
        "code" in error
          ? (error as AuthError & { code?: string }).code
          : undefined;

      if (code === "UserNotConfirmedException") {
        return {
          success: false,
          error: "Please verify your email first. A new OTP has been sent.",
          code,
        };
      }

      return {
        success: false,
        error: "Incorrect email or password",
        code: code ?? error.type,
      };
    }

    return { success: false, error: "Login failed" };
  }
}
