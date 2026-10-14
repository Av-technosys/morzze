"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { imageKitUrl } from "@/lib/imagekit-url";

const ProductBanner = () => {
  return (
    <section className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden font-montserrat">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageKitUrl("over.jpg")}
          alt="Premium Kitchen and Bathroom Fittings"
          height={1600}
          width={1600}
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/20 bg-linear-to-r from-black/50 via-black/5 to-transparent" />
      </div>
      <div className="relative z-10 h-full max-w-screen-2xl mx-auto px-6 md:px-10 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-semibold text-white tracking-tight"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-white font-inter text-sm md:text-md leading-relaxed max-w-lg opacity-90"
          >
            Discover our premium collection of kitchen sinks, bathroom fittings,
            faucets, air taps, and luxury accessories, crafted to bring durability,
            elegance, and modern sophistication to your space.
          </motion.p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#CBA14D]/30 to-transparent" />
    </section>
  );
};

export default ProductBanner;
