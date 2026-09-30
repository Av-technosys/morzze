"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import {
  IconFlask,
  IconSettings,
  IconRosetteFilled,
  IconShieldCheck,
  IconRecycle,
  IconHandClick,
} from "@tabler/icons-react";

const containerVariants: Variants = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const features = [
  {
    icon: <IconFlask size={28} stroke={1.5} />,
    title: "Rigorous Testing",
    desc: "Each product undergoes 72+ hours of testing, including pressure, corrosion, and wear tests.",
  },
  {
    icon: <IconSettings size={28} stroke={1.5} />,
    title: "German Technology",
    desc: "Our machinery is sourced from leading German manufacturers for precision engineering.",
  },
  {
    icon: <IconRosetteFilled size={28} stroke={1.5} />,
    title: "ISO 9001:2015 Certified",
    desc: "Our quality management systems meet international standards for consistent excellence.",
  },
  
  {
    icon: <IconRecycle size={28} stroke={1.5} />,
    title: "Sustainable Practices",
    desc: "We use recycled materials where possible and maintain zero-waste manufacturing processes.",
  },
  {
    icon: <IconHandClick size={28} stroke={1.5} />,
    title: "Hand-Finished Details",
    desc: "Critical components receive hand-finishing by skilled artisans for perfect results.",
  },
];

const ManufacturingExcellence = () => {
  return (
    <section className="relative w-full bg-[#050505] text-white py-8 md:py-10 overflow-hidden font-montserrat">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 w-full">
        <div className="text-center mb-20 md:mb-12 space-y-4">
          <motion.span
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false }}
            className="block text-[10px] md:text-xs font-bold text-[#FDB813] uppercase tracking-[0.5em]"
          >
            QUALITY ASSURANCE
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false }}
            className="text-4xl md:text-5xl font-medium text-[#FEFFF1] mb-6"
          >
            Manufacturing Excellence
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false }}
            className="max-w-3xl mx-auto text-white/80 font-inter text-sm md:text-md leading-relaxed"
          >
            Our facilities combine cutting-edge technology with time-honored
            craftsmanship to deliver products that exceed expectations.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-y-24"
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex flex-col items-center text-center space-y-6 group"
            >
              <div className="w-16 h-16 rounded-full bg-[#FFF7D9] flex items-center justify-center text-[#FDB813] shadow-[0_0_30px_rgba(203,161,77,0.15)] transition-transform duration-500 group-hover:scale-110">
                {item.icon}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-semibold text-[#FEFFF1] tracking-wide">
                  {item.title}
                </h3>
                <p className="font-inter text-white/80 text-sm leading-relaxed max-w-65 mx-auto">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ManufacturingExcellence;
