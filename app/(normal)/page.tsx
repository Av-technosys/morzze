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

export const metadata: Metadata = {
  title: `India's Top Premium Kitchen and Bathroom Sinks Manufacturer | Morzze`,
  description:
    "Morzze offers a diverse range of high-quality kitchen and bathroom sinks. Our range of stylish and functional sinks is designed to complement any decor. Explore our collection today and transform your space.",
  alternates: {
    canonical: "/",
  },
};

const page = async () => {
  return (
    <main>
      <HeroSection />
      <TheStory />
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
