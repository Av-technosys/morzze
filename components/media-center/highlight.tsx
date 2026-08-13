"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

export default function ExhibitionHighlightsSection() {
  return (
    <section className="w-full bg-black text-white px-4 md:px-8 lg:px-10 py-16 md:py-20">
      <div className="max-w-7xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.42em] text-[#d39b10] font-medium mb-4"
        >
          In The News
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-[38px] md:text-[52px] font-semibold tracking-[-0.03em] mb-10"
        >
          Exhibition Highlights
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: true }}
          className="bg-[#121212] px-5 md:px-8 py-8 md:py-10 grid lg:grid-cols-2 gap-8 items-center text-left mb-10"
        >
          <div className="relative w-full h-[240px] md:h-[320px] overflow-hidden">
            <video
              src="https://morzze.s3.ap-south-1.amazonaws.com/website-images/media-3.mp4"
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right */}
          <div>
            <span className="inline-block px-3 py-[4px] rounded-full bg-[#f4e8c7] text-[#9b5d00] text-[10px] mb-4">
              Featured Story
            </span>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center text-[#e6aa12] text-[11px] font-semibold">
                EA
              </div>
              <div>
                <p className="text-[15px] text-white">
                  Exclusive Architect Meet
                </p>
                <p className="text-[12px] text-[white]/80">July, 2026</p>
              </div>
            </div>

            <h3 className="text-[30px] md:text-[36px] font-semibold mb-5">
              Exclusive Architect Meet
            </h3>

            <p className="text-[14px] leading-8 text-white/70 mb-4">
              Morzze connected with architects, interior designers, and industry
              professionals to showcase premium bath & kitchen solutions
              designed for modern living.
            </p>

            <p className="text-[14px] leading-8 text-white/60">
              From innovative designs and refined finishes to seamless
              functionality and superior craftsmanship, the event reflected
              Morzze’s commitment to quality, innovation, and timeless
              aesthetics. The evening brought together creative minds to explore
              new possibilities in premium spaces and build meaningful industry
              connections.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: true }}
          className="bg-[#121212] px-5 md:px-8 py-8 md:py-10 grid lg:grid-cols-2 gap-8 items-center text-left mb-10"
        >
          {/* Left */}
          <div>
            <span className="inline-block px-3 py-[4px] rounded-full bg-[#f4e8c7] text-[#9b5d00] text-[10px] mb-4">
              Featured Story
            </span>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center text-[#e6aa12] text-[11px] font-semibold">
                AD
              </div>
              <div>
                <p className="text-[15px] text-white">
                  Architectural Digest India
                </p>
                <p className="text-[12px] text-[white]/80">Feb, 2026</p>
              </div>
            </div>

            <h3 className="text-[30px] md:text-[36px] font-semibold mb-5">
              ARCHEX Dehradun 2026
            </h3>

            <p className="text-[14px] leading-8 text-white/70 mb-4">
              Morzze proudly showcased its premium kitchen and bathroom
              solutions at ARCHEX Dehradun 2026. Designed for modern and elegant
              spaces, our collection reflects refined finishes, seamless
              functionality, and superior craftsmanship.
            </p>

            <p className="text-[14px] leading-8 text-white/60">
              From refined finishes to seamless flow and superior craftsmanship,
              our products reflect a perfect balance of functionality and
              aesthetics. Experience the quality, detailing, and innovation that
              define Morzze.
            </p>
          </div>

          {/* Right */}
          <div className="relative w-full h-[240px] md:h-[320px] overflow-hidden">
            <video
              src="/archex-dehradun.mp4"
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: true }}
          className="bg-[#121212] px-5 md:px-8 py-8 md:py-10 grid lg:grid-cols-2 gap-8 items-center text-left mb-10"
        >
          <div className="relative w-full h-[240px] md:h-[320px] overflow-hidden">
            <video
              src="/ludhiana-exhibition.mp4"
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Left */}
          <div>
            <span className="inline-block px-3 py-[4px] rounded-full bg-[#f4e8c7] text-[#9b5d00] text-[10px] mb-4">
              Featured Story
            </span>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 bg-[#1a1a1a] flex items-center justify-center text-[#e6aa12] text-[11px] font-semibold">
                LF
              </div>
              <div>
                <p className="text-[15px] text-white">Ludiana Fest</p>
                <p className="text-[12px] text-[white]/80">March, 2024</p>
              </div>
            </div>

            <h3 className="text-[30px] md:text-[36px] font-semibold mb-5">
              Ludhiana Exhibition
            </h3>

            <p className="text-[14px] leading-8 text-white/70 mb-4">
              Morzze proudly participated in the Ludhiana Exhibition, continuing
              to showcase its premium range of kitchen and sanitaryware
              solutions. Designed for modern homes and refined interiors, our
              products combine elegant aesthetics with everyday performance.
            </p>

            <p className="text-[14px] leading-8 text-white/60">
              From high-quality stainless steel kitchen sinks to contemporary
              sanitaryware fittings, Morzze reflects precision craftsmanship,
              durability, and innovative design. Visitors experienced the
              finish, functionality, and detailing that set our solutions apart.
            </p>
          </div>

          {/* Right */}
        </motion.div>
        {/* <button className="px-14 h-11 border border-[#d39b10] text-[#d39b10] text-[12px] hover:bg-[#d39b10] hover:text-black transition">
          VIEW ARTICLE
        </button> */}
      </div>
    </section>
  );
}
