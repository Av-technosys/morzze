"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { imageKitUrl } from "@/lib/imagekit-url";

export default function JoinUsHero() {
  return (
    <section className="relative w-full min-h-[260px] md:min-h-[340px] lg:min-h-[400px] overflow-hidden flex items-center justify-center bg-black">
      <motion.div
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
        <Image
          src={imageKitUrl("careerbanner.png")}
          alt="Join Us"
          height={1600}
          width={1600}
          priority
          className="object-cover w-full h-full object-center grayscale"
        />
        <div className="absolute inset-0 bg-black/52" />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          className="text-[10px] md:text-xs uppercase tracking-[0.42em] text-[#d39b10] font-medium mb-4"
        >
          Careers at Morzze
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-[34px] md:text-[52px] lg:text-[60px] font-semibold tracking-[-0.03em] text-white leading-[1.08] mb-4"
        >
          Join Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          viewport={{ once: true }}
          className="text-[13px] md:text-[18px] leading-7 text-[#efefef]/90"
        >
          Craft the Future of Luxury Living
        </motion.p>
      </div>
    </section>
  );
}
