"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { imageKitUrl } from "@/lib/imagekit-url";

const containerVariants: Variants = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 50 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const HeritageSection = () => {
  return (
    <section className="relative w-full bg-[#050505] text-white md:py-24 py-8 overflow-hidden font-montserrat">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false, amount: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-4 md:text-left text-center">
              <motion.span
                variants={fadeInUp}
                className="block text-[10px] md:text-xs font-bold text-[#FDB813] uppercase tracking-[0.5em]"
              >
                BRAND HERITAGE
              </motion.span>

              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-5xl text-[#FEFFF1] font-medium leading-[1.1]  tracking-tight"
              >
                A Legacy of <br /> Craftsmanship
              </motion.h2>
            </div>

            <motion.div
              variants={fadeInUp}
              className="space-y-6 text-white/80 text-sm md:text-md leading-relaxed  font-inter"
            >
              <p>
                Morzze began with a simple belief: that everyday objects deserve
                extraordinary attention. Founded in 1990 in the heart of New
                Delhi, we set out to redefine what premium kitchen and bathroom
                fittings could be.
              </p>
              <p>
                Our journey started in a small workshop, where our founders
                combined traditional Indian craftsmanship with German
                engineering precision. Today, we operate three state-of-the-art
                manufacturing facilities, but our commitment to quality remains
                unchanged.
              </p>
              <p>
                Every Morzze product undergoes rigorous testing and quality
                control. We use only the finest materials—solid brass, 304-grade
                stainless steel, and premium ceramic cartridges—to ensure
                lasting performance and timeless beauty .
              </p>
            </motion.div>
          </motion.div>
          <div className="flex items-start gap-4 md:gap-8 w-full">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: false }}
              className="relative w-1/2 aspect-4/5 rounded-3xl  overflow-hidden border border-white/10"
            >
              <motion.img
                src={imageKitUrl("haritage1.jpg")}
                alt="Artisan"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: false }}
              className="relative w-1/2 aspect-4/5 mt-12 md:mt-24 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
             <Image
              src={imageKitUrl("haritage2.jpg")}
              alt="Product"
              width={800}
              height={800}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
