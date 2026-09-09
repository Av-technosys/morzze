"use client";
import React from "react";
import Link from "@/hooks/appLink";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { imageKitUrl } from "@/lib/imagekit-url";
import { DriftWall } from "@/components/DriftWall";

const ids = [
  "/dealer/image 229.png",
  "/dealer/image 230.png",
  "/dealer/image 232.png",
  "/dealer/image 233.png",
  "/dealer/image 234.png",
  "/dealer/image 235.png",
  "/dealer/image 236.png",
  "/dealer/image 237.png",
  "/dealer/image 238.png",
  "/dealer/image 239.png",
  "/dealer/image 240.png",
  "/dealer/image 241.png",
  "/dealer/image 242.png",
  "/dealer/image 243.png",
  "/dealer/image 244.png",
  "/dealer/image 245.png",
  "/dealer/image 246.png",
  "/dealer/image 247.png",
  "/dealer/image 248.png",
  "/dealer/image 249.png",
];

const items = ids.map((id) => ({
  image: id,
  title: "title",
  href: undefined,
}));

const DealerHero = () => {
  return (
    <section className="relative bg-black w-full min-h-[78vh] md:min-h-[88vh] lg:min-h-screen">
      {/* Background Zoom Image */}
      <div style={{ height: 700 }}>
        {/* @ts-ignore */}
        <DriftWall
          items={items}
          columns={5}
          tileWidth={200}
          tileHeight={132}
          gap={18}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={42}
          direction="up"
          variance={0.45}
          parallax={0.6}
          lift={64}
          fade={0.6}
          dim={0.55}
          overlayColor="#060010"
          radius={14}
          roll={0}
          pauseOnHover={false}
          grayscale={false}
        />
      </div>

      {/* Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 z-10 max-w-6xl mx-auto px-5 sm:px-8 w-full sm:w-fit">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="w-full text-center"
        >
          <motion.span
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-montserrat text-xs sm:text-xs font-bold text-[#FDB813] uppercase tracking-[0.28em] mb-4 md:mb-5 block"
          >
            Trusted by 700+ Dealers Nationwide
          </motion.span>

          <motion.h1
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="font-inter text-2xl lg:text-5xl  font-semibold text-white mb-5 md:mb-7"
          >
            Partner with India's Leading <br />
            <span className=" text-2xl lg:text-4xl text-[#CBA14D]">
              Kitchen & Bathroom Product Manufacturer
            </span>
          </motion.h1>
          {/* 
          <motion.p
            variants={{
              initial: { opacity: 0, y: 25 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="max-w-[860px] mx-auto font-inter text-[14px] sm:text-[15px] md:text-[18px] leading-7 md:leading-8 text-[#FFFFFFCC] mb-8 md:mb-10 px-2"
          >
            Join Morzze's growing dealer network and carry premium, innovative
            products in your territory.
          </motion.p> */}

          <motion.div
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href="#dealer-form"
              className="w-full sm:w-auto min-w-[190px] md:min-w-[200px] h-[48px] md:h-[52px] flex items-center justify-center group relative border border-[#CBA14D]/70 px-8 md:px-12 transition-all duration-300 bg-[#CBA14D] hover:bg-[#ab915e] overflow-hidden"
            >
              <span className="flex items-center relative z-10 font-inter text-[11px] md:text-xs font-bold text-black uppercase tracking-[0.22em]">
                Become a dealer <MoveRight className="ml-2" size={16} />
              </span>
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto min-w-[190px] md:min-w-[220px] h-[48px] md:h-[52px] flex items-center justify-center group relative border border-[#CBA14D]/70 px-8 md:px-12 transition-all duration-300 hover:bg-[#CBA14D] overflow-hidden"
            >
              <span className="relative z-10 font-inter text-[11px] md:text-xs font-bold text-[#CBA14D] group-hover:text-black uppercase tracking-[0.22em]">
                View our products
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      {/* <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black to-transparent" /> */}
    </section>
  );
};

export default DealerHero;
