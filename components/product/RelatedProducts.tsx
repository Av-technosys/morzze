"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getProductSimilarProducts } from "@/helper";
import Link from "@/hooks/appLink"
import { IconStarFilled, IconShoppingBag, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getImageURL } from "@/lib/getImageLin";
import { formatPrice } from "@/lib/utils";

const RelatedProducts = ({ slug }: { slug: string }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const relatedProducts = await getProductSimilarProducts(slug);
        // Show only 4 products
        setProducts(relatedProducts?.slice(0, 4) || []);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-10 font-inter">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-medium mb-2">Related Products</h2>
              <p className="text-white/60 text-sm">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-black text-white p-4 md:p-10 font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium mb-2">Related Products</h2>
            <p className="text-white/60 text-sm">Explore more products from the same category</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <Link href={`/product/${product.slug}`} key={product.id} className="group flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-square bg-[#1A1A1A] overflow-hidden mb-4">
                  <Image
                    src={getImageURL(product.bannerImage || "")}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-contain  group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      type="button"
                      disabled={getItemQuantity(product.slug) > 0}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product.slug, 1, {
                          name: product.name,
                          price: product.basePrice,
                          oldPrice: product.strikethroughPrice,
                          image: product.bannerImage,
                          sku: product.sku || "",
                          productId: product.id,
                        });
                      }}
                      className="bg-[#FDB813] text-black hover:bg-[#e6a700] rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <IconShoppingBag size={16} />
                      {getItemQuantity(product.slug) > 0 ? "Added" : "Add"}
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-[#FFBF3F] transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    {/* <div className="flex">
                      {[...Array(5)].map((_, i) => {
                        const totalRating =
                          (product.rateing5Star || 0) * 5 +
                          (product.rateing4Star || 0) * 4 +
                          (product.rateing3Star || 0) * 3 +
                          (product.rateing2Star || 0) * 2 +
                          (product.rateing1Star || 0) * 1;
                        const count =
                          (product.rateing5Star || 0) +
                          (product.rateing4Star || 0) +
                          (product.rateing3Star || 0) +
                          (product.rateing2Star || 0) +
                          (product.rateing1Star || 0);
                        const avgRating = count > 0 ? Math.round(totalRating / count) : 0;

                        return (
                          <IconStarFilled
                            key={i}
                            size={14}
                            className={i < avgRating ? "text-[#FFBF3F]" : "text-[#333]"}
                          />
                        );
                      })}
                    </div> */}
                    {/* <span className="text-xs text-white/60">
                      {((product.rateing5Star || 0) +
                        (product.rateing4Star || 0) +
                        (product.rateing3Star || 0) +
                        (product.rateing2Star || 0) +
                        (product.rateing1Star || 0))}
                    </span> */}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <span className="text-lg font-bold text-[#FFBF3F]">₹{formatPrice(product.basePrice)}</span>
                    {/* {product.strikethroughPrice && (
                      <span className="text-sm text-white/40 line-through">₹{formatPrice(product.strikethroughPrice)}</span>
                    )} */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product.slug, product.id);
                      }}
                      className="shrink-0"
                    >
                      {isInWishlist(product.slug) ? (
                        <IconHeartFilled className="text-red-500" size={18} />
                      ) : (
                        <IconHeart className="text-white/60 hover:text-[#FFBF3F]" size={18} />
                      )}
                    </button>
                  </div>

                  {/* Wishlist Button */}

                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
