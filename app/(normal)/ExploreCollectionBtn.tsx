"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function ExploreCollectionCTABtn() {
  return (
    <div className="relative bg-black z-10 py-12 max-w-screen-2xl mx-auto px-6 md:px-10 w-full text-center">
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 text-center">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: false }}
          className="max-w-3xl mx-auto"
        >
          {/* Main Heading Reveal - Montserrat Font with Color Gradient blend */}
          <motion.h2
            variants={{
              initial: { opacity: 0, y: 40 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-montserrat text-3xl md:text-5xl lg:text-6xl font-medium text-white mb-6 leading-tight tracking-tight"
          >
            Where Water Meets <br />
            <span className="text-[#CBA14D]">Artistry</span>
          </motion.h2>

          {/* Description Reveal - Inter Font */}
          <motion.p
            variants={{
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="font-inter text-xs md:text-sm text-[#EDEBE9CC] leading-relaxed max-w-xl mx-auto mb-12 tracking-wide"
          >
            Every fixture tells a story of precision, passion, and
            uncompromising quality.
          </motion.p>

          {/* CTA Button Reveal */}
          <motion.div
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="flex justify-center"
          >
            <Link
              href="/products"
              className="group relative border border-[#CBA14D]/70 px-8 py-3.5 transition-all duration-300 hover:bg-[#CBA14D] overflow-hidden"
            >
              <span className="relative z-10 font-inter text-[10px] md:text-xs font-bold text-[#CBA14D] group-hover:text-black uppercase tracking-widest">
                Explore Products
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
