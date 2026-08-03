import BannerAbout from "@/components/about-us/BannerAbout";
import BrandHeritage from "@/components/about-us/BrandHeritage";
import CollectionHero from "@/components/about-us/CollectionHero";
import HeritageSection from "@/components/about-us/HeritageSection";
import LeadershipSection from "@/components/about-us/LeadershipSection";
import ManufacturingExcellence from "@/components/about-us/ManufacturingExcellence";
import MilestonesTimeline from "@/components/about-us/MilestonesTimeline";
import MissionVisionSection from "@/components/about-us/MissionVisionSection";
import MorzzeStats from "@/components/about-us/MorzzeStats";
import RecognitionSection from "@/components/about-us/RecognitionSection";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: `About Us - Morzze | Kitchen and Bathroom Sink Manufacturer`,
  description: 'Morzze offers a diverse range of high-quality kitchen and bathroom sinks. Our range of stylish and functional sinks is designed to complement any decor.',
  alternates: {
    canonical: "/about",
  },
}

import React from "react";

const page = () => {
  return (
    <div>
      <BannerAbout />
      <HeritageSection />
      <MorzzeStats />
      <LeadershipSection />
      <MissionVisionSection />
      <ManufacturingExcellence />
      <BrandHeritage />
      <MilestonesTimeline />
      <RecognitionSection />
      <CollectionHero />
    </div>
  );
};

export default page;
