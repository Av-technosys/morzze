import type { NextConfig } from "next";
import redirectLinks from "@/const/redirectionLinks";

const nextConfig: NextConfig = {

  images: {
    //  unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2icu6klh68l1z.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "morzze.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },

    ],
  },
};

export default nextConfig;