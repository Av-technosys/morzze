"use client"
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { imageKitUrl } from "@/lib/imagekit-url";

const FeaturedInnovation = () => {
  // Stats data based on the provided image
  const stats = [
    { value: "200+", label: "Product Variants" },
    { value: "35+", label: "Years of Legacy" },
    { value: "300+", label: "Projects Done" }
  ];

  return (
    <section className="relative w-full  py-20 px-6 md:px-10 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageKitUrl("gradient-frame.png")}
          alt="background"
          height={1000}
          width={1000}
          className="object-cover w-full h-full"
          priority
        />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

        {/* -- LEFT COLUMN: HEADING & TEXT -- */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h3 className="font-montserrat text-4xl md:text-5xl font-medium text-white leading-tight">
            Featured <br />
            <span className="text-white">Innovation</span>
          </h3>
          <p className="font-inter text-white/80 text-sm md:text-md leading-relaxed text-justify">
            The <span className="text-white font-bold">Air Tap</span> is a sleek and
            innovative hand dryer designed for modern, eco-conscious spaces. Its
            advanced filtration system ensures clean air while drying, promoting
            hygiene and reducing the spread of germs. With touch-free sensor operation
            and intelligent heating, this dryer offers a seamless experience,
            providing efficient and fast drying without compromising on comfort.
            The eco-friendly design, combined with its space-saving structure,
            makes it a perfect addition to any restroom, saving both energy and space.
          </p>
        </motion.div>

        {/* -- CENTER COLUMN: PRODUCT IMAGE -- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex justify-center items-center h-[400px] md:h-[500px]"
        >
          {/* Central Product Showcase */}
          <div className="relative w-full h-full">
            <Image
              src={imageKitUrl("innovation.png")} // Replace with your tap image path
              alt="Air Tap Innovation"
              height={500}
              width={500}
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* -- RIGHT COLUMN: STATS WITH GOLD HIGHLIGHTS -- */}
        <div className="flex flex-col gap-6 md:gap-30 lg:pl-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex items-center gap-6"
            >
              {/* Vertical Gold Highlight Line */}
              <div className="w-[3px] h-12 bg-[#CBA14D]" />

              <div className="flex flex-row items-center gap-12">
                <p className="font-montserrat text-4xl md:text-5xl font-medium text-white tracking-wide">
                {stat.value}
                </p>
                <p className="font-montserrat text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em] leading-tight max-w-[80px]">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FeaturedInnovation