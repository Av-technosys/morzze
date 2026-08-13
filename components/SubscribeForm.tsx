"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function SubscribeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [referrer, setReferrer] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [gclid, setGclid] = useState("");
  const [utm, setUtm] = useState({
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReferrer(document.referrer || "");
      setRedirectUrl(window.location.href);

      const params = new URLSearchParams(window.location.search);
      setGclid(params.get("gclid") || "");
      setUtm({
        source: params.get("utm_source") || "",
        medium: params.get("utm_medium") || "",
        campaign: params.get("utm_campaign") || "",
        term: params.get("utm_term") || "",
        content: params.get("utm_content") || "",
      });
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto bg-[#0A0A0A] border border-white/5 p-8 sm:p-10 shadow-2xl shadow-black backdrop-blur-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight uppercase">
          Subscribe Us
        </h2>
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
          Join for the latest news and product updates.
        </p>
      </div>

      <form
        action="https://forms.zohopublic.in/Morzze/form/SubscribeUs/formperma/pgeqJr4gdDeye9r6PPjDk-6B30WdnLN-gSHoT5VjX-k/htmlRecords/submit"
        name="form"
        id="form"
        method="POST"
        acceptCharset="UTF-8"
        encType="multipart/form-data"
        className="space-y-6"
      >
        <input type="hidden" name="zf_referrer_name" value={referrer} />
        <input type="hidden" name="zf_redirect_url" value={redirectUrl} />
        <input type="hidden" name="zc_gad" value={gclid} />
        <input type="hidden" name="utm_source" value={utm.source} />
        <input type="hidden" name="utm_medium" value={utm.medium} />
        <input type="hidden" name="utm_campaign" value={utm.campaign} />
        <input type="hidden" name="utm_term" value={utm.term} />
        <input type="hidden" name="utm_content" value={utm.content} />

        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
            Name
          </Label>
          <Input
            type="text"
            name="SingleLine3"
            value={name}
            placeholder="Name"
            className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500"
            onChange={(e) => setName(e.target.value)}
            {...({ fieldType: "1" } as any)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
            Email
          </Label>
          <Input
            type="email"
            name="Email"
            value={email}
            placeholder="Email"
            className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500"
            onChange={(e) => setEmail(e.target.value)}
            {...({ fieldType: "9" } as any)}
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