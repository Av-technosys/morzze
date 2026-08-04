import { NextRequest, NextResponse } from "next/server";
import {
  adminSecretsEqual,
  getAdminAccessCookieName,
  signAdminSession,
} from "@/lib/admin-access-cookie";

const COOKIE = getAdminAccessCookieName();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string; password?: string };
    const id = typeof body.id === "string" ? body.id : "";
    const password = typeof body.password === "string" ? body.password : "";

    const expectedId = process.env.ADMIN_ACCESS_ID ?? "kumarlavesh2001@gmail.com";
    const expectedPassword = process.env.ADMIN_ACCESS_PASSWORD ?? "Lavesh@123";

    if (!expectedId || !expectedPassword) {
      return NextResponse.json(
        { error: "Admin access is not configured on the server." },
        { status: 503 },
      );
    }

    if (!adminSecretsEqual(id, expectedId) || !adminSecretsEqual(password, expectedPassword)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminSession();
    if (!token) {
      return NextResponse.json(
        { error: "Server signing secret missing or too short (ADMIN_ACCESS_COOKIE_SECRET)." },
        { status: 503 },
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: request.nextUrl.protocol === "https:",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: request.nextUrl.protocol === "https:",
  });
  return res;
}
