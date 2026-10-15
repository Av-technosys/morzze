"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getImageURL } from "@/lib/getImageLin";
import { formatPrice } from "@/lib/utils";

interface CategoryProduct {
  id: string;
  name: string | null;
  slug: string | null;
  bannerImage: string | null;
  basePrice: number | null;
  strikethroughPrice: number | null;
}

interface CategoryWithProducts {
  id: string;
  name: string | null;
  slug: string | null;
  type: string | null;
  bannerImage: string | null;
  description: string | null;
  products: CategoryProduct[];
}

const CategoryShowcase = ({
  categories,
}: {
  categories: CategoryWithProducts[];
}) => {
  const [activeTab, setActiveTab] = useState(categories[0]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-black text-white py-8 md:py-24 px-6 md:px-10 overflow-hidden">
      <div className="hidden  max-w-screen-2xl mx-auto lg:grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="lg:col-span-4 space-y-6 pt-10">
          {categories.slice(0, 4).map((cat) => (
            <div key={cat.id} className="relative">
              <button
                onClick={() => setActiveTab(cat)}
                className="w-full text-left flex items-center gap-4 group focus:outline-none"
              >
                <div
                  className={`h-[24px] w-[2px] bg-[#CBA14D] transition-all duration-500 ${activeTab.id === cat.id ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
                />
                <h4
                  className={`font-montserrat text-lg md:text-xl tracking-wide transition-colors duration-300 ${activeTab.id === cat.id ? "text-white" : "text-[white]/70 hover:text-white/60"}`}
                >
                  {cat.name === "Kitchen Faucet" ? "Kitchen Faucets" : cat.name}
                </h4>
              </button>

              <AnimatePresence>
                {activeTab.id === cat.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-5 mt-4">
                      <div className="bg-[#141414]/50 p-6 border-l border-[#CBA14D]/20">
                        {cat.description && (
                          <p className="font-inter text-sm text-white/80 leading-relaxed mb-6 max-w-sm">
                            {cat.description}
                          </p>
                        )}
                        <Link
                          href={`/${cat.type}/${cat.slug}`}
                          className="inline-block font-montserrat text-[10px] font-bold text-[#CBA14D] uppercase tracking-widest border-b border-transparent hover:border-[#CBA14D] transition-all"
                        >
                          EXPLORE COLLECTION +
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="lg:col-span-8 flex justify-center items-center h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              className="grid grid-cols-2 md:gap-11 gap-4 w-[500px]"
            >
              {activeTab.products.slice(0, 4).map((prod, index) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative overflow-hidden bg-zinc-900 w-full rounded-sm shadow-2xl ${
                    index === 0
                      ? "aspect-square mt-0"
                      : index === 1
                        ? "aspect-square mt-10"
                        : index === 2
                          ? "aspect-square -mt-10"
                          : "aspect-square mt-0"
                  }`}
                >
                  <Link href={`/product/${prod.slug}`}>
                    <Image
                      src={getImageURL(prod.bannerImage || "")}
                      alt={prod.name || "Product"}
                      height={500}
                      width={500}
                      className="object-cover transition-transform duration-1000 hover:scale-105"
                    />
                    {/* Product name overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white/90 font-inter line-clamp-1">
                        {prod.name}
                      </p>
                      {prod.basePrice && (
                        <p className="text-xs text-[#CBA14D] font-semibold mt-0.5">
                          ₹{formatPrice(prod.basePrice)}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:hidden block max-w-screen-2xl mx-auto space-y-8">
        {categories.slice(0, 4).map((cat) => (
          <div key={cat.id} className="relative">
            {/* Heading appears first on mobile */}
            <button
              onClick={() => setActiveTab(cat)}
              className="w-full text-left flex items-center gap-4 group focus:outline-none"
            >
              <div
                className={`h-[24px] w-[2px] bg-[#CBA14D] transition-all duration-500 ${activeTab.id === cat.id ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
              />
              <span
                className={`font-montserrat text-lg md:text-xl tracking-wide transition-colors duration-300 ${activeTab.id === cat.id ? "text-white" : "text-[white]/70 hover:text-white/60"}`}
              >
                {cat.name}
              </span>
            </button>

            {/* Show a small product grid after the heading on mobile */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`products-${cat.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 gap-3 w-full mb-3 mt-3"
              >
                {cat.products?.slice(0, 4).map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    className="relative overflow-hidden bg-zinc-900 w-full rounded-sm shadow-2xl aspect-square"
                  >
                    <Image
                      src={getImageURL(prod.bannerImage || "")}
                      alt={prod.name || "Product"}
                      height={500}
                      width={500}
                      className="object-cover transition-transform duration-1000 hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-xs text-white/90 font-inter line-clamp-1">
                        {prod.name}
                      </p>
                      {prod.basePrice && (
                        <p className="text-xs text-[#CBA14D] font-semibold mt-0.5">
                          ₹{formatPrice(prod.basePrice)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Always expanded content on mobile */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pl-5 mt-4">
                <div className="bg-[#141414]/50 p-6 border-l border-[#CBA14D]/20">
                  {cat.description && (
                    <p className="font-inter text-sm text-white/80 leading-relaxed mb-6 max-w-sm">
                      {cat.description}
                    </p>
                  )}
                  <Link
                    href={`/${cat.type}/${cat.slug}`}
                    className="inline-block font-montserrat text-[10px] font-bold text-[#CBA14D] uppercase tracking-widest border-b border-transparent hover:border-[#CBA14D] transition-all"
                  >
                    EXPLORE COLLECTION +
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
