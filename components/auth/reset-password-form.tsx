"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  resetPasswordWithCognito,
  sendForgotPasswordCode,
} from "@/lib/actions/auth";
import Link from "@/hooks/appLink";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  IconArrowLeft,
  IconEye,
  IconEyeOff,
  IconLock,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { toast } from "sonner";

function ResetPasswordContent() {
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const codeFromUrl = searchParams.get("code") ?? "";
  const code = codeFromUrl || otp;

  React.useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  React.useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend || !email) return;

    const toastId = toast.loading("Resending OTP...");
    const result = await sendForgotPasswordCode(email);

    if (result.error) {
      toast.error(result.error, { id: toastId });
    } else {
      toast.success("OTP resent successfully", { id: toastId });
      setTimer(30);
      setCanResend(false);
    }
  };

  const handleReset = async () => {
    if (!code.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Both fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (loading) return;
    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const result = await resetPasswordWithCognito({
        email,
        code,
        password,
        confirmPassword,
      });

      if (result?.error) {
        toast.error(result.error, { id: toastId });
        setLoading(false);
      }
    } catch (error) {
      const nextError = error as Error & { digest?: string };

      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Password reset successful", { id: toastId });
        setOpenPopup(true);
        return;
      }

      toast.error(nextError.message || "Failed to reset password", {
        id: toastId,
      });
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
          <IconArrowLeft size={18} />
          <span>Back to Login</span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Set New Password
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your registered email to receive reset link
          </p>
        </div>

        <div className="space-y-4">
          {!codeFromUrl ? (
            <>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                containerClassName="w-full"
              >
                <InputOTPGroup className="w-full flex justify-between gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="flex-1 h-14 bg-[#1A1A1A] border border-gray-800 rounded-md text-lg font-semibold focus:ring-1 focus:ring-[#FFB800] outline-none"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="flex items-center justify-between text-xs">
                {!canResend ? (
                  <span className="text-white font-semibold">
                    Resend OTP in 00:{timer.toString().padStart(2, "0")}
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    You can resend OTP
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={
                    canResend
                      ? "text-[#FDB813] font-medium"
                      : "text-gray-400 cursor-not-allowed"
                  }
                >
                  Resend
                </button>
              </div>
            </>
          ) : null}

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
              <IconLock size={18} stroke={1.5} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-md py-3.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
              <IconLock size={18} stroke={1.5} />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-gray-800 rounded-md py-3.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#FFB800] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300"
            >
              {showConfirm ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-[#FFB800] hover:bg-[#e5a600] text-black font-bold py-3.5 rounded-md transition-colors mt-2"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
      <Dialog open={openPopup}>
        <DialogContent className="bg-[#0F0F0F] border border-[#2A2A2A] text-white w-full max-w-md p-0 rounded-[20px] overflow-hidden">
          <div className="px-6 py-4">
            <DialogTitle className="text-xl font-bold mb-2 text-white">
              Success
            </DialogTitle>
            <p className="text-sm text-gray-300 mb-4">
              Password reset successfully! You can now login with your new
              password.
            </p>
          </div>

          <div className="flex items-center justify-end p-4 border-t border-[#2A2A2A] bg-[#171717]">
            <Link
              href="/sign-in"
              className="text-[#FFB800] text-sm font-medium hover:text-white transition-colors px-4 py-2"
            >
              Login Now
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <section className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
          <div className="w-full max-w-md text-center">Loading...</div>
        </section>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
