"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

// Testimonials Data
const testimonials = [
  {
    id: 1,
    text: "Switched to Morzze towel warmers and it's the small luxury that makes every winter morning better. Build quality is outstanding.",
    name: "Sneha Kapoor",
    location: "Chandigarh • Curved Rail Warmer",
  },
  {
    id: 2,
    text: "The touchless faucet's precision engineering is unmatched, filtered water on tap changed our daily routine. Highly recommended!",
    name: "Rahul Mehta",
    location: "Mumbai • Kitchen Faucet",
  },
  {
    id: 3,
    text: "Touchless living is the future. Morzze's Air Tap technology is seamless, hygienic, and saves so much water. Amazing innovation.",
    name: "Ananya Iyer",
    location: "Bangalore • Aeromix Sensor",
  },
  {
    id: 4,
    text: "Elegant designs and top-notch customer service. Their dealer network made the installation process very smooth and professional.",
    name: "Vikram Singh",
    location: "Delhi • Oval Vessel Basin",
  },
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    // Section ko upar karne ke liye py-12 use kiya hai
    <section className="bg-[#0A0A0A] py-12 md:py-16 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        {/* Header Section */}
        <div className="space-y-3">
          <span className="block font-montserrat text-xs md:text-sm font-bold text-[#CBA14D] uppercase tracking-[0.4em]">
            CLIENT STORIES
          </span>
          <h3 className="font-montserrat text-4xl md:text-5xl font-medium text-white leading-tight">
            Words of <span className="text-[#CBA14D]">Trust</span>
          </h3>
        </div>

        {/* 5 Star Rating */}
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill="#CBA14D" stroke="#CBA14D" />
          ))}
        </div>

        {/* Animated Content Area */}
        <div className="relative min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-8"
            >
              <p className="font-inter italic text-[#D1D1D1] text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="space-y-1">
                <span className="font-montserrat text-white text-lg font-semibold">
                  {testimonials[currentIndex].name}
                </span>
                <p className="font-inter text-white/80 text-sm tracking-wide">
                  {testimonials[currentIndex].location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- NAVIGATION CONTROLS (Lines between Arrows) --- */}
        <div className="flex items-center justify-center gap-6 pt-4">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="p-3 border border-[#333333] hover:border-[#CBA14D] text-white hover:text-[#CBA14D] transition-all duration-300 bg-transparent"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Indicators in the middle */}
          <div className="flex gap-3">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-[2px] transition-all duration-500 ${
                  index === currentIndex
                    ? "w-10 bg-[#CBA14D]"
                    : "w-6 bg-[#333333]"
                }`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="p-3 border border-[#333333] hover:border-[#CBA14D] text-white hover:text-[#CBA14D] transition-all duration-300 bg-transparent"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
