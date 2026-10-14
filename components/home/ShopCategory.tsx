"use client";
import Image from "next/image";
import React from "react";
import Link from "@/hooks/appLink";
import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import { getImageURL } from "@/lib/getImageLin";

type CategoryType = "kitchen" | "bathroom" | null;

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  bannerImage: string | null;
  description: string | null;
  type: CategoryType;
}

interface ShopCategoryProps {
  categories: CategoryItem[];
}

// Same bento layout as the category page — only first 5 used here
const SPAN_PATTERNS = [
  "lg:col-span-5 lg:row-span-2", // 0 – hero (big card)
  "lg:col-span-4 lg:row-span-1", // 1
  "lg:col-span-3 lg:row-span-1", // 2
  "lg:col-span-3 lg:row-span-1", // 3
  "lg:col-span-4 lg:row-span-1", // 4
];

const ShopCategory = ({ categories = [] }: ShopCategoryProps) => {
  const visibleCategories = categories;
  return (
    <section className="bg-black text-white py-12 md:py-24 px-6 md:px-10 overflow-hidden font-montserrat">
      <div className="max-w-screen-2xl mx-auto">
        {/* --- HEADER SECTION --- */}
        <div className="relative mb-12 md:mb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <span className="block text-[10px] md:text-xs font-bold text-[#CBA14D] uppercase tracking-[0.4em] mb-4">
              CURATED SELECTION
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
              Shop by Category
            </h2>
          </motion.div>
        </div>

        {/* --- BENTO GRID (same layout as category page) --- */}
        {visibleCategories.length === 0 ? (
          <p className="text-white/50 text-center py-20 text-lg">
            No categories found.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-[300px]">
            {visibleCategories.map((cat, index) => {
              const spanClass =
                SPAN_PATTERNS[index] ?? "lg:col-span-3 md:col-span-6";

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative group cursor-pointer overflow-hidden rounded-sm bg-zinc-900 ${spanClass}`}
                >
                  <Link
                    href={`/${cat.type}/${cat.slug}`}
                    className="block w-full h-full"
                  >
                    {cat.bannerImage ? (
                      <Image
                        src={getImageURL(cat.bannerImage || "")}
                        alt={cat.name}
                        width={900}
                        height={600}
                        className="w-full h-full object-cover opacity-60 transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <h4 className="text-xl md:text-2xl font-medium text-white transition-colors duration-300 group-hover:text-[#FFBF3F]">
                        {cat.name === "Kitchen Faucet" ? "Kitchen Faucets" : cat.name}
                      </h4>
                      {cat.description && (
                        <p className="text-white/50 text-xs md:text-sm mt-2 font-inter line-clamp-2">
                          {cat.description}
                        </p>
                      )}

                      {/* --- EXPLORE BUTTON (Reveals on Hover) --- */}
                      <div className="flex items-center gap-2 text-[#CBA14D] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-3 opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                        EXPLORE <IconArrowRight size={14} stroke={2.5} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopCategory;
