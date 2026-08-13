// "use client";

/* eslint-disable @typescript-eslint/no-explicit-any */


type ApiResponse<T = any> = {
  message?: string;
  data?: T;
  code?: string;
};

export type AuthSessionResponse = {
  authenticated: boolean;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  userId?: string;
  user?: {
    userId?: string;
    email?: string;
  };
};

async function request<T>(
  endpoint: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`/api/auth${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      ...options,
    });

    // Guard: only parse JSON if the response is actually JSON
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      throw new Error(`Unexpected response (${res.status}): ${res.statusText}`);
    }

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Something went wrong") as Error & {
        code?: string;
        status?: number;
      };
      error.code = data.code;
      error.status = res.status;
      throw error;
    }

    return data;
  } catch (error: any) {
    const nextError = new Error(error.message) as Error & {
      code?: string;
      status?: number;
    };
    nextError.code = error.code;
    nextError.status = error.status;
    throw nextError;
  }
}

export async function signUp(payload: {
  email: string;
  password: string;
  phone: string;
  name: string;
  ref: string;
}) {
  return request("/sign-up", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export async function signIn(payload: {
  email: string;
  password: string;
}) {
  const { signIn: nextAuthSignIn } = await import("next-auth/react");
  const result = await nextAuthSignIn("credentials", {
    email: payload.email,
    password: payload.password,
    redirect: false,
  });

  if (result?.error) {
    const error = new Error(
      result.code === "UserNotConfirmedException"
        ? "Please verify your email first. A new OTP has been sent."
        : "Incorrect email or password",
    ) as Error & { code?: string; status?: number };
    error.code = result.code ?? result.error;
    error.status = result.status;
    throw error;
  }

  return { message: "Login successful" };
}

export async function forgotPassword(email: string) {
  return request("/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resendOtp(email: string) {
  return request("/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmForgotPassword(payload: {
  email: string;
  code: string;
  newPassword: string;
}) {
  return request("/confirm-forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(payload: {
  email: string;
  code: string;
}) {
  return request("/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Phone / Mobile OTP endpoints (backend must expose these routes)
export async function sendOtpToPhone(phone: string) {
  return request("/send-otp-phone", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtpPhone(payload: { phone: string; code: string }) {
  return request("/verify-otp-phone", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendOtpPhone(phone: string) {
  return request("/resend-otp-phone", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function refreshToken(payload: {
  refreshToken: string;
  idToken: string;
}) {
  return request("/refersh-token", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  const { signOut } = await import("next-auth/react");
  await signOut({ redirect: false });
}
export async function session(): Promise<AuthSessionResponse> {
  const res = await fetch("/api/auth/session", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    return { authenticated: false };
  }

  const data = await res.json();
  const userId = data?.user?.id;

  return {
    authenticated: Boolean(userId),
    accessToken: data?.accessToken,
    idToken: data?.idToken,
    refreshToken: data?.refreshToken,
    userId,
    user: {
      userId,
      email: data?.user?.email,
    },
  };
}

export async function isUserLoggedIn(): Promise<boolean> {
  try {
    const res = await session();

    return res?.authenticated ?? false;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}

export async function changePassword(payload: {
  previousPassword: string;
  proposedPassword: string;
}) {
  return request("/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
