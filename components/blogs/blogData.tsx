"use client";

import React, { useState } from "react";
import Link from "@/hooks/appLink";
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { toast } from "sonner";
import { IconBrandFacebook, IconBrandLinkedin } from "@tabler/icons-react";
import { getImageURL } from "@/lib/getImageLin";
import Image from "next/image";
import { SubscribeForm } from "../SubscribeForm";

export default function BlogDetailPage({
  blog,
  relatedBlogs,
}: {
  blog: any;
  relatedBlogs: any[];
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Subscribed successfully");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-black text-white px-4 md:px-8 lg:px-10 py-10 md:py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-5"
        >
          <span className="px-3 py-[4px] rounded-full bg-[#f4e8c7] text-[#9b5d00] text-[10px]">
            {blog.blogCategory}
          </span>
          <span className="text-[12px] text-[white]/80">{blog.date}</span>
          <span className="text-[12px] text-[white]/80">5 min read</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-4xl text-[34px] md:text-[54px] font-semibold leading-[1.08] tracking-[-0.03em] mb-5"
        >
          {blog.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl text-[14px] leading-7 text-[white]/70 mb-10"
        >
          {blog.metaDescription}
        </motion.p>

        <div className="grid lg:grid-cols-[1fr_280px] gap-10 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-auto rounded-[8px] overflow-hidden mb-8 bg-[#141414]"
            >
              {blog.image && (
                <Image
                  src={getImageURL(blog.image)}
                  alt={blog.title}
                  height={700}
                  width={700}
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: blog.data
                  ? blog.data
                      .replace(/<div[^>]*>\s*<br\s*\/?>\s*<\/div>/gi, "")
                      .replace(/<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi, "")
                      .replace(
                        /<div[^>]*>\s*<span[^>]*>\s*<br\s*\/?>\s*<\/span>\s*<\/div>/gi,
                        "",
                      )
                      .replace(
                        /<p[^>]*>\s*<span[^>]*>\s*<br\s*\/?>\s*<\/span>\s*<\/p>/gi,
                        "",
                      )
                      .replace(/<div[^>]*>\s*&nbsp;\s*<\/div>/gi, "")
                      .replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, "")
                  : "",
              }}
            />

            <div className="border-t border-[#1f1f1f] mt-10 pt-8">
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags?.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full border border-[#2f2f2f] text-[11px] text-[#9a9a9a]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#7a7a7a] mr-2">
                  Share this article:
                </span>

                {[
                  {
                    icon: IconBrandFacebook,
                    link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : "",
                    )}`,
                  },
                  {
                    icon: X,
                    link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : "",
                    )}&text=${encodeURIComponent(blog.title)}`,
                  },
                  {
                    icon: IconBrandLinkedin,
                    link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : "",
                    )}`,
                  },
                  {
                    icon: Mail,
                    link: `mailto:?subject=${encodeURIComponent(
                      blog.title,
                    )}&body=${encodeURIComponent(
                      `Check out this article: ${
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      }`,
                    )}`,
                  },
                ].map((item, i) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={i}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#2a2a2a] transition"
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5 sticky md:top-28 ">
            <div className="bg-[#121212] border border-[#1e1e1e] rounded-[8px] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#333333] overflow-hidden">
                  {blog.userImage && (
                    <Image
                      src={getImageURL(blog.userImage)}
                      alt={blog.userName || "Author"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-medium">
                    {blog.userName || "Morzze Team"}
                  </p>
                  <p className="text-[11px] text-[white]/80">Author</p>
                </div>
              </div>
              <p className="text-[12px] leading-6 text-[white]/80">
                {blog.textArea ||
                  "Morzze Team shares insights, guides, and updates from Morzze."}
              </p>
            </div>

            <div className="bg-[#121212] border border-[#1e1e1e] rounded-[8px] p-5">
              <h4 className="text-[15px] font-semibold mb-4">
                Related Articles
              </h4>

              <div className="space-y-4">
                {relatedBlogs.length > 0 ? (
                  relatedBlogs.map((item: any) => (
                    <Link
                      href={`/article/${item.slug}`}
                      key={item.id}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-[72px] h-fit rounded overflow-hidden bg-[#222222] shrink-0">
                        {item.image && (
                          <Image
                            height={200}
                            width={200}
                            src={getImageURL(item.image)}
                            alt={item.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                          />
                        )}
                      </div>

                      <div>
                        <p className="text-[12px] leading-5 text-white group-hover:text-[#e6aa12] transition">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[white]/70 mt-1">
                          {item.date}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-[12px] text-[#777777]">
                    No related articles found.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[#121212] border border-[#1e1e1e] rounded-[8px] p-5">
              <h4 className="text-[15px] font-semibold mb-3">Stay Updated</h4>

              <p className="text-[12px] leading-6 text-[white]/80 mb-4">
                Get design tips and inspiration delivered to your inbox.
              </p>

              <SubscribeForm />
              {/* <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 bg-[#151515] border border-[#2b2b2b] px-3 text-[12px] mb-3 outline-none"
              />

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full h-10 bg-[#e6aa12] text-black text-[12px] font-semibold disabled:opacity-50"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
