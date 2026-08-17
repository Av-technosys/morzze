"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { imageKitUrl } from "@/lib/imagekit-url";

const NaturalElegance = () => {
  return (
    <section className="relative w-full py-8 md:py-20 flex items-center bg-black overflow-hidden">
      {/* -- BACKGROUND IMAGE -- */}
      {/* Iska container 'absolute inset-0' hai taaki ye poore section mein fail jaye */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageKitUrl("oxy-bg.png")}
          alt="Kitchen Background"
          height={1000}
          width={1000}
          className="object-cover w-full h-full" // Opacity thodi badha di hai taaki background dikhe
          priority
        />
      </div>

      <div className="container mx-auto px-6 md:px-10 relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-center">
          {/* -- RIGHT IMAGE (lg:col-span-5) -- */}
          {/* Alignment Fix: Isko absolute positioning di hai lg screen par taaki ye right edge se match kare */}
          <motion.div
            initial={{ opacity: 0, y: 250 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative h-full flex items-center justify-center"
          >
            <div className="relative w-full h-[80%] lg:h-full lg:w-[67%]">
              {/* Curved Mask Container */}
              <div className="relative w-full h-full overflow-hidden rounded-tr-[100px] rounded-bl-[100px] shadow-2xl">
                <Image
                  src={imageKitUrl("elegance.png")}
                  alt="Vertex Pro Faucet"
                  height={500}
                  width={500}
                  className="object-contain object-center"
                />
              </div>
            </div>
          </motion.div>
          {/* -- LEFT CONTENT (lg:col-span-7) -- */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 pt-10"
          >
            <span className="block font-montserrat text-sm font-semibold text-[#FDB813] uppercase tracking-[0.2em]">
              Natural Elegance
            </span>

            <h2 className="font-montserrat text-3xl md:text-5xl font-bold text-white leading-tight">
              Onyx Granite Basin
            </h2>

            <p className="font-inter text-[#FEFFF1] text-base md:text-md leading-relaxed max-w-2xl">
              Experience the perfect water flow with our flagship kitchen
              faucet, featuring 360-degree swivel and precision temperature
              control.
            </p>

            {/* <div className="flex items-center gap-6 py-4">
              <span className="font-montserrat  text-3xl md:text-2xl font-bold text-white tracking-tight">₹22,999</span>
              <span className="font-montserrat text-3xl md:text-2xl text-zinc-500 line-through">₹27,899</span>
            </div> */}
            <Link href={"kitchen/Granite-Sinks"}>
              <Button
                variant="outline"
                className=" border-[#CBA14D] rounded-md text-[#CBA14D] hover:bg-[#CBA14D] hover:text-black font-bold uppercase tracking-widest px-12 h-14 transition-all duration-500 bg-transparent"
              >
                SHOP NOW
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NaturalElegance;
