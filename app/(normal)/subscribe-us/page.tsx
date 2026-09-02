import { SubscribeForm } from "@/components/SubscribeForm";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: `Subscribe to Morzze Updates | Get Offers & New Launches`,
  description:
    "Subscribe to Morzze and get updates on new product launches, exclusive offers, and kitchen & bathroom products. Join us for the latest deals and news.",
};

const page = () => {
  return (
    <div className=" bg-primary gap-12 pb-12">
      <Image
        src={"https://d2icu6klh68l1z.cloudfront.net/subs-us-bg.png"}
        height={800}
        width={800}
        className=" w-full h-full"
        alt="subs-image"
      />
      <div className="h-12 bg-black"></div>
      <SubscribeForm />
    </div>
  );
};

export default page;
