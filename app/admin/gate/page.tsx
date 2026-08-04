"use client";

import Image from "next/image";
import React, { useState } from "react";
import { imageKitUrl } from "@/lib/imagekit-url";

export default function AdminGatePage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Sign-in failed");
        return;
      }
      window.location.assign(new URL("/admin", window.location.origin).toString());
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative text-white bg-black min-h-screen w-full flex items-center justify-center p-6 ">
      <div className="w-full max-w-md bg-gray-950  rounded-2xl border  p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Image src={imageKitUrl("logo.png")} alt="Logo" width={90} height={50} className="object-contain" />
        </div>
        <h1 className="text-center text-xl font-semibold text-foreground">Admin sign-in</h1>
        <p className="mt-1 text-center text-sm  ">
          Only the configured admin ID and password can open the admin panel.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-id" className="mb-1 block text-sm font-medium">
              Admin ID
            </label>
            <input
              id="admin-id"
              name="id"
              autoComplete="username"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-700 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Continue to admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
