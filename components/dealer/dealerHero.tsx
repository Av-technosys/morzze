"use client";
import React from "react";
import Link from "@/hooks/appLink";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { imageKitUrl } from "@/lib/imagekit-url";

const DealerHero = () => {
  return (
    <section className="relative w-full min-h-[78vh] md:min-h-[88vh] lg:min-h-screen flex items-center overflow-hidden">
      {/* Background Zoom Image */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={imageKitUrl("dealerhero.png")}
          alt="Luxury Bathroom Collection"
          height={1600}
          width={1600}
          priority
          className="object-cover w-full h-full object-center"
        />
        <div className="absolute inset-0 bg-black/55 md:bg-black/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-10 lg:px-12 w-full">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="w-full text-center pt-16 md:pt-24"
        >
          {/* Top Label */}
          <motion.span
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-montserrat text-[10px] sm:text-xs font-bold text-[#FDB813] uppercase tracking-[0.28em] mb-4 md:mb-5 block"
          >
            Trusted by 500+ Dealers Nationwide
          </motion.span>

          {/* Main Heading */}
          <motion.h1
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="font-inter text-5xl lg:text-7xl  font-semibold text-white mb-5 md:mb-7"
          >
            Partner with India's Leading{" "}
            <span className=" text-4xl md:text-6xl text-[#CBA14D]">
              Kitchen & Bath Manufacturer
            </span>
          </motion.h1>

          {/* Subtitle */}
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
          </motion.p>

          {/* CTA Buttons */}
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
              className="w-full sm:w-auto min-w-[190px] md:min-w-[220px] h-[48px] md:h-[52px] flex items-center justify-center group relative border border-[#CBA14D]/70 px-8 md:px-12 transition-all duration-300 bg-[#CBA14D] hover:bg-[#ab915e] overflow-hidden"
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
      <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default DealerHero;
