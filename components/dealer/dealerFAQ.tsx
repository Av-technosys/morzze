"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What are the requirements to become a Morzze dealer?",
    a: "We look for established kitchen and bathroom solution retailers, interior solution providers, and showroom owners with a strong local customer base, adequate display space, and commitment to premium product presentation.",
  },
  {
    q: "What is the minimum order quantity (MOQ)?",
    a: "MOQ varies by product category. Typically, kitchen sinks require 50-100 units minimum, faucets 100-200 units, and accessories 200-500 units. Exact requirements will be shared during partnership discussions based on your territory and business size.",
  },
  {
    q: "Do you offer exclusive territories?",
    a: "Yes, we provide exclusive distribution rights for specific territories. Territory assignment is based on market potential, your business capacity, and commitment to performance targets. We ensure no overlap to protect your investment and market share.",
  },
  {
    q: "Can products be customized with different colors or finishes?",
    a: "Yes, we offer multiple finish options including chrome, matte black, brushed nickel, gold, and custom colors for bulk orders. Customization availability depends on the product line and order quantity. Our team will share the full customization catalogue during onboarding.",
  },
  {
    q: "How long does the application process take?",
    a: "The initial review takes 3-5 business days. If approved, we'll schedule a site visit and interview within 2 weeks. The complete onboarding process typically takes 4-6 weeks from application to first order.",
  },
  {
    q: "Do you provide training for dealers?",
    a: "Yes. Morzze provides detailed product knowledge training, sales enablement, installation guidance, and after-sales support training for your showroom team.",
  },
  {
    q: "Can I sell Morzze products online?",
    a: "Online selling permissions are territory and brand-position dependent. Select partners may receive controlled digital catalog access based on agreement terms.",
  },
  {
    q: "What marketing support do you provide?",
    a: "We provide showroom branding assets, digital creatives, campaign support, launch materials, social media kits, and co-branded offline promotional resources.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(1);

  return (
    <section className="w-full bg-[#111] text-white py-20 px-4 md:px-8 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-[42px] leading-none font-semibold tracking-[-0.03em] text-[#f5f2ea] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[14px] text-[#7d7d7d]">
            Everything you need to know about becoming a Morzze dealer.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const active = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.07,
                  ease: "easeInOut",
                }}
                viewport={{ once: true }}
                className="border border-[#383838] bg-[#141414] overflow-hidden"
              >
                <button
                  onClick={() => setOpen(active ? -1 : i)}
                  className="w-full px-5 md:px-6 h-[54px] flex items-center justify-between text-left"
                >
                  <span className="text-[15px] font-medium text-[#f5f2ea]">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: active ? 180 : 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <ChevronDown size={16} className="text-[#bdbdbd]" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                      <div className="px-5 md:px-6 pb-5 text-[14px] leading-8 text-[#7f7f7f] max-w-[92%]">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
