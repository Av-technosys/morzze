"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type CallbackFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
};

const initialFormData: CallbackFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  message: "",
};

const CallbackForm = () => {
  const [formData, setFormData] = useState<CallbackFormData>(initialFormData);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.firstName.trim())
      return toast.error("First name is required");
    if (!formData.lastName.trim()) return toast.error("Last name is required");
    if (!formData.phone.trim()) return toast.error("Phone number is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }
    if (!consent) return toast.error("Please accept the privacy consent");

    const toastId = toast.loading("Requesting callback...");

    try {
      setLoading(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          category: "callback",
          subject: "Request a Callback",
          message: formData.message.trim() || "Request a callback.",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not submit callback request");
      }

      toast.success("Callback request submitted successfully", { id: toastId });
      setFormData(initialFormData);
      setConsent(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
        { id: toastId },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#0A0A0A] border border-white/5 p-8 md:p-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Connect with Us
        </h1>
        <h2 className="text-white/80 text-sm mt-2">
          Reach out for personalised support.
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-widest font-bold">
              First Name
            </Label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-white/45"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-widest font-bold">
              Last Name
            </Label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
              className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-white/45"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-widest font-bold">
              Phone Number
            </Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., +91 0000000000"
              className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-white/45"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-widest font-bold">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-white/45"
            />
          </div>
        </div>

        {/* Date & Time Picker Area */}
        {/* <div className="space-y-4">
          <Label className="text-[11px] uppercase tracking-widest font-bold">Preferred Date and Time</Label>
          <div className="bg-[#111] border border-white/5 p-6 space-y-6">
            <p className="text-center text-xs text-gray-500">April</p>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-between">
              {dates.map((d) => (
                <div key={d.date} className="min-w-[50px] text-center border border-white/5 p-2 hover:border-[#FDB813] cursor-pointer">
                  <p className="text-[10px] text-gray-500 uppercase">{d.day}</p>
                  <p className="text-white font-bold">{d.date}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {times.map((t) => (
                <button key={t} type="button" className="text-[10px] bg-[#1a1a1a] px-3 py-2 text-white border border-white/5 hover:border-[#FDB813]">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div> */}

        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-widest font-bold">
            Message (Optional)
          </Label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-[#141414] border border-white/10 p-4 h-28 outline-none focus:border-[#FDB813] text-sm text-white placeholder:text-white/45"
            placeholder="Type Message"
          />
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            className="mt-1 border-white/20 data-[state=checked]:bg-[#FDB813] data-[state=checked]:text-black"
          />
          <label
            htmlFor="consent"
            className="text-[10px] text-gray-400 leading-normal"
          >
            I consent to Morzze storing and processing my data in accordance
            with their <span className="underline">privacy policy</span>...
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FDB813] hover:bg-[#e6a700] text-black font-bold h-14 uppercase tracking-[2px] rounded-none"
        >
          {loading ? "Requesting..." : "Request Call Back"}
        </Button>
      </form>
    </div>
  );
};

export default CallbackForm;
