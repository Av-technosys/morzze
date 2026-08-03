import MediaHero from "@/components/media-center/banner";
import BrandFilmsProductDemos from "@/components/media-center/brandFilm";
import PressCoverageSection from "@/components/media-center/coverage";
import ExhibitionHighlightsSection from "@/components/media-center/highlight";
import PressKitRequestSection from "@/components/media-center/pressKit";
import ProductPhotographyGallery from "@/components/media-center/visualgrid";
import { Metadata } from "next";
import React from "react";



export const metadata: Metadata = {
  title: `Media - Morzze | Discover Our Journey and Innovations`,
  description: `Explore Morzze's media page featuring our Instagram journey, press highlights & brand videos. Stay updated on our innovations in kitchen & bathroom solutions`,
  alternates: {
    canonical: "/media",
  },
}



const page = () => {
  return (
    <div>
      <MediaHero />
      <ExhibitionHighlightsSection />
      {/* <PressCoverageSection /> */}
      <BrandFilmsProductDemos />
      <ProductPhotographyGallery />
      {/* <PressKitRequestSection /> */}
    </div>
  );
}; ``

export default page;
