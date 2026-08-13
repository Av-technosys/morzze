"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "@/hooks/appLink";
import { preload } from "react-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  preload(
    "https://d2icu6klh68l1z.cloudfront.net/website-images/MORZZE-DEALER_compressed.mp4",
    { as: "video" },
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start video playback
    video.muted = true;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Attempt to unmute if the browser permits it
          video.muted = false;
          // Verify if it continues playing with audio
          if (video.paused) {
            video.muted = true;
            video
              .play()
              .catch((err) => console.log("Muted autoplay failed:", err));
          } else {
            setIsMuted(false);
          }
        })
        .catch((error) => {
          // Autoplay with audio was blocked, fallback to muted autoplay
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .catch((err) =>
              console.log("Muted fallback autoplay failed:", err),
            );
        });
    }
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section className="relative min-h-screen w-full md:py-8 py-18  flex items-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <video
          ref={videoRef}
          src="https://d2icu6klh68l1z.cloudfront.net/website-images/MORZZE-DEALER_compressed.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 md:bg-black/20"></div>
      </motion.div>

      {/* Floating Unmute Control */}
      <button
        onClick={toggleMute}
        className="absolute top-10 right-10 z-20 flex items-center gap-2 bg-black/60 hover:bg-black/80 border border-white/10 px-4 py-2.5 rounded-none text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-all duration-300"
      >
        {isMuted ? (
          <>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
            Unmute
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5 animate-pulse text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            Mute
          </>
        )}
      </button>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent"></div>
    </section>
  );
};

export default HeroSection;
