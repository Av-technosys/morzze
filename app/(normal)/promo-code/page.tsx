import PromoCodesOfferHero from "@/components/promopage/herobanner";
import PromoStepsNewsletter from "@/components/promopage/howtouse";
// import PromocodeServer from "@/components/promopage/PromocodeServer";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
// import { Suspense } from "react";
import { Form226186 } from "./couponForm";

export const metadata: Metadata = {
  title: `Check Promo Code Eligibility | Morzze`,
  description: `Find out if you qualify for Morzze promo codes & special offers. Check your eligibility instantly and enjoy savings on premium kitchen and bathroom products.`,
  alternates: {
    canonical: "/promo-code",
  },
};

const Page = async () => {
  return (
    <div>
      <PromoCodesOfferHero />
      {/* <Suspense fallback={<LoadingS />}>
        <PromocodeServer />
      </Suspense> */}

      <Form226186 />

      <PromoStepsNewsletter />
    </div>
  );
};

export default Page;

const LoadingS = () => {
  return (
    <div className=" bg-black w-full gap-6 px-10 py-5 flex">
      <Skeleton className=" h-96 w-full rounded bg-gray-800"></Skeleton>
      <Skeleton className=" h-96 w-full rounded bg-gray-800"></Skeleton>
      <Skeleton className=" h-96 w-full rounded bg-gray-800"></Skeleton>
      <Skeleton className=" h-96 w-full rounded bg-gray-800"></Skeleton>
    </div>
  );
};
