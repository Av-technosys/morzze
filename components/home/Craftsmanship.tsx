"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { imageKitUrl } from "@/lib/imagekit-url";

const VertexShowcase = () => {
  return (
    <section className="relative w-full md:py-20 py-8 px-2 flex items-center bg-black overflow-hidden">
      {/* -- BACKGROUND IMAGE -- */}
      {/* Iska container 'absolute inset-0' hai taaki ye poore section mein fail jaye */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageKitUrl("vertex1-bg.png")}
          alt="Kitchen Background"
          height={500}
          width={500}
          className="object-cover w-full h-full" // Opacity thodi badha di hai taaki background dikhe
          priority
        />
        {/* Dark Overlay taaki text clear dikhe */}
      </div>

      <div className="container mx-auto px-6 md:px-10 relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-center">
          {/* -- LEFT CONTENT (lg:col-span-7) -- */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 pt-10"
          >
            <span className="block font-montserrat text-sm font-semibold text-[#CBA14D] uppercase tracking-[0.2em]">
              Precision Engineering
            </span>

            <h2 className="font-montserrat text-3xl md:text-5xl font-bold text-white leading-tight">
              Touchless Kitchen Faucet <br /> with Filtered Water
            </h2>

            <p className="font-inter text-[#D1D1D1] text-base md:text-md leading-relaxed max-w-2xl">
              Experience the perfect water flow with our flagship kitchen
              faucet, featuring 360-degree swivel and precision temperature
              control.
            </p>

            <div className="flex items-center gap-6 py-4">
              <span className="font-montserrat text-3xl md:text-2xl font-bold text-white tracking-tight">
                ₹64,999
              </span>
              <span className="font-montserrat text-3xl md:text-2xl text-zinc-500 line-through">
                ₹67,999
              </span>
            </div>
            <Link href={"product/Kitchen-Faucet-MKF-30422-11111"}>
              <Button
                variant="outline"
                className=" border-[#CBA14D] rounded-md text-[#CBA14D] hover:bg-[#CBA14D] hover:text-black font-bold uppercase tracking-widest px-12 h-14 transition-all duration-500 bg-transparent"
              >
                SHOP NOW
              </Button>
            </Link>
          </motion.div>

          {/* -- RIGHT IMAGE (lg:col-span-5) -- */}
          {/* Alignment Fix: Isko absolute positioning di hai lg screen par taaki ye right edge se match kare */}
          <motion.div
            initial={{ opacity: 0, y: 250 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative h-full flex items-center "
          >
            <div className="relative w-full h-[80%] lg:h-[95%] lg:w-[60%] ml-20">
              {/* Curved Mask Container */}
              <div className="relative w-full h-full overflow-hidden rounded-tl-[150px]  rounded-br-[150px] shadow-2xl">
                <Image
                  src={imageKitUrl("vertex-bg.png")}
                  alt="Vertex Pro Faucet"
                  height={1000}
                  width={1000}
                  className="object-contain object-center"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VertexShowcase;
