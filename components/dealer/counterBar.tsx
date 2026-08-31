"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 15, suffix: "+", label: "Years of Excellence" },
  { value: 200, suffix: "+", label: "Product Variants" },
  { value: 500, suffix: "+", label: "Active Dealers" },
  { value: 100, suffix: "+", label: "Cities Covered" },
];

function useCountUp(
  end: number,
  duration: number = 1800,
): [number, React.RefObject<HTMLDivElement>] {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return [count, ref] as [number, React.RefObject<HTMLDivElement>];
}

function CounterItem({
  item,
  index,
}: {
  item: (typeof stats)[0];
  index: number;
}) {
  const [count, ref] = useCountUp(item.value, 2000 + index * 200);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-amber-400 tracking-tight">
        {count}
        {item.suffix}
      </div>
      <div className="mt-1 text-sm md:text-base text-white font-medium">
        {item.label}
      </div>
    </motion.div>
  );
}

export default function AnimatedCounterBar() {
  return (
    <div className="w-full bg-black py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((item, index) => (
          <CounterItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
