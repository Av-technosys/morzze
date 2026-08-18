"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { signupWithCognito } from "@/lib/actions/auth";
import { imageKitUrl } from "@/lib/imagekit-url";
import Link from "@/hooks/appLink";
import {
  LockIcon,
  MailIcon,
  PhoneIcon,
  TicketPercentIcon,
  User2,
} from "lucide-react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { toast } from "sonner";

const PENDING_SIGNUP_EMAIL_KEY = "pendingSignupEmail";

function SignupFormContent() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    ref: ref || "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

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
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const nextErrors = {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
      isValid = false;
    }

    if (formData.phone.trim() && formData.phone.trim().length < 10) {
      nextErrors.phone = "Phone must be at least 10 digits";
      isValid = false;
    }

    if (!formData.password) {
      nextErrors.password = "Password required";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || loading) return;

    setLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      const result = await signupWithCognito({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone.trim() || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (result?.error) {
        toast.error(result.error, { id: toastId });
        setLoading(false);
        return;
      }
    } catch (error) {
      const nextError = error as Error & { digest?: string };

      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        sessionStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, formData.email);
        toast.success("Verification code sent!", { id: toastId });
        return;
      }

      toast.error(nextError.message || "Signup failed", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="w-full flex min-h-screen bg-black text-white">
        <div className="hidden lg:block min-h-screen w-1/2 z-10">
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
        <div className="space-y-4 px-4 lg:px-0 mx-auto justify-center text-left items-center w-full max-w-md my-auto">
          <div className="absolute -top-20 right-0 w-40 h-40 blur-[110px] bg-[#FFDD00]" />
          <div className="lg:hidden flex items-center gap-2 text-sm text-white mb-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10"
              aria-label="Go back"
            >
              <span className="text-base">←</span>
              Back
            </button>
          </div>
          <h1 className="text-4xl font-bold p-0">Welcome Back</h1>
          <p className="text-sm m-2">Sign In To Your Account</p>
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-1 gap-4 text-center z-10"
          >
            <InputGroup className=" py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
              <InputGroupAddon>
                <User2 />
              </InputGroupAddon>
            </InputGroup>
            {errors.fullName && (
              <p className=" text-left text-red-500 text-xs">
                {errors.fullName}
              </p>
            )}

            <InputGroup className=" py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>
            {errors.email && (
              <p className=" text-left text-red-500 text-xs">{errors.email}</p>
            )}

            <InputGroup className=" py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                name="phone"
                type="text"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
              />
              <InputGroupAddon>
                <PhoneIcon />
              </InputGroupAddon>
            </InputGroup>
            {errors.phone && (
              <p className=" text-left text-red-500 text-xs">{errors.phone}</p>
            )}

            <InputGroup className=" py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                name="ref"
                type="text"
                value={formData.ref}
                placeholder="Referal Code"
                onChange={handleChange}
              />
              <InputGroupAddon>
                <TicketPercentIcon />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup className=" py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputGroupAddon>
                <LockIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </InputGroupAddon>
            </InputGroup>
            {errors.password && (
              <p className=" text-left text-red-500 text-xs">
                {errors.password}
              </p>
            )}

            <InputGroup className=" py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <InputGroupAddon>
                <LockIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </InputGroupAddon>
            </InputGroup>
            {errors.confirmPassword && (
              <p className=" text-left text-red-500 text-xs">
                {errors.confirmPassword}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className=" py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <p className="">
              Already have account?{" "}
              <Link href="/sign-in" className="text-[#FDB813] underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export function SignupForm() {
  return (
    <Suspense fallback={null}>
      <SignupFormContent />
    </Suspense>
  );
}
