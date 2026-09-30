"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const milestones = [
  {
    year: "1990",
    title: "Foundation",
    desc: "Anupam was founded in Naraina, New Delhi, India.",
  },
  {
    year: "1997",
    title: "Expansion",
    desc: "Anupam shifted its unit to new premises of 16,000 sq. ft. in Ghevera, New Delhi.",
  },
  {
    year: "2000",
    title: "New Manufacturing Facility",
    desc: "Anupam shifted its unit to new premises of 32,000 sq. ft. in the Industrial Estate of Kundli, Haryana, India.",
  },
  {
    year: "2008",
    title: "Display Centre Launch",
    desc: "Opened its first Display Centre “ANUPAM WORLD.” By the end of 2008, six display centres across India.",
  },
  {
    year: "2009",
    title: "Business Expansion",
    desc: "Expanded business by establishing another unit in Kundli, Haryana measuring 35,000 sq. ft..",
  },
  {
    year: "2024",
    title: "Launch of Morzze",
    desc: "Anupam launched new luxury brand 'Morzze'.",
  },
];

const MilestonesTimeline = () => {
  const containerRef = useRef(null);
  
  // Scroll tracking logic fix
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section ref={containerRef} className="relative w-full bg-[#171717] text-white py-8 md:py-24 overflow-hidden font-montserrat">
      
      {/* --- HEADER BLOCK --- */}
      <div className="text-center mb-20 md:mb-32 space-y-4">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="block text-[10px] md:text-xs font-bold text-[#FBBF24] uppercase tracking-[0.6em]"
        >
          OUR JOURNEY
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-medium text-white tracking-tight uppercase"
        >
          Milestones
        </motion.h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* --- CENTRAL VERTICAL LINE --- */}
        <div className="absolute left-9 top-0 bottom-0 w-[1px] bg-white/10 md:left-1/2 md:w-[1.5px] md:-translate-x-1/2" />
        
        {/* Animated Gold Line */}
        <motion.div 
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 bottom-0 w-[1px] bg-[#F59E0B] origin-top md:left-1/2 md:w-[1.5px] md:-translate-x-1/2 z-10"
        />

        <div className="space-y-14 md:space-y-48">
          {milestones.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.4 }}
              className={`relative flex flex-col items-start pl-14 md:pl-0 md:flex-row ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* --- CONTENT SIDE (Fixed Alignment) --- */}
              <div className={`w-full md:w-1/2 flex flex-col ${
                index % 2 === 0 ? "md:items-end md:text-right md:pr-20" : "md:items-start md:text-left md:pl-20"
              }`}>
                <span className="text-[#FBBF24] font-bold text-sm md:text-xl mb-2 tracking-[0.3em] uppercase">{item.year}</span>
                <h3 className="text-xl md:text-3xl font-semibold text-[#FFFFFF] mb-3 md:mb-4 leading-tight uppercase">{item.title}</h3>
                {/* Paragraph Alignment Fixed */}
                <p className="text-white/80 font-inter text-sm md:text-base leading-relaxed max-w-full md:max-w-sm">
                  {item.desc}
                </p>
              </div>

              {/* Central Point (The Dot) */}
              <div className="absolute left-1.5 top-5 w-3 h-3 bg-[#CBA14D] rounded-full z-20 flex items-center justify-center md:left-1/2 md:-translate-x-1/2 md:top-2">
                <div className="w-6 h-6 bg-[#CBA14D]/20 rounded-full animate-pulse absolute" />
              </div>

              {/* Empty Spacer Side */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MilestonesTimeline;