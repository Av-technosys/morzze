"use client";
import React from "react";
import Image from "next/image";
import Link from "@/hooks/appLink";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconShoppingBag,
  IconHeart,
  IconHeartFilled,
  IconStarFilled,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getImageURL } from "@/lib/getImageLin";

interface SignatureProduct {
  id: string;
  name: string | null;
  slug: string | null;
  bannerImage: string | null;
  basePrice: number | null;
  strikethroughPrice: number | null;
  categoryName: string | null;
  size: string | null;
}

const SignaturePieces = ({ products }: { products: SignatureProduct[] }) => {
  const { addToCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-black text-white py-8 md:pb-0 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <div className="relative mb-12 flex items-center justify-center min-h-25">
          <div className="text-center">
            <span className="block font-montserrat text-[10px] md:text-xs font-bold text-[#CBA14D] uppercase tracking-[0.4em] mb-4">
              CURATED SELECTION
            </span>
            <h2 className="font-montserrat text-3xl md:text-5xl font-medium tracking-tight text-white">
              Signature Pieces
            </h2>
          </div>
          <div className="hidden md:block absolute right-0 bottom-7">
            <Link
              href="/products"
              className="flex items-center gap-2 font-montserrat text-[10px] font-bold text-[#EDEBE980] hover:text-[#CBA14D] transition-colors uppercase tracking-widest group"
            >
              VIEW ALL
              <span className="text-lg transition-transform group-hover:translate-x-1">
                <IconArrowRight size={20} />
              </span>
            </Link>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-10 no-scrollbar cursor-grab active:cursor-grabbing snap-x snap-mandatory">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="min-w-70 md:min-w-87.5 flex-none snap-start group flex flex-col"
            >
              {/* Image + Buttons */}
              <div className="relative aspect-4/5 max-w-sm bg-[#111] overflow-hidden mb-4">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={getImageURL(product.bannerImage || "")}
                    alt={product.name || "Product"}
                    height={500}
                    width={500}
                    className="object-cover w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                </Link>

                {/* Add to Cart + Wishlist overlay */}
                <div className="absolute inset-x-0 bottom-0 z-30 translate-y-0 md:translate-y-full p-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      disabled={getItemQuantity(product.slug || "") > 0}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product.slug || "", 1, {
                          name: product.name ?? undefined,
                          price: product.basePrice ?? undefined,
                          oldPrice: product.strikethroughPrice ?? undefined,
                          image: product.bannerImage ?? undefined,
                          productId: product.id,
                        });
                      }}
                      className="flex-1 bg-[#FFBF3F] hover:bg-[#e5ac37] font-inter text-black rounded-sm h-10 md:h-12 font-bold text-[11px] md:text-sm uppercase flex items-center justify-center gap-1 disabled:opacity-90 disabled:cursor-not-allowed"
                    >
                      {getItemQuantity(product.slug || "") > 0 ? (
                        <>
                          <IconShoppingBag size={18} /> In Cart ✓
                        </>
                      ) : (
                        <>
                          <IconShoppingBag size={18} /> Add to cart
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.slug || "", product.id);
                      }}
                      className={`shrink-0 rounded-sm h-10 md:h-12 w-10 md:w-10 flex items-center justify-center transition-all ${
                        isInWishlist(product.slug || "")
                          ? "bg-[#FFBF3F] hover:bg-white"
                          : "bg-[#FFBF3F] cursor-pointer"
                      }`}
                    >
                      {isInWishlist(product.slug || "") ? (
                        <IconHeartFilled size={20} className="text-red-500" />
                      ) : (
                        <IconHeart
                          size={20}
                          className="text-white hover:text-black"
                        />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5 px-1 md:px-0">
                <div className=" flex items-center justify-between">
                  <p className="text-[10px] text-white/80 tracking-[0.1em] font-montserrat uppercase">
                    {product.categoryName}
                  </p>
                  {product.size && (
                    <p className="text-[10px] text-white/80 tracking-[0.1em] font-montserrat">
                      {product.size?.split("\n")[0]}
                    </p>
                  )}
                </div>

                <Link href={`/product/${product.slug}`}>
                  <h4 className="text-sm md:text-[15px] font-inter text-[#EDEBE9] group-hover:text-[#FFBF3F] transition-colors line-clamp-1 cursor-pointer">
                    {product.name}
                  </h4>
                </Link>

                {/* <div className="flex items-center gap-1 py-0.5">
                  {[...Array(5)].map((_, i) => (
                    <IconStarFilled
                      key={i}
                      size={11}
                      className={i < 0 ? "text-[#CBA14D]" : "text-[#333]"}
                    />
                  ))}
                  <span className="text-[10px] text-[#555] ml-1">(0)</span>
                </div> */}

                <div className="flex items-center gap-3 mt-2">
                  <span className="font-bold text-white font-inter text-sm md:text-base">
                    ₹{product.basePrice?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="md:hidden flex justify-center mt-4">
        <Link
          href="/products"
          className="font-montserrat text-[10px] font-bold text-[#CBA14D] uppercase tracking-widest"
        >
          View All Collection →
        </Link>
      </div>
    </section>
  );
};

export default SignaturePieces;
