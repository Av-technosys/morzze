"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  LockIcon,
  MailIcon,
  PhoneIcon,
  TicketPercentIcon,
  User2,
} from "lucide-react";
import Image from "next/image";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/helper";
import { toast } from "sonner";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "@/hooks/appLink";
import { imageKitUrl } from "@/lib/imagekit-url";

const PENDING_SIGNUP_EMAIL_KEY = "pendingSignupEmail";

type AuthError = Error & {
  code?: string;
};

const RegisterContent = () => {
  const params = useSearchParams();
  const ref = params.get("ref");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password required";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (loading) return;

    setLoading(true);

    const toastId = toast.loading("Creating your account...");

    try {
      const res = await signUp({
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        name: formData.fullName,
        ref: formData?.ref || "",
      });

      toast.success(res.message || "OTP sent!", {
        id: toastId,
      });

      sessionStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, formData.email);
      router.push("/verify-otp");
    } catch (err: unknown) {
      const error = err as AuthError;
      toast.error(error.message || "Signup failed ❌", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="w-full flex h-screen bg-black text-white ">
        <div className="hidden lg:block w-1/2 z-10">
          <Link href="/">
            <Image
              className="h-full"
              src={imageKitUrl("website-images/login-wallpaper.jpeg")}
              alt="Login Image"
              width={1600}
              height={1300}
            />
          </Link>
        </div>
        <div className=" space-y-4 px-4 lg:px-0 max-w-2xl mx-auto  justify-center text-left items-center my-auto">
          <div className="absolute  -top-20 right-0 w-40 h-40 blur-[110px] bg-[#FFDD00]"></div>
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
          <p className="text-sm m-2  ">Sign In To Your Account</p>
          <div className="w-full grid grid-cols-1 gap-4 text-center z-10">
            <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                className="  "
                id="inline-end-input"
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

            <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                className="  "
                id="inline-end-input"
                name="email"
                type="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                className="  "
                id="inline-end-input"
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

            <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                className="  "
                id="inline-end-input"
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

            <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                id="inline-end-input"
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
                  {showPassword ? (
                    <IconEyeOff size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </InputGroupAddon>
            </InputGroup>
            <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
              <InputGroupInput
                id="inline-end-input"
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
                  {showConfirmPassword ? (
                    <IconEyeOff size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>
              </InputGroupAddon>
            </InputGroup>

            <Button
              onClick={handleSubmit}
              className="lg:w-96 py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold"
            >
              Create Account
            </Button>
            <p className="">
              Already have an account?{" "}
              <a href="/login" className="text-[#FDB813] underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <section>
          <div className="w-full flex h-screen bg-black text-white items-center justify-center">
            <p>Loading...</p>
          </div>
        </section>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
