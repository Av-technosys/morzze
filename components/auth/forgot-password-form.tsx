"use client";

import { forgotPasswordWithCognito } from "@/lib/actions/auth";
import Link from "@/hooks/appLink";
import { ArrowLeft, MailIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (loading) return;
    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      const result = await forgotPasswordWithCognito(email);

      if (result?.error) {
        toast.error(result.error, { id: toastId });
        setLoading(false);
      }
    } catch (error) {
      const nextError = error as Error & { digest?: string };

      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("OTP sent to your email", { id: toastId });
        return;
      }

      toast.error(nextError.message || "Something went wrong", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/sign-in"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Login</span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
          <p className="text-gray-400 text-sm">
            Enter your registered email to receive reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MailIcon size={18} className="text-gray-500" />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-md py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFB800] hover:bg-[#e5a600] text-black font-bold py-3.5 rounded-md transition-colors"
          >
            {loading ? "Sending..." : "Confirm"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t Have An Account?{" "}
          <Link
            href="/sign-up"
            className="text-[#FFB800] font-medium hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </section>
  );
}
