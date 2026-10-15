"use client"
import React from 'react'
import { motion } from 'framer-motion'

const TheStory = () => {
  return (
    <section className="bg-black text-white pb-20 md:py-22 px-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto text-center"
      >
        
        {/* -- Small Subheading -- */}
        <motion.span 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="block font-montserrat text-[10px] md:text-xs font-bold text-[#CBA14D80] uppercase tracking-[0.4em] mb-6"
        >
          THE MORZZE STORY
        </motion.span>

        {/* -- Main Heading -- */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="font-montserrat text-3xl md:text-2xl lg:text-4xl font-medium mb-10 leading-tight"
        >
          <span className="text-[#EDEBE980]">Beyond Excellence,</span>{" "}
          <motion.span 
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="bg-linear-to-r from-[#CBA14D] via-[#D5BE90] to-[#CBA14D] bg-clip-text text-transparent"
          >
            Beyond Ordinary
          </motion.span>
        </motion.h2>

        {/* -- Description Paragraph -- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <p className="font-inter text-sm md:text-md text-white/80 leading-relaxed md:leading-loose tracking-wide">
            Born in New Delhi, Morzze brings together European design sensibility with 
            Indian craftsmanship. Every product in our collection — from precision-engineered 
            steel sinks to innovative air taps — is crafted to transform your 
            kitchen and bathroom into spaces of unparalleled luxury.
          </p>
        </motion.div>

      </motion.div>
    </section>
  )
}

export default TheStory