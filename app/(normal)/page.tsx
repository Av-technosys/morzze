import Craftsmanship from "@/components/home/Craftsmanship";
import FeaturedInnovation from "@/components/home/FeaturedInnovation";
import HeroSection from "@/components/home/HeroSection";
import InstagramCarousel from "@/components/home/InstagramCarousel";
import LookbookSection from "@/components/home/LookbookSection";
import NaturalElegance from "@/components/home/NaturalElegance";
import NewsletterSection from "@/components/home/NewsletterSection";
import PerformanceShowcase from "@/components/home/PerformanceShowcase";
import StoreLocator from "@/components/home/StoreLocator";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import TheARTSection from "@/components/home/TheARTSection";
import TheStory from "@/components/home/TheStory";
import TouchlessInnovation from "@/components/home/TouchlessInnovation";
import ScheduleCall from "@/components/home/ScheduleCall";
import WhereWaterMeet from "@/components/home/WhereWaterMeet";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import SignaturePiecesServer from "./SignaturePieces";
import ShopCategoryServer from "./ShopCategoryServer";
import CategoryShowcaseServer from "./CategoryShowcaseServer";
import TrendingNowServer from "./TrendingNowServer";
import JustarivedServer from "./JustarivedServer";
import LandingSectionSkleton from "@/components/LandingSectionSkleton";
import { Metadata } from "next";
import { homeSchema } from "@/const/schemas";
import { ExploreCollectionCTABtn } from "./ExploreCollectionBtn";

export const metadata: Metadata = {
  title: `India's Top Premium Kitchen and Bathroom Sinks Manufacturer | Morzze`,
  description:
    "Morzze offers a diverse range of high-quality kitchen and bathroom sinks. Our range of stylish and functional sinks is designed to complement any decor. Explore our collection today and transform your space.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://www.morzze.com/",
    siteName: "Morzze",
    title:
      "India's Top Premium Kitchen and Bathroom Product Manufacturer | Morzze",
    description:
      "Morzze offers a diverse range of premium kitchen sinks, bathroom fittings, faucets, air taps, and more. Our range of stylish and functional products is designed to complement any decor. Explore our collection today and transform your space.",
    images: [
      {
        url: "https://www.morzze.com/_next/image?url=https%3A%2F%2Fd2icu6klh68l1z.cloudfront.net%2Flogo.png&w=384&q=75",
      },
    ],
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "India's Top Premium Kitchen and Bathroom Product Manufacturer | Morzze",
    description:
      "Morzze offers a diverse range of premium kitchen sinks, bathroom fittings, faucets, air taps, and more. Our range of stylish and functional products is designed to complement any decor. Explore our collection today and transform your space.",
    images: [
      "https://www.morzze.com/_next/image?url=https%3A%2F%2Fd2icu6klh68l1z.cloudfront.net%2Flogo.png&w=384&q=75",
    ],
  },
};
const page = async () => {
  return (
    <main className=" bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <HeroSection />
      <TheStory />

      {/* <ExploreCollectionCTABtn /> */}
      <Suspense fallback={<LandingSectionSkleton />}>
        <SignaturePiecesServer />
      </Suspense>

      <Suspense fallback={<Spinner />}>
        <ShopCategoryServer />
      </Suspense>
      <TheARTSection />
      {/* <TrustSection /> */}
      <ScheduleCall />

      <WhereWaterMeet />
      <ExploreCollectionCTABtn />
      <Suspense fallback={<LandingSectionSkleton />}>
        <CategoryShowcaseServer />
      </Suspense>
      <Suspense fallback={<LandingSectionSkleton />}>
        <TrendingNowServer />
      </Suspense>
      <Suspense fallback={<LandingSectionSkleton />}>
        <JustarivedServer />
      </Suspense>
      <Craftsmanship />
      <TouchlessInnovation />
      <NaturalElegance />
      <PerformanceShowcase />
      <TestimonialSlider />
      <FeaturedInnovation />
      <StoreLocator />
      <InstagramCarousel />
      <LookbookSection />
      <NewsletterSection />
    </main>
  );
};

export default page;
