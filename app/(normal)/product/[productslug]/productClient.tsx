"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconStarFilled,
  IconMinus,
  IconPlus,
  IconShoppingBag,
  IconBolt,
  IconHeart,
  IconHeartFilled,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import DescriptionTabs, {
  ChildRef,
} from "@/components/product/DescriptionTabs";
import SpecificationsTabs from "@/components/product/SpecificationsTabs";
// import ProductComparison from "@/components/product/ProductComparison";
import CareAndMaintenance from "@/components/product/CareAndMaintenance";
import AteliersGrid from "@/components/product/AteliersGrid";
import CommonEnquiries from "@/components/product/CommonEnquiries";
import RelatedProducts from "@/components/product/RelatedProducts";
import ReviewsTab from "@/components/product/ReviewsTab";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getImageURL } from "@/lib/getImageLin";

const ProductClient = ({ product, slug, reviews }: any) => {
  const router = useRouter();
  const descriptionTabsRef = useRef<ChildRef>(null);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, getItemQuantity } = useCart();
  const imageZoomRef = useRef<HTMLDivElement>(null);
  const zoomFrameRef = useRef<number | null>(null);

  const isSingleSize = product?.filters?.find(
    (it: any) => it.type === "size",
  )?.filter;

  const hasSizePrices =
    Array.isArray(product?.sizePrices) && product.sizePrices.length > 0;
  const defaultSize = hasSizePrices ? product.sizePrices[0].size : isSingleSize;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState("");
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const zoomEl = imageZoomRef.current;
    if (!zoomEl) return;

    if (zoomFrameRef.current !== null) {
      window.cancelAnimationFrame(zoomFrameRef.current);
    }

    const { left, top, width, height } = zoomEl.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - left) / width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - top) / height) * 100, 0), 100);

    zoomFrameRef.current = window.requestAnimationFrame(() => {
      zoomEl.style.setProperty("--zoom-origin", `${x}% ${y}%`);
    });
  };

  const handleMouseLeave = () => {
    if (zoomFrameRef.current !== null) {
      window.cancelAnimationFrame(zoomFrameRef.current);
      zoomFrameRef.current = null;
    }

    imageZoomRef.current?.style.setProperty("--zoom-origin", "center center");
  };

  const currentPrice = (() => {
    if (hasSizePrices) {
      const matched = product.sizePrices.find(
        (sp: any) => sp.size === selectedSize,
      );
      if (matched) return matched.price;
    }
    return product.basePrice;
  })();

  // Colour variant state
  const colourVariants = product?.prodcutVarientBoxRes || [];
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  // FOR MEDIA AND PDF DOCUMENTATION
  if (!product) return null;

  const mediaImages = (product.productMediaRes || [])
    .filter((item: any) => item.mediaType === "image")
    .sort((a: any, b: any) => {
      if (a.priority == null && b.priority == null) return 0;
      if (a.priority == null) return 1;
      if (b.priority == null) return -1;
      return Number(a.priority) - Number(b.priority);
    })
    .map((item: any) => item.mediaURL);

  const pdfDocuments = (product.productMediaRes || []).filter(
    (item: any) => item.mediaType === "pdf",
  );

  const images = [product.bannerImage, product.image, ...mediaImages].filter(
    Boolean,
  );

  // When a colour variant is selected, prepend its image to the images array
  const displayImages =
    selectedVariant !== null && colourVariants[selectedVariant]?.image
      ? [colourVariants[selectedVariant].image, ...images]
      : images;

  const wishlisted = isInWishlist(slug);

  // The image that should be shown as the hero (cart will also use this)
  const currentHeroImage = displayImages[selectedImage] || product.bannerImage;
  const productVideos = (product.productMediaRes || [])
    .filter((item: any) => item.mediaType === "video")
    .map((item: any) => item.mediaURL);

  // Extract filters by type from product.filters
  const filters = product.filters || [];
  const finishFilters = filters
    .filter((f: any) => f.type === "finish")
    .map((f: any) => f.filter);
  const sizeFilters = filters
    .filter((f: any) => f.type === "size")
    .map((f: any) => f.filter);
  const materialFilters = filters
    .filter((f: any) => f.type === "material")
    .map((f: any) => f.filter);

  const handleVariantClick = (index: number) => {
    if (selectedVariant === index) {
      // Deselect
      setSelectedVariant(null);
      setSelectedImage(0);
    } else {
      setSelectedVariant(index);
      setSelectedImage(0); // Reset to first image which will be the variant image
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white p-4 md:p-10 font-inter">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT - IMAGES */}
          <div className="space-y-6">
            <div
              ref={imageZoomRef}
              className="relative aspect-square bg-[#1A1A1A] overflow-hidden group cursor-zoom-in"
              style={
                { "--zoom-origin": "center center" } as React.CSSProperties
              }
              onMouseEnter={handleMouseMove}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <AnimatePresence mode="wait">
                <Image
                  src={getImageURL(displayImages[selectedImage] || "")}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover scale-100 transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.85]"
                  style={{ transformOrigin: "var(--zoom-origin)" }}
                />
              </AnimatePresence>

              {/* ARROWS */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (prev) =>
                          (prev - 1 + displayImages.length) %
                          displayImages.length,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <IconChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() =>
                      setSelectedImage(
                        (prev) => (prev + 1) % displayImages.length,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <IconChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {displayImages.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 h-20 border-2",
                    selectedImage === i
                      ? "border-[#FFBF3F]"
                      : "border-white/10",
                  )}
                >
                  <Image
                    src={getImageURL(img)}
                    // src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${img}`}
                    alt={`${product.name ?? "Product"} thumbnail ${i + 1}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="flex flex-col space-y-6">
            <div>
              <p className="text-[11px] tracking-[0.3em] text-white/80 uppercase font-bold mb-2">
                Morzze
              </p>

              <h1 className="text-2xl md:text-3xl font-medium">
                {product.name}
              </h1>

              <p className="text-xs text-white/65 mt-2">{product.sku}</p>
            </div>

            {/* RATING */}
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <IconStarFilled
                    key={i}
                    size={16}
                    className={i < 4 ? "text-[#FFBF3F]" : "text-[#333]"}
                  />
                ))}
              </div>
              <span className="text-sm text-white/80">
                ({product.reviews} Reviews)
              </span>
            </div>

            {/* PRICE */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold">₹{currentPrice}</span>
              {/* <span className="text-lg text-[#555] line-through">
                ₹{product.strikethroughPrice}
              </span>
              <span className="text-sm text-[#EF4444] font-bold">
                {product.discount}
              </span> */}
            </div>

            {/* DESC */}
            <a
              href="#description-tabs"
              className="text-white/90 text-base cursor-pointer hover:text-white transition-colors block"
              onClick={() => {
                descriptionTabsRef.current?.setActiveTab(0);
              }}
            >
              {product.description}
            </a>

            {/* COLOUR VARIANTS */}
            {colourVariants.length > 0 && (
              <div>
                <p className="text-sm text-white/90 mb-3 uppercase tracking-widest font-bold">
                  Colour:{" "}
                  <span className="text-[#FFBF3F]">
                    {selectedVariant !== null
                      ? colourVariants[selectedVariant]?.name
                      : "Default"}
                  </span>
                </p>

                <div className="flex gap-3 flex-wrap">
                  {colourVariants.map((variant: any, index: number) => (
                    <button
                      key={variant.id || index}
                      onClick={() => handleVariantClick(index)}
                      className={cn(
                        "relative group/variant flex items-center gap-2 px-3 py-2 border rounded-md transition-all duration-200",
                        selectedVariant === index
                          ? "border-[#FFBF3F] bg-[#FFBF3F]/10"
                          : "border-white/10 hover:border-white/30",
                      )}
                    >
                      {variant.image && (
                        <div className="w-8 h-8 rounded overflow-hidden border border-white/10">
                          <Image
                            src={getImageURL(variant.image)}
                            alt={variant.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-sm font-medium",
                          selectedVariant === index
                            ? "text-[#FFBF3F]"
                            : "text-white/85",
                        )}
                      >
                        {variant.name}
                      </span>

                      {/* Active indicator */}
                      {selectedVariant === index && (
                        <motion.div
                          layoutId="variant-indicator"
                          className="absolute -bottom-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#FFBF3F] rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE */}
            {(hasSizePrices || sizeFilters.length > 0) && (
              <div>
                <p className="text-sm text-white/90 mb-2 uppercase tracking-widest font-bold">
                  Size:{" "}
                  <span className="text-[#FFBF3F]">
                    {selectedSize || "Select"}
                  </span>
                </p>

                {hasSizePrices ? (
                  <div className="flex gap-2 flex-wrap">
                    {product.sizePrices.map((sp: any) => (
                      <button
                        key={sp.size}
                        onClick={() => setSelectedSize(sp.size)}
                        className={cn(
                          "px-4 py-2 border text-sm rounded-md transition-all flex flex-col items-center",
                          selectedSize === sp.size
                            ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
                            : "border-white/10 text-white/85 hover:border-[#FFBF3F]/50",
                        )}
                      >
                        <span>{sp.size}</span>
                        <span className="text-[10px] opacity-75 mt-0.5">₹{sp.price}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  sizeFilters.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {sizeFilters.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "px-4 py-2 border text-sm rounded-md transition-all",
                            selectedSize === size
                              ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
                              : "border-white/10 text-white/85 hover:border-white/30",
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}

            {/* FINISH */}
            {finishFilters.length > 0 && (
              <div>
                <p className="text-sm text-white/90 mb-2 uppercase tracking-widest font-bold">
                  Finish:{" "}
                  <span className="text-[#FFBF3F]">
                    {selectedFinish || "Select"}
                  </span>
                </p>

                <div className="flex gap-2 flex-wrap">
                  {finishFilters.map((finish: string) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={cn(
                        "px-4 py-2 border text-sm rounded-md transition-all",
                        selectedFinish === finish
                          ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
                          : "border-white/10 text-white/85 hover:border-white/30",
                      )}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MATERIAL */}
            {materialFilters.length > 0 && (
              <div>
                <p className="text-sm text-white/90 mb-2 uppercase tracking-widest font-bold">
                  Material:{" "}
                  <span className="text-[#FFBF3F]">
                    {selectedMaterial || "Select"}
                  </span>
                </p>

                <div className="flex gap-2 flex-wrap">
                  {materialFilters.map((material: string) => (
                    <button
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={cn(
                        "px-4 py-2 border text-sm rounded-md transition-all",
                        selectedMaterial === material
                          ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
                          : "border-white/10 text-white/85 hover:border-white/30",
                      )}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <IconMinus />
              </button>

              <span>{quantity}</span>

              <button onClick={() => setQuantity((q) => q + 1)}>
                <IconPlus />
              </button>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => {
                  addToCart(slug, quantity, {
                    name: selectedSize ? `${product.name} (${selectedSize})` : product.name,
                    price: currentPrice,
                    oldPrice: product.strikethroughPrice,
                    image: currentHeroImage,
                    sku: product.sku,
                    productId: product.id,
                    selectedSize,
                  });
                }}
                disabled={getItemQuantity(product.slug, selectedSize) > 0}
                className="flex-1 py-5 bg-[#FDB813] hover:ring-[#FDB813] hover:ring hover:text-[#FDB813] text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getItemQuantity(product.slug, selectedSize) > 0 ? (
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
                onClick={() => {
                  addToCart(slug, quantity, {
                    name: selectedSize ? `${product.name} (${selectedSize})` : product.name,
                    price: currentPrice,
                    oldPrice: product.strikethroughPrice,
                    image: currentHeroImage,
                    sku: product.sku,
                    productId: product.id,
                    selectedSize,
                  });
                  router.push("/checkout");
                }}
                className="flex-1 py-5 border border-white/20"
              >
                <IconBolt size={16} /> Buy Now
              </Button>

              <Button
                type="button"
                onClick={() => toggleWishlist(slug, product.id)}
                className={cn(
                  "bg-[#FFBF3F] border-[#2E2E2E] text-black hover:ring-[#FDB813] hover:ring transition-all hover:text-[#FDB813]",
                  wishlisted && "border-red-500/50 bg-[#FFBF3F] ",
                )}
              >
                {wishlisted ? (
                  <IconHeartFilled className="text-red-500" />
                ) : (
                  <IconHeart />
                )}
              </Button>
            </div>
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-y-4 pt-8 border-t border-white/5">
              {[
                { label: "Free Shipping", icon: "•" },
                { label: "12-Month Warranty", icon: "•" },
                { label: "Easy Returns", icon: "•" },
                { label: "Quality Assured", icon: "•" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-white/85 uppercase tracking-widest"
                >
                  <span className="text-[#FFBF3F] text-lg leading-none">
                    {feature.icon}
                  </span>
                  {feature.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {productVideos.map((video: string, index: number) => (
        <div
          key={index}
          className="flex justify-center items-center bg-black py-8"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            preload="auto"
            className="max-h-[80vh] w-auto object-contain"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}/${video}?tr=orig`}
              type="video/mp4"
            />
          </video>
        </div>
      ))}
      {/* EXTRA SECTIONS */}
      <div id="description-tabs" className="scroll-mt-20">
        <DescriptionTabs
          ref={descriptionTabsRef}
          productAttributeRes={product?.productAttributeRes}
          pdfDocuments={pdfDocuments}
        />
      </div>
      <SpecificationsTabs productAttributeRes={product?.productAttributeRes} />
      <ReviewsTab reviews={reviews} />
      {/* <ProductComparison /> */}
      <CareAndMaintenance />
      <AteliersGrid />
      <CommonEnquiries faqs={product?.productFaqRes || []} />
      <RelatedProducts slug={slug} />
    </>
  );
};

export default ProductClient;
