import { FeedbackForm } from "@/components/FeedbackForm";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: `Share Your Feedback | Morzze Faucets & Sinks`,
  description:
    "We value your thoughts. Help us improve your experience by sharing feedback on our service, sales, or products. Submit your thoughts to the Morzze team.",
  alternates: {
    canonical: "/feedback",
  },
};

const page = () => {
  return (
    <div className=" bg-primary gap-12 pb-12">
      <Image
        src={"https://d2icu6klh68l1z.cloudfront.net/feedback-bg.png"}
        height={800}
        width={800}
        className=" w-full h-full"
        alt="subs-image"
      />
      <div className="h-12"></div>
      <div className=" flex items-center pb-12 flex-col gap-4 px-4 text-center">
        <h1 className=" text-white text-3xl font-semibold uppercase tracking-wider">
          Feedback Form
        </h1>
        <p className=" text-zinc-400 max-w-lg">
          We Value Your Thoughts – Please select the area you’d like to share feedback on and help us improve.
        </p>
      </div>
      <FeedbackForm />
    </div>
  );
};

export default page;
