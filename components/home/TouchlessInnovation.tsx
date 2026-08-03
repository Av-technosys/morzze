"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "@/hooks/appLink"
import { imageKitUrl } from "@/lib/imagekit-url";

const TouchlessInnovation = () => {
  return (
    <section className="relative w-full  py-10 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageKitUrl("gradient-frame.png")}
          alt="Innovation Background"
          height={1000}
          width={1000}
          className="object-cover w-full h-full"
          priority
        />

      </div>

      <div className="container mx-auto px-6 md:px-10 relative z-10 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ">
          <motion.div
            initial={{ opacity: 0, x: -120, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false }}
            transition={{
              duration: 1.6,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="relative w-full aspect-square max-w-100 md:ml-20"
          >
            <div className="relative w-full h-full overflow-hidden rounded-tr-[180px] rounded-bl-[180px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <Image
                src={imageKitUrl("airtap_main.png")}
                alt="Touchless Faucet Technology"
                height={500}
                width={500}
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
          <div className="space-y-8">
            <motion.span
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 1.2,
                ease: [0.19, 1, 0.22, 1],
                delay: 0.2,
              }}
              className="block font-montserrat text-xs md:text-sm font-bold text-[#CBA14D] uppercase tracking-[0.4em]"
            >
              INNOVATION
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 1.4,
                ease: [0.19, 1, 0.22, 1],
                delay: 0.3,
              }}
              className="font-montserrat text-4xl md:text-2xl font-medium text-white leading-tight"
            >
              The Future of{" "}
              <span className="text-white/80">Touchless Living</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 1.4,
                ease: [0.19, 1, 0.22, 1],
                delay: 0.4,
              }}
              className="font-inter text-white/80 text-sm md:text-md leading-relaxed max-w-lg"
            >
              Experience the revolution of touchless water control. Our Air Tap
              technology combines infrared sensing with precision flow
              engineering, delivering a hygienic, water-saving, and effortlessly
              elegant kitchen experience.
            </motion.p>
            <div className="space-y-4 pt-4">
              {[
                "90% Germ Reduction",
                "40% Water Savings",
                "Sensor-Activated Flow",
              ].map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    duration: 1,
                    ease: [0.19, 1, 0.22, 1],
                    delay: 0.6 + index * 0.15,
                  }}
                  className="flex items-center gap-3 text-white/80 font-inter text-sm md:text-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CBA14D]" />
                  {point}
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 1 }}
              className="pt-6"
            >
            <Link href="/kitchen/Air-Tap">
                <Button
                  variant="outline"
                  className="rounded-md border-[#CBA14D] text-[#CBA14D] hover:bg-[#CBA14D] hover:text-black font-bold uppercase tracking-widest px-10 h-14 transition-all duration-700 bg-transparent"
                >
                  DISCOVER AIR TAP
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TouchlessInnovation;
