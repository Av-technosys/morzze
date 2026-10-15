"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { IconShieldCheck, IconCertificate, IconLeaf, IconUsers, IconWorld } from "@tabler/icons-react";
    
const containerVariants: Variants = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const cardAnimation: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const certifications = [
  {
    year: "2015",
    title: "ISO 9001:2015",
    org: "Quality Management System",
    href: "/certificates/iso-9001.pdf",
    icon: <IconCertificate size={32} stroke={1.2} />,
  },
  {
    year: "2015",
    title: "ISO 14001:2015",
    org: "Environmental Management System",
    href: "/certificates/iso-14001.pdf",
    icon: <IconLeaf size={32} stroke={1.2} />,
  },
  {
    year: "2018",
    title: "ISO 45001:2018",
    org: "Occupational Health & Safety Management System",
    href: "/certificates/iso-45001.pdf",
    icon: <IconShieldCheck size={32} stroke={1.2} />,
  },
  {
    // year: "2018",
    title: "Certificate Of Compliance",
    org: "Kitchen Sink, Faucet, Drainage and accessories",
    href: "/certificates/CE%20Certificate.pdf",
    icon: <IconShieldCheck size={32} stroke={1.2} />,
  },
];

const RecognitionSection = () => {
  return (
    <section className="relative w-full bg-[#050505] text-white py-8 md:py-24 overflow-hidden font-montserrat border-t border-white/5">
      
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 w-full">
        
        {/* --- HEADER BLOCK --- */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="block text-[10px] md:text-xs font-bold text-[#FDB813] uppercase tracking-[0.4em]"
          >
            RECOGNITION
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-medium text-[#FEFFF1] tracking-tight"
          >
            Certifications
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-white/80 font-inter text-sm md:text-md leading-relaxed"
          >
            Our facilities combine cutting-edge technology with time-honored craftsmanship to deliver products that exceed expectations.
          </motion.p>
        </div>

        {/* --- AWARDS GRID (Mobile Responsive & Symmetric Layout) --- */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 lg:gap-6"
        >
        {certifications.map((item, index) => (
          <a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              ${index < 3 ? "lg:col-span-2" : "lg:col-span-3 lg:max-w-112.5"} 
              ${index === 3 ? "lg:justify-self-end" : ""} 
              ${index === 4 ? "lg:justify-self-start" : ""}
            `}
          >
            <motion.div
              variants={cardAnimation}
              className="
                group relative flex items-center p-4 bg-[#141414]
                rounded-md border border-white/5 space-x-6
                transition-all duration-500 hover:border-[#CBA14D]/30
                hover:-translate-y-1 cursor-pointer h-full
              "
            >
              <div className="shrink-0 w-16 h-16 rounded-2xl bg-[#FFF7D9] flex items-center justify-center text-[#FDB813] shadow-[0_0_20px_rgba(203,161,77,0.1)] transition-transform duration-500 group-hover:scale-110">
                {item.icon}
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-[#FDB813] uppercase tracking-widest">
                  {item.year}
                </span>
                <h4 className="text-lg md:text-sm font-medium text-[#FEFFF1] leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs md:text-sm font-inter text-white/70">
                  {item.org}
                </p>
              </div>

              <div className="absolute top-0 left-10 w-1/3 h-px bg-linear-to-r from-transparent via-[#CBA14D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          </a>
        ))}

        </motion.div>

      </div>
    </section>
  );
};

export default RecognitionSection;