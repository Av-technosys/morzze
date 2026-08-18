import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = [
  "bishnoi11011@gmail.com",
  "karishmaavtechnosys@gmail.com",
  "morzzeindia@gmail.com",
  ...(process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
];

function withCallback(pathname: string, requestUrl: string) {
  const loginUrl = new URL("/sign-in", requestUrl);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return loginUrl;
}

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isAdminPath =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdminPath) {
    const email = request.auth?.user?.email?.toLowerCase();

    if (!email || !ADMIN_EMAILS.includes(email)) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return NextResponse.redirect(withCallback(pathname, request.url));
    }

    return NextResponse.next();
  }

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/checkout");

  if (isProtectedRoute && !request.auth) {
    return NextResponse.redirect(withCallback(pathname, request.url));
  }

  const isAuthPage =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/verify-email" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp" ||
    pathname === "/forgot-otp" ||
    pathname === "/new-password";

  if (isAuthPage && request.auth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/sign-in",
    "/sign-up",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-otp",
    "/new-password",
  ],
};
