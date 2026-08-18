"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  confirmWithCognito,
  loginWithCredentials,
  resendVerificationCode,
} from "@/lib/actions/auth";
import { imageKitUrl } from "@/lib/imagekit-url";
import Link from "@/hooks/appLink";
import { EyeIcon, LockIcon, MailIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const PENDING_SIGNUP_EMAIL_KEY = "pendingSignupEmail";

export function VerifyEmailForm() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");

  React.useEffect(() => {
    const storedEmail = sessionStorage.getItem(PENDING_SIGNUP_EMAIL_KEY);
    const nextEmail = emailFromUrl || storedEmail;

    if (!nextEmail) {
      router.push("/sign-in");
      return;
    }

    sessionStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, nextEmail);
    setEmail(nextEmail);
  }, [emailFromUrl, router]);

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

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    if (loading) return;
    if (!email) {
      toast.error("Please start signup again to verify your email.");
      router.push("/sign-up");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");

    try {
      const result = await confirmWithCognito({ email, code: otp });

      if (result?.error) {
        toast.error(result.error, { id: toastId });
        setLoading(false);
      }
    } catch (error) {
      const nextError = error as Error & { digest?: string };

      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        sessionStorage.removeItem(PENDING_SIGNUP_EMAIL_KEY);
        toast.success("Email verified successfully", { id: toastId });
        return;
      }

      toast.error(nextError.message || "Verification failed", { id: toastId });
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || loading) return;
    if (!email) {
      toast.error("Please start signup again to resend OTP.");
      router.push("/sign-up");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Resending OTP...");

    try {
      const result = await resendVerificationCode(email);

      if (result.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success("OTP resent successfully", { id: toastId });
        setTimer(30);
        setCanResend(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validateEmail = () => {
    let valid = true;
    const nextErrors = { email: "", password: "", general: "" };

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
      valid = false;
    }

    if (!formData.password) {
      nextErrors.password = "Password is required";
      valid = false;
    }

    setErrors(nextErrors);
    return valid;
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail()) return;
    setEmailLoading(true);

    try {
      const result = await loginWithCredentials({
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        toast.error(result.error);
        setErrors((prev) => ({ ...prev, general: result.error ?? "" }));
        setEmailLoading(false);
      }
    } catch (error) {
      const nextError = error as Error & { digest?: string };

      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Login successful");
        return;
      }

      toast.error(nextError.message || "Login failed");
      setErrors((prev) => ({
        ...prev,
        general: nextError.message || "Login failed",
      }));
      setEmailLoading(false);
    }
  };

  return (
    <section>
      <div className="w-full px-4 lg:px-0 flex min-h-screen bg-black text-white">
        <div className="hidden lg:block min-h-screen w-1/2 z-10">
          <Link href="/">
            <Image
              className="h-full object-cover content-center"
              src={imageKitUrl("website-images/otp.jpeg")}
              alt="Login Image"
              width={1300}
              height={800}
              priority
            />
          </Link>
        </div>
        <div className="space-y-4 max-w-2xl mx-auto justify-center text-left items-center my-auto">
          <div className="absolute -top-20 right-0 w-40 h-40 blur-[110px] bg-[#FFDD00]" />
          <h1 className="text-4xl font-bold p-0">Welcome Back</h1>
          <p className="text-sm -mt-5">Sign In To Your Account</p>
          <div className="w-full text-center z-10">
            <Tabs
              defaultValue="phone"
              className="w-full border-none text-center justify-center items-center my-auto"
            >
              <TabsList variant="line" className="w-full mb-4 justify-between">
                <TabsTrigger
                  disabled
                  className="!text-white data-[state=active]:!text-white border data-[state=active]:!border-[#FDB813] after:absolute after:bg-[#FDB813] after:opacity-0 after:transition-opacity"
                  value="email"
                >
                  Login by Email
                </TabsTrigger>
                <TabsTrigger
                  className="!text-white data-[state=active]:!text-white border data-[state=active]:!border-[#FDB813] after:absolute after:bg-[#FDB813] after:opacity-0 after:transition-opacity"
                  value="phone"
                >
                  Login by OTP
                </TabsTrigger>
              </TabsList>
              <TabsContent className="grid grid-cols-1 gap-4" value="email">
                <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
                  <InputGroupInput
                    id="email-login-input"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleEmailChange}
                  />
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </InputGroup>

                <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
                  <InputGroupInput
                    id="password-login-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleEmailChange}
                  />
                  <InputGroupAddon>
                    <LockIcon />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <EyeIcon />
                  </InputGroupAddon>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </InputGroup>
                {errors.general && (
                  <p className="text-red-500 text-xs mt-1">{errors.general}</p>
                )}
                <div className="lg:w-96 mb-2">
                  <Link
                    href="/forgot-password"
                    className="float-right text-[#FDB813] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  onClick={handleEmailSubmit}
                  disabled={emailLoading}
                  className="lg:w-96 py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold"
                >
                  {emailLoading ? "Logging in..." : "Sign in"}
                </Button>
              </TabsContent>
              <TabsContent
                value="phone"
                className="w-full grid grid-cols-1 gap-4 justify-center items-center mx-auto"
              >
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPGroup key={index}>
                      <InputOTPSlot index={index} />
                    </InputOTPGroup>
                  ))}
                </InputOTP>

                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="lg:w-96 py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold"
                >
                  {loading ? "Verifying..." : "Confirm"}
                </Button>

                <div className="flex justify-between lg:w-96 text-sm">
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
                    disabled={!canResend || loading}
                    className={
                      canResend
                        ? "text-[#FDB813] font-medium"
                        : "text-gray-400 cursor-not-allowed"
                    }
                  >
                    Resend
                  </button>
                </div>

                <p>
                  Don&apos;t have account?{" "}
                  <Link href="/sign-up" className="text-[#FDB813] underline">
                    Create Account
                  </Link>
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
