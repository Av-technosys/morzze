"use client";
import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { SubscribeForm } from "../SubscribeForm";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

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
    <section className="bg-[#050505] text-white py-24 px-6 overflow-hidden relative border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Animated Wrapper for all content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8 w-full flex flex-col items-center"
        >
          {/* Header Section */}
          {/* <div className="space-y-4">
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 1.2 }}
              className="block font-inter text-[10px] md:text-xs font-bold text-[#CBA14D] uppercase tracking-[0.5em]"
            >
              STAY UPDATED
            </motion.span>

            <h3 className="font-montserrat text-4xl md:text-5xl font-medium text-white tracking-tight leading-tight">
              Join the World of Style
            </h3>

            <p className="font-inter text-white/80 text-sm md:text-md max-w-xl mx-auto leading-relaxed">
              Be the first to discover new collections, exclusive offers, and design inspiration.
            </p>
          </div> */}

          <SubscribeForm />
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
