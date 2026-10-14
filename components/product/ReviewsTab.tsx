"use client";

import Image from "next/image";
import React, { useState } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { getImageURL } from "@/lib/getImageLin";

const ReviewsTab = ({ reviews = [] }: any) => {
  // Calculate average rating
  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

  // Group reviews by rating
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews ? reviews.filter((r: any) => r.rating === rating).length : 0,
  }));

  // If no reviews, display a clean, luxury empty state instead of 0.0 breakdown
  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-full bg-black py-12 p-4 md:p-10 font-inter border-t border-zinc-900">
        <div className="max-w-7xl mx-auto text-center py-12 border border-zinc-900/80 rounded-xl bg-zinc-950/40 px-6">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#CBA14D]/10 flex items-center justify-center text-[#CBA14D]">
            <IconStar size={22} />
          </div>
          <h3 className="text-lg text-white font-medium mb-1">Customer Reviews</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            No reviews yet. Be the first to share your experience with this product!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black py-10 p-4 md:p-10 font-inter border-t border-zinc-900">
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-xl text-white font-semibold">REVIEWS ({reviews.length})</h2>

        {/* RATING SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center border border-zinc-800 rounded-lg p-6">
            <div className="text-4xl font-bold text-[#FFBF3F] mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <IconStarFilled
                  key={i}
                  size={16}
                  className={
                    i < Math.round(averageRating)
                      ? "text-[#FFBF3F]"
                      : "text-zinc-700"
                  }
                />
              ))}
            </div>
            <p className="text-zinc-400 text-xs text-center">
              Based on {reviews?.length || 0} review{reviews?.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="md:col-span-3 space-y-2">
            {ratingCounts.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  {[...Array(5)].map((_, i) => (
                    <IconStarFilled
                      key={i}
                      size={12}
                      className={
                        i < item.rating ? "text-[#FFBF3F]" : "text-zinc-700"
                      }
                    />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFBF3F] transition-all"
                    style={{
                      width: `${
                        (reviews?.length || 0) > 0
                          ? (item.count / (reviews?.length || 1)) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-zinc-400 text-xs w-8 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* INDIVIDUAL REVIEWS */}
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6 mt-12 pt-8 border-t border-zinc-900">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <div className="space-y-6">
              {reviews.map((review: any, index: number) => (
                <motion.div
                  key={review.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-white font-semibold text-base">
                          {review.name || "Anonymous"}
                        </h3>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <IconStarFilled
                              key={i}
                              size={16}
                              className={
                                i < (review.rating || 0)
                                  ? "text-[#FFBF3F]"
                                  : "text-zinc-700"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-500 text-xs">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-zinc-900 rounded text-xs text-zinc-300">
                        ★ {review.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                    {review.message}
                  </p>

                  {/* Media Gallery */}
                  {review.media && review.media.length > 0 && (
                    <div className="flex gap-3 flex-wrap mt-6 pt-4 border-t border-zinc-900">
                      {review.media.map((media: any, i: number) => (
                        <div
                          key={i}
                          className="relative w-20 h-20 rounded border border-zinc-800 overflow-hidden hover:border-zinc-700 transition cursor-pointer"
                        >
                          <Image
                            src={getImageURL(media.mediaURL)}
                            alt={`Review media ${i}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border-t border-zinc-900 mt-8">
            <p className="text-zinc-400 text-sm">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
