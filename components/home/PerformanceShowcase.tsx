"use client";
import React from "react";
import { motion } from "framer-motion";

// Stats Data - Direct key-value match from photo
const statsData = [
  { value: "700+", title: "DEALERS" },
  { value: "35+", title: "YEARS OF EXCELLENCE" },
  { value: "50k+", title: "HAPPY CUSTOMERS" },
  { value: "200+", title: "PRODUCT VARIANTS" },
];

const PerformanceShowcase = () => {
  return (
    <section className="bg-[#141414] text-white py-16 px-6 md:px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center justify-items-center">
          {statsData.map((stat, index) => (
            <div key={index} className="w-full text-center group">
              {/* Gold Stats Number */}
              {/* Cormorant Garamond gives the elegant serif look */}
              <span className="font-cormorant font-light text-[32px] md:text-[38px] lg:text-[46px] text-[#B6935C] leading-tight tracking-tight">
                {stat.value}
              </span>

              {/* White Title with Subdued Opacity and Montserrat font */}
              <p className="font-montserrat text-[9px] md:text-[10px] lg:text-[11px] font-semibold text-white/50 group-hover:text-white group-hover:tracking-[0.3em] transition-all duration-700 tracking-[0.2em] uppercase mt-2 pt-1 border-t border-transparent md:max-w-none mx-auto">
                {stat.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceShowcase;
