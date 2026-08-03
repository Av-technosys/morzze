import SupportHero from "@/components/support/SupportHero";
import SupportTabs from "@/components/support/SupportTabs";
import { Metadata } from "next";
import React, { Suspense } from "react";


export const metadata: Metadata = {
  title: `Customer Support | Assistance for Kitchen & Bathroom Sinks`,
  description: `Need help with your Morzze's kitchen or bathroom sink? Visit our support page for expert assistance, FAQs, and solutions to your queries. We’re here to help!`,
  alternates: {
    canonical: "/support",
  },
}


const page = () => {
  return (
    <div>
      <SupportHero />

      <Suspense fallback={null}>
        <SupportTabs />
      </Suspense>
    </div>
  );
};

export default page;
