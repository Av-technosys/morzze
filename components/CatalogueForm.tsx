"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CatalogueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");

  return (
    <div className="max-w-xl mx-auto bg-[#0A0A0A] border border-white/5 p-8 sm:p-10 shadow-2xl shadow-black backdrop-blur-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight uppercase">
          Catalogue Request Form
        </h2>
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
          Fill the form below and get our Master Catalogue <br /> on your
          WhatsApp instantly.
        </p>
      </div>

      <form
        action="https://forms.zohopublic.in/Morzze/form/CatalogueRequestForm/formperma/aaJeHS_jKm-4xgtYNUya6YSjEQmogCB0dm1KgJ2C0kg/htmlRecords/submit"
        name="form"
        id="form"
        method="POST"
        acceptCharset="UTF-8"
        encType="multipart/form-data"
        className="space-y-6"
      >
        <input type="hidden" name="zf_referrer_name" value="" />
        <input type="hidden" name="zf_redirect_url" value="" />
        <input type="hidden" name="zc_gad" value="" />
        <input type="hidden" name="utm_source" value="" />
        <input type="hidden" name="utm_medium" value="" />
        <input type="hidden" name="utm_campaign" value="" />
        <input type="hidden" name="utm_term" value="" />
        <input type="hidden" name="utm_content" value="" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
              First Name
            </Label>
            <Input
              type="text"
              name="SingleLine3"
              value={firstName}
              placeholder="First Name"
              className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500"
              onChange={(e) => setFirstName(e.target.value)}
              {...({ fieldType: "1" } as any)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
              Last Name
            </Label>
            <Input
              type="text"
              name="SingleLine"
              value={lastName}
              placeholder="Last Name"
              className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500"
              onChange={(e) => setLastName(e.target.value)}
              {...({ fieldType: "1" } as any)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
            WhatsApp Number
          </Label>
          <Input
            type="text"
            name="PhoneNumber_countrycode"
            id="international_PhoneNumber_countrycode"
            placeholder="WhatsApp Number"
            value={whatsAppNumber}
            className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500"
            onChange={(e) => setWhatsAppNumber(e.target.value)}
            {...({ compname: "PhoneNumber", phoneFormat: "1", isCountryCodeEnabled: "false", fieldType: "11" } as any)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full text-black bg-yellow-500 rounded-md hover:bg-yellow-500/90 h-12 uppercase tracking-widest font-bold transition-all duration-200"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
