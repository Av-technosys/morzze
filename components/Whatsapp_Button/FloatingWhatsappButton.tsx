"use client";

import { IconBrandWhatsapp } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function FloatingWhatsappButton() {
  const phoneNumber = "918800026878";
  const message =
    "Hi Morzze! 👋 I’d love to explore your collection. I’m looking for some products. Can you help me get started?";

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        y: {
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.12,
        rotate: 6,
      }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-14 right-5 z-[9999] flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_22px_rgba(37,211,102,0.5)] transition-all duration-300"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />

      <span className="absolute inset-[-6px] rounded-full border border-[#25D366]/40" />

      <span className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-[#25D366]">
        <IconBrandWhatsapp size={38} stroke={1.8} />
      </span>
    </motion.a>
  );
}
