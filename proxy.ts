import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAdminAccessCookieName, verifyAdminSession } from "@/lib/admin-access-cookie";

const ADMIN_COOKIE = getAdminAccessCookieName();

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/admin")) {
    const method = req.method;
    if (pathname === "/api/admin/access" && (method === "POST" || method === "DELETE")) {
      return NextResponse.next();
    }
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname === "/admin/register" || pathname.startsWith("/admin/register/")) {
      return NextResponse.redirect(new URL("/signup", req.url));
    }

    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    const ok = verifyAdminSession(token);
    const isGate = pathname === "/admin/gate" || pathname.startsWith("/admin/gate/");
    if (isGate) {
      if (ok) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    if (!ok) {
      return NextResponse.redirect(new URL("/admin/gate", req.url));
    }
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });
  const isAuth = Boolean(token?.userId ?? token?.sub);

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/email-verification") ||
    pathname.startsWith("/reset-password-email") ||
    pathname.startsWith("/reset-password-otp") ||
    pathname.startsWith("/reset-password-confirm");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/checkout");

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/api/admin/:path*",
  ],
};
