import VideoLibraryHero from "@/components/videos/banner";
import VideoLibraryGrid from "@/components/videos/videogrid";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Experience Morzze in Motion with Creative Videos | Morzze",
  description:
    "Discover our latest innovations and designs. Explore the world of Morzze through captivating videos that showcase our premium products & elegant solutions.",
  alternates: {
    canonical: "/videos",
  },
};

const page = () => {
  return (
    <div>
      <VideoLibraryHero />
      <VideoLibraryGrid />
    </div>
  );
};

export default page;
