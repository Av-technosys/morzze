"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconShoppingBag,
  IconStarFilled,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import Link from "@/hooks/appLink";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import { getImageURL } from "@/lib/getImageLin";

type ProductFilter = {
  type: string | null;
  filter: string | null;
};

type CategoryProduct = {
  id: string;
  slug: string;
  name?: string | null;
  sku?: string | null;
  basePrice?: number | null;
  strikethroughPrice?: number | null;
  bannerImage?: string | null;
  rateing1Star?: number | null;
  rateing2Star?: number | null;
  rateing3Star?: number | null;
  rateing4Star?: number | null;
  rateing5Star?: number | null;
  size?: string | null;
  filters?: unknown;
};

function isProductFilter(value: unknown): value is ProductFilter {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "filter" in value
  );
}

const CategoryProductsClient = ({
  products,
  categoryName,
}: {
  products: CategoryProduct[];
  categoryName: string;
}) => {
  const { addToCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  // Helper to compute average star rating
  const getAvgRating = (p: CategoryProduct) => {
    const total =
      (p.rateing1Star || 0) +
      (p.rateing2Star || 0) +
      (p.rateing3Star || 0) +
      (p.rateing4Star || 0) +
      (p.rateing5Star || 0);
    if (total === 0) return 0;
    const weighted =
      1 * (p.rateing1Star || 0) +
      2 * (p.rateing2Star || 0) +
      3 * (p.rateing3Star || 0) +
      4 * (p.rateing4Star || 0) +
      5 * (p.rateing5Star || 0);
    return Math.round(weighted / total);
  };

  const getTotalReviews = (p: CategoryProduct) =>
    (p.rateing1Star || 0) +
    (p.rateing2Star || 0) +
    (p.rateing3Star || 0) +
    (p.rateing4Star || 0) +
    (p.rateing5Star || 0);

  const getDiscount = (p: CategoryProduct) => {
    if (
      p.strikethroughPrice &&
      p.basePrice &&
      p.strikethroughPrice > p.basePrice
    ) {
      return Math.round(
        ((p.strikethroughPrice - p.basePrice) / p.strikethroughPrice) * 100,
      );
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-lg md:text-xl font-semibold text-[#EDEBE9] font-montserrat">
          {categoryName}
        </h2>
        {/* <span className="text-[10px] text-[#555] uppercase tracking-widest font-inter">
          {products.length} {products.length === 1 ? "Result" : "Results"}
        </span> */}
        {/* <div className=" bg-slate-800 rounded-sm p-3 flex flex-col gap-4 w-64">
          <Label className=" text-white">Filter by size</Label>
          <Slider
            defaultValue={[25, 50]}
            max={100}
            step={5}
            className=" w-full max-w-xs"
          />
          <div className=" -mt-2 text-white justify-between gap-3 flex text-xs">
            <p>32</p>
            <p>46</p>
          </div>
        </div> */}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
        {products.map((product, idx) => {
          const rating = getAvgRating(product);
          const reviews = getTotalReviews(product);
          const discount = getDiscount(product);
          const productName = product.name ?? "Product";
          const filters = Array.isArray(product.filters)
            ? product.filters.filter(isProductFilter)
            : [];
          const size =
            filters.find((filter) => filter.type === "size")?.filter ??
            product.size;

          return (
            <div key={product.id + idx} className="group flex flex-col">
              <div className="relative w-full h-auto bg-[#111] overflow-hidden mb-4">
                {discount > 0 && (
                  <div className="absolute top-2 right-3 z-20">
                    <Badge className="bg-[#EF4444] text-white hover:bg-[#EF4444] rounded-none px-2 py-0.5 text-[9px] font-semibold">
                      {discount}% OFF
                    </Badge>
                  </div>
                )}

                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={getImageURL(product.bannerImage || "")}
                    alt={productName}
                    className="w-full h-auto object-contain cursor-pointer"
                    height={500}
                    width={500}
                  />
                </Link>

                <div className="absolute inset-x-0 bottom-0 z-30 translate-y-0 md:translate-y-full p-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      disabled={getItemQuantity(product.slug) > 0}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product.slug, 1, {
                          name: productName,
                          price: product.basePrice ?? undefined,
                          oldPrice: product.strikethroughPrice ?? undefined,
                          image: product.bannerImage ?? undefined,
                          sku: product.sku ?? undefined,
                          productId: product.id,
                        });
                      }}
                      className="flex-1 bg-[#FFBF3F] hover:bg-[#e5ac37] font-inter text-black rounded-sm h-10 md:h-12 font-bold text-[11px] md:text-sm uppercase flex items-center justify-center gap-1 disabled:opacity-90 disabled:cursor-not-allowed"
                    >
                      {getItemQuantity(product.slug) > 0 ? (
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
                        toggleWishlist(product.slug, product.id);
                      }}
                      className={`shrink-0 rounded-sm h-10 md:h-12 w-10 md:w-10 flex items-center justify-center transition-all ${
                        isInWishlist(product.slug)
                          ? "bg-[#FFBF3F] hover:bg-white "
                          : "bg-[#FFBF3F] cursor-pointer"
                      }`}
                    >
                      {isInWishlist(product.slug) ? (
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

              <div className="space-y-1.5 px-1 md:px-0">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="text-sm md:text-[15px] font-inter text-[#EDEBE9] group-hover:text-[#FFBF3F] transition-colors cursor-pointer">
                    {productName}
                  </h3>
                </Link>

                <div className=" flex items-center justify-between">
                  <div className="flex items-center gap-1 py-0.5">
                    {[...Array(5)].map((_, i) => (
                      <IconStarFilled
                        key={i}
                        size={11}
                        className={
                          i < rating ? "text-[#CBA14D]" : "text-[#333]"
                        }
                      />
                    ))}
                    <span className="text-[10px] text-[#555] ml-1">
                      ({reviews})
                    </span>
                  </div>
                  {size && (
                    <p className="text-[10px] text-white/80 tracking-[0.1em] font-montserrat">
                      {size.split(" ")[0] + " inch"}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-white font-inter text-sm md:text-base">
                    ₹{product.basePrice}
                  </span>
                  {product.strikethroughPrice && (
                    <span className="text-[11px] md:text-sm text-[#555] line-through">
                      ₹{product.strikethroughPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryProductsClient;
