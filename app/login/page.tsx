"use client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "@/hooks/appLink";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { credentialsSignIn } from "@/helper/auth/credentials-sign-in";
import { toast } from "sonner";
import {
  type ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { imageKitUrl } from "@/lib/imagekit-url";

const PENDING_SIGNUP_EMAIL_KEY = "pendingSignupEmail";

declare global {
  interface Window {
    grecaptcha?: unknown;
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const Page = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    const email = params.get("email");

    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }

    if (verified === "1") {
      toast.success("Email verified. Please sign in to continue.");
      router.replace("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validate = () => {
    let valid = true;

    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);

    try {
      const result = await credentialsSignIn({
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        setLoading(false);

        if (result.code === "UserNotConfirmedException") {
          sessionStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, formData.email);
          toast.info("Please verify your email first.");
          router.push("/verify-otp");
          return;
        }

        toast.error(result.error || "Login failed");
        setErrors((prev) => ({
          ...prev,
          general: result.error || "Login failed",
        }));
        return;
      }

      toast.success("Login successful");
      router.push("/");
      router.refresh();
      setLoading(false);
    } catch (err: unknown) {
      // NEXT_REDIRECT errors are re-thrown by the server action on successful login
      // Let them propagate naturally — Next.js handles the redirect
      const error = err as Error & { digest?: string };
      if (error?.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Login successful");
        return;
      }

      setLoading(false);
      toast.error("Login failed");
      setErrors((prev) => ({
        ...prev,
        general: "Login failed",
      }));
    }
  };

  const setupRecaptcha = () => {
    // Wait for grecaptcha to be available and render verifier once
    if (typeof window === "undefined") return;

    const ensure = async () => {
      // wait briefly for grecaptcha to load
      for (let i = 0; i < 20; i++) {
        if (window.grecaptcha) break;
        await new Promise((r) => setTimeout(r, 100));
      }

      if (!window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
              size: "invisible",
            },
          );
          console.debug("RecaptchaVerifier initialized");
        } catch (err) {
          console.error("Recaptcha initialization error:", err);
        }
      }
    };

    // Kick off ensure but don't block caller
    ensure();
  };

  const sendOtp = async () => {
    if (!phone) {
      toast.error("Please enter mobile number");
      return;
    }

    try {
      setOtpLoading(true);

      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        appVerifier,
      );

      setConfirmationResult(result);

      toast.success("OTP sent successfully 🎉");
      setOtpLoading(false);
    } catch (err: unknown) {
      const error = err as Error;
      console.log(error);
      toast.error(error.message);
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setVerifyLoading(true);

      if (!confirmationResult) {
        toast.error("Please request OTP first");
        setVerifyLoading(false);
        return;
      }

      const userCredential = await confirmationResult.confirm(otp);

      // Exchange Firebase ID token with backend to create a session
      try {
        const currentUser = userCredential.user;
        const idToken = await currentUser.getIdToken();

        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_AUTH_API_URL}/firebase-login`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          },
        );
      } catch (exchangeErr) {
        console.warn("Token exchange failed:", exchangeErr);
      }

      toast.success("Login successful");

      router.push("/dashboard");

      setVerifyLoading(false);
    } catch (error) {
      console.log(error);

      toast.error("Invalid OTP");

      setVerifyLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <section>
      <div className="w-full flex min-h-screen bg-black text-white ">
        <div className=" lg:block hidden min-h-screen w-1/2 z-10">
          <Link href="/">
            <Image
              className="h-full object-cover content-center"
              src={imageKitUrl("website-images/login-wallpaper.jpeg")}
              alt="Login Image"
              width={1600}
              height={1300}
            />
          </Link>
        </div>
        <div className=" space-y-4  max-w-2xl mx-auto  justify-center text-left items-center my-auto">
          <div className="absolute  -top-20 right-0 w-40 h-40 blur-[110px] bg-[#FFDD00]"></div>
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
          <p className="text-sm m-2  ">Sign In To Your Account</p>
          <div className="w-full text-center z-10">
            <Tabs
              defaultValue="email"
              className="w-full   border-none  text-center justify-center items-center my-auto"
            >
              <TabsList
                variant="line"
                className="w-full mb-4 max-w-40 justify-between"
              >
                <TabsTrigger
                  className=" !text-white data-[state=active]:!text-white border  data-[state=active]:!border-[#FDB813] after:absolute after:bg-[#FDB813] after:opacity-0 after:transition-opacity"
                  value="email"
                >
                  Login by Email
                </TabsTrigger>
                {/* <TabsTrigger
                  className="!text-white data-[state=active]:!text-white border  data-[state=active]:!border-[#FDB813] after:absolute after:bg-[#FDB813] after:opacity-0 after:transition-opacity"
                  value="phone"
                >
                  Login by OTP
                </TabsTrigger> */}
              </TabsList>
              <TabsContent className="grid grid-cols-1 gap-4" value="email">
                <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
                  <InputGroupInput
                    className="  "
                    id="inline-end-input"
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
                    id="inline-end-input"
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
                  onClick={handleSubmit}
                  disabled={loading}
                  className="lg:w-96 py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <p className="">
                  Don&apos;t have account?{" "}
                  <Link href="/register" className="text-[#FDB813] underline">
                    Create Account
                  </Link>
                </p>
              </TabsContent>
              {/* <TabsContent value="phone" className="grid grid-cols-1 gap-4">
                <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
                  <InputGroupInput
                    id="inline-end-input"
                    type="password"
                    placeholder="Mobile Number"
                    className=" placeholder:text-[#8C8C8C]"
                  />
                  <InputGroupAddon>
                    <PhoneIcon />
                  </InputGroupAddon>
                </InputGroup>

                <Button className="w-96 py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold">
                  Sent OTP
                </Button>
                <p className="">
                  Don&apos;t have account?{" "}
                  <a href="/signup" className="text-[#FDB813] underline">
                    Create Account
                  </a>
                </p>
              </TabsContent> */}
              <TabsContent value="phone" className="grid grid-cols-1 gap-4">
                <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
                  <InputGroupInput
                    type="text"
                    placeholder="Enter Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="placeholder:text-[#8C8C8C]"
                  />
                  <InputGroupAddon>
                    <PhoneIcon />
                  </InputGroupAddon>
                </InputGroup>

                <Button
                  onClick={sendOtp}
                  disabled={otpLoading}
                  className="w-96 py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold"
                >
                  {otpLoading ? "Sending OTP..." : "Send OTP"}
                </Button>

                {confirmationResult && (
                  <>
                    <InputGroup className="max-w-96 py-5 bg-[#141414] rounded-xs px-3 border border-[#454545]">
                      <InputGroupInput
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="placeholder:text-[#8C8C8C]"
                      />
                    </InputGroup>

                    <Button
                      onClick={verifyOtp}
                      disabled={verifyLoading}
                      className="w-96 py-5 rounded-xs bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold"
                    >
                      {verifyLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </>
                )}

                <div id="recaptcha-container"></div>

                <p>
                  Don&apos;t have account?{" "}
                  <Link href="/register" className="text-[#FDB813] underline">
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
};

export default Page;
