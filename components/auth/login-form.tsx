"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginWithCredentials } from "@/lib/actions/auth";
import { imageKitUrl } from "@/lib/imagekit-url";
import Link from "@/hooks/appLink";
import {
  ArrowLeft,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const PENDING_SIGNUP_EMAIL_KEY = "pendingSignupEmail";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const registered =
      searchParams.get("registered") === "true" ||
      searchParams.get("verified") === "1";
    const reset = searchParams.get("reset") === "true";
    const email = searchParams.get("email");

    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }

    if (registered) toast.success("Email verified. Please sign in to continue.");
    if (reset) toast.success("Password reset. Please sign in to continue.");
  }, [searchParams]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validate = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      const result = await loginWithCredentials({
        email: formData.email,
        password: formData.password,
        callbackUrl,
      });

      if (result?.error) {
        toast.error(result.error, { id: toastId });
        setErrors((prev) => ({ ...prev, general: result.error ?? "" }));
        setLoading(false);
      }
    } catch (error) {
      const nextError = error as Error & { digest?: string };

      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Login successful", { id: toastId });
        return;
      }

      if (nextError.message === "UserNotConfirmedException") {
        sessionStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, formData.email);
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }

      toast.error("Login failed", { id: toastId });
      setErrors((prev) => ({ ...prev, general: "Login failed" }));
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="w-full flex min-h-screen bg-black text-white">
        <div className="lg:block hidden min-h-screen w-1/2 z-10">
          <Link href="/">
            <Image
              className="h-full object-cover content-center"
              src={imageKitUrl("website-images/login-wallpaper.jpeg")}
              alt="Login Image"
              width={1600}
              height={1300}
              priority
            />
          </Link>
        </div>
        <div className="space-y-4 max-w-2xl mx-auto justify-center text-left items-center my-auto px-4 lg:px-0">
          <div className="absolute -top-20 right-0 w-40 h-40 blur-[110px] bg-[#FFDD00]" />
          <div className="lg:hidden flex items-center gap-2 text-sm text-white mb-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
              aria-label="Go back"
            >
              <ArrowLeft />
              Back
            </button>
          </div>
          <h1 className="text-4xl font-bold p-0">Welcome Back</h1>
          <p className="text-sm m-2">Sign In To Your Account</p>
          <div className="w-full text-center z-10">
            <Tabs
              defaultValue="email"
              className="w-full border-none text-center justify-center items-center my-auto"
            >
              <TabsList
                variant="line"
                className="w-full mb-4 max-w-40 justify-between"
              >
                <TabsTrigger
                  className="!text-white data-[state=active]:!text-white border data-[state=active]:!border-[#FDB813] after:absolute after:bg-[#FDB813] after:opacity-0 after:transition-opacity"
                  value="email"
                >
                  Login by Email
                </TabsTrigger>
              </TabsList>
              <TabsContent className="grid grid-cols-1 gap-4" value="email">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                  <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
                    <InputGroupInput
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
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
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <InputGroupAddon>
                      <LockIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </Button>
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
                    type="submit"
                    disabled={loading}
                    className="lg:w-96 py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>

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
