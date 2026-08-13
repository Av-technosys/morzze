"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Form233869() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("-Select-");
  const [postalCode, setPostalCode] = useState("");

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
    <div className="w-full h-full bg-[#030303] text-white">
      <div className="w-full h-full pb-20 container mx-auto">
        <div className="max-w-4xl mx-auto overflow-hidden">
          <Image
            src={
              "https://d2icu6klh68l1z.cloudfront.net/product-registration.png"
            }
            alt="product-registration"
            className="w-full h-auto object-cover border border-white/5"
            width={800}
            height={800}
            priority
          />
        </div>

        <div className="h-12"></div>

        <div className="max-w-3xl mx-auto bg-[#0A0A0A] border border-white/5 p-8 sm:p-10 shadow-2xl shadow-black backdrop-blur-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
              Product Registration
            </h2>
            <p className="text-zinc-400 text-sm mt-2">
              Register your Morzze products for warranty validation and updates.
            </p>
          </div>

          <form
            action="https://forms.zohopublic.in/Morzze/form/ProductRegistration/formperma/1PNgOuqUBEtn-ZCibkDYnuk37W0hU9c14iBdpCuVljM/htmlRecords/submit"
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

            {/* Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                  First Name
                </Label>
                <Input
                  type="text"
                  name="SingleLine2"
                  value={firstName}
                  placeholder="First Name"
                  className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500 focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/20"
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
                  name="SingleLine3"
                  value={lastName}
                  placeholder="Last Name"
                  className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500 focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/20"
                  onChange={(e) => setLastName(e.target.value)}
                  {...({ fieldType: "1" } as any)}
                  required
                />
              </div>
            </div>

            {/* Mobile Number & Email Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                  Mobile Number
                </Label>
                <div className="flex gap-3">
                  <div className="w-1/4">
                    <Input
                      type="text"
                      name="PhoneNumber_countrycodeval"
                      value={countryCode}
                      placeholder="Code"
                      className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500 text-center focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/20"
                      onChange={(e) => setCountryCode(e.target.value)}
                      {...({
                        compname: "PhoneNumber",
                        phoneFormat: "1",
                        isCountryCodeEnabled: "true",
                        fieldType: "11",
                      } as any)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      name="PhoneNumber_countrycode"
                      id="international_PhoneNumber_countrycodeval"
                      value={mobileNumber}
                      placeholder="10 digit Mobile Number"
                      className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500 focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/20"
                      onChange={(e) => setMobileNumber(e.target.value)}
                      maxLength={10}
                      {...({
                        compname: "PhoneNumber_countrycodeval",
                        phoneFormat: "1",
                      } as any)}
                      required
                    />
                  </div>
                </div>
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
                  className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500 focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/20"
                  onChange={(e) => setEmail(e.target.value)}
                  {...({ fieldType: "9" } as any)}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                Address
              </Label>
              <Input
                type="text"
                name="SingleLine"
                value={address}
                placeholder="Address"
                className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500 focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/20"
                onChange={(e) => setAddress(e.target.value)}
                {...({ fieldType: "1" } as any)}
                required
              />
            </div>

            {/* City, State, Postal Code Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                  City
                </Label>
                <Input
                  type="text"
                  name="SingleLine1"
                  value={city}
                  placeholder="City"
                  className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500 focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/20"
                  onChange={(e) => setCity(e.target.value)}
                  {...({ fieldType: "1" } as any)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                  State
                </Label>
                <select
                  name="Dropdown1"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="flex h-12 w-full items-center justify-between border border-white/10 bg-[#141414] px-3 py-2 text-sm text-white outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50 rounded-none cursor-pointer"
                  required
                >
                  <option value="-Select-">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                  Postal Code
                </Label>
                <Input
                  type="text"
                  name="Number"
                  value={postalCode}
                  maxLength={18}
                  placeholder="Postal code"
                  className="bg-[#141414] border-white/10 rounded-none h-12 text-white placeholder:text-zinc-500 focus-visible:border-yellow-500/50 focus-visible:ring-yellow-500/20"
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-black bg-yellow-500 rounded-md hover:bg-yellow-500/90 h-12 uppercase tracking-widest font-bold transition-all duration-200"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
