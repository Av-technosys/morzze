"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

export default function ContactCTASection() {
  return (
    <section className="w-full bg-[#111] text-white  py-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="w-full mx-auto border border-[#1f1f1f] bg-[#141414] py-14 px-6 md:px-10 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white mb-4"
        >
          Have Questions?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-base leading-7 text-gray-300 mb-10"
        >
          Our partnership team is here to help. Reach out for more information
          about the dealer program.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
          <motion.a
            href="mailto:info@morzze.com"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-[255px] h-[48px] rounded-[6px] bg-[#CBA14D] text-black flex items-center justify-center gap-3 text-[14px] font-semibold shadow-[0_0_30px_rgba(230,170,18,0.12)]"
          >
            <Mail size={15} />
            info@morzze.com
          </motion.a>

          <motion.a
            href="tel:+1800 110 123"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-[255px] h-[48px] rounded-[6px] border border-[#CBA14D] text-[#CBA14D] flex items-center justify-center gap-3 text-[14px] font-semibold hover:bg-[#1a1407] transition-colors duration-500"
          >
            <Phone size={15} />
            1800 110 123
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
