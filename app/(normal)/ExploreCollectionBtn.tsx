"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function ExploreCollectionCTABtn() {
  return (
    <div className="relative bg-black z-10 max-w-screen-2xl mx-auto px-6 md:px-10 w-full text-center">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: false }}
        className="max-w-2xl mx-auto text-center md:text-left mt-6 mb-16"
      >
        <motion.span
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-montserrat text-center text-[10px] md:text-xs font-bold text-[#CBA14D] uppercase tracking-[0.3em] mb-4 block"
        >
          BATHROOM COLLECTION
        </motion.span>
        <motion.h1
          variants={{
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="font-inter text-center text-4xl md:text-5xl lg:text-7xl font-bold text-[#eee] leading-[1.1] mb-8 -ml-1 tracking-tight"
        >
          Luxury Redefined <br className="hidden md:block" /> For Every Space
        </motion.h1>
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="flex justify-center"
        >
          <Link
            href="/products"
            className="group relative border border-[#CBA14D]/60 px-8 py-3 transition-all duration-300 bg-[#CBA14D] overflow-hidden inline-block"
          >
            <span className="relative z-10 font-inter text-[10px] md:text-xs font-bold text-black group-hover:text-black uppercase tracking-widest">
              Explore Products
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
