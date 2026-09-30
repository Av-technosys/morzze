"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { IconTarget, IconEye } from "@tabler/icons-react";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const MissionVisionSection = () => {
  return (
    <section className="relative w-full bg-[#050505] text-white py-8 md:py-24 overflow-hidden font-montserrat">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 w-full">
        <div className="text-center mb-16 md:mb-10 space-y-3">
          <motion.span
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false }}
            className="block text-[10px] md:text-xs font-bold text-[#FDB813] uppercase tracking-[0.4em]"
          >
            OUR PURPOSE
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false }}
            className="text-3xl md:text-5xl font-medium text-[#FEFFF1]"
          >
            Mission & Vision
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="group relative p-10 md:p-14 bg-[#171717] rounded-[20px] border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#CBA14D]/30"
          >
            <div className="absolute inset-0 bg-[#CBA14D]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 rounded-full bg-[#FFB800] flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,184,0,0.3)] transition-transform duration-500 group-hover:scale-110">
                <IconTarget size={32} stroke={2} />
              </div>

              <div className="space-y-4 ">
                <h3 className="text-2xl md:text-2xl font-semibold text-[#FEFFF1] group-hover:text-[#CBA14D] transition-colors">
                  Our Mission
                </h3>
                <p className="font-inter text-white/80 text-sm md:text-md leading-relaxed">
                  
                To elevate the essential rhythms of the home, transforming daily rituals of
                cleansing and culinary creation into experiences of grace and well-being.
            
                We believe the home has two hearts. One beats for tranquility, the other for
                connection. True luxury lies in the fluidity of daily life—whether it is the
                quiet solitude of a morning shower or the vibrant choreography of preparing
                a meal. Your interaction with water defines the rhythm of your day.
            
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="group relative p-10 md:p-14 bg-[#171717] rounded-[20px] border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#CBA14D]/30"
          >
            <div className="absolute inset-0 bg-[#CBA14D]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 rounded-full bg-[#FFB800] flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,184,0,0.3)] transition-transform duration-500 group-hover:scale-110">
                <IconEye size={32} stroke={2} />
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl md:text-2xl font-semibold text-[#FEFFF1] group-hover:text-[#CBA14D] transition-colors">
                  Our Vision
                </h3>
                <p className="font-inter text-white/80 text-sm md:text-md leading-relaxed">
                  Morzze envisions becoming the leading provider of opulent, innovative, and environmentally responsible kitchen and bathroom solutions, setting new industry standards and crafting spaces that reflect sophistication and individuality.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
