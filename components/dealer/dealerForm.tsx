"use client";
import { BecomeADealerFrom } from "./BecomeADealerForm";

declare global {
  interface Window {
    fdforms: any[];
  }
}

export default function DealerApplicationForm() {
  return (
    <section
      className="w-full bg-[#111] text-white pt-20 px-4 md:px-8 lg:px-12"
      id="dealer-form"
    >
      <div className="max-w-5xl mx-auto">
        <BecomeADealerFrom />
      </div>
    </section>
  );
}
