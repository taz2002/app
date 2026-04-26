"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Begin With Reflection",
  "Preparing Your Journey",
  "Enter With Intention",
];

// Cinematic easing curves
const customEase = [0.16, 1, 0.3, 1] as const; // Premium smooth easeOut
const exitEase = [0.43, 0.13, 0.23, 0.96] as const; // Smooth scale down exit

export default function IntroExperience({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showIntro, setShowIntro] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Intro triggers on mount, ensuring a premium 4.5s cinematic experience every time.
    // (SessionStorage check removed to maintain consistent triggering as requested)

    // Message rotation -> smoother timing, starts after brand reveal
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 1100);

    // Total cinematic duration increased to ~4.5s
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.1,
              filter: "blur(20px)",
              transition: { duration: 1.2, ease: exitEase } 
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0b0b] overflow-hidden"
          >
            {/* Ambient Breathing Background */}
            <motion.div 
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ 
                opacity: [0, 0.6, 0.4], 
                scale: [1.2, 1, 1.05] 
              }}
              transition={{ duration: 4.5, ease: customEase }}
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(139,195,74,0.18) 0%, rgba(10,14,8,0) 60%)"
              }}
            />
            
            {/* Deep overlay vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.8)_80%)] pointer-events-none" />

            {/* Premium Dust Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[2px] h-[2px] bg-[#b6ff3b] rounded-full blur-[1px]"
                  initial={{
                    x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 500,
                    y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 500,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    y: [null, Math.random() * -150 - 50],
                    x: [null, (Math.random() - 0.5) * 50],
                    opacity: [0, Math.random() * 0.4 + 0.1, 0],
                    scale: [0, Math.random() * 1.5 + 0.5, 0]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Brand Reveal Cinematic Focus */}
              <div className="relative flex items-center justify-center h-40 w-40 mb-10">
                {/* Luminous Rotating Arc */}
                <motion.svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  className="absolute inset-0 overflow-visible opacity-40 mix-blend-screen"
                  initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 180, scale: 1.1, opacity: [0, 0.4, 0.2] }}
                  transition={{ duration: 4.5, ease: customEase }}
                >
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="url(#glow-gradient)"
                    strokeWidth="1"
                    strokeDasharray="100 200"
                    initial={{ strokeDashoffset: 300 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 4, ease: customEase }}
                  />
                  <defs>
                    <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8bc34a" />
                      <stop offset="50%" stopColor="#b6ff3b" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </motion.svg>
                
                {/* Typographic Ascent */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 15, filter: "blur(12px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1.4, delay: 0.3, ease: customEase }}
                  className="text-4xl md:text-6xl font-['Bionix'] text-white tracking-[0.15em] drop-shadow-[0_0_25px_rgba(139,195,74,0.5)]"
                >
                  <motion.span
                    initial={{ textShadow: "0px 0px 0px rgba(182, 255, 59, 0)" }}
                    animate={{ textShadow: "0px 0px 30px rgba(182, 255, 59, 0.4)" }}
                    transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
                  >
                    TAZKHIIR
                  </motion.span>
                </motion.div>
              </div>

              {/* Reflective Cinematic Messages */}
              <div className="h-8 overflow-hidden flex items-center justify-center mb-8 w-64">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={messageIndex}
                    initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                    transition={{ duration: 0.7, ease: customEase }}
                    className="text-[#eaf1df]/80 text-sm md:text-base font-light tracking-[0.05em]"
                  >
                    {messages[messageIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Glowing Precision Progress Line */}
              <motion.div 
                className="w-48 h-[1px] bg-[#8bc34a]/10 relative overflow-hidden rounded-full shadow-[0_0_10px_rgba(139,195,74,0.2)]"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 192 }}
                transition={{ duration: 1.5, delay: 0.8, ease: customEase }}
              >
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-transparent via-[#b6ff3b] to-[#8bc34a]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 3.2, delay: 0.8, ease: customEase }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content Seamless Reveal */}
      <motion.div
        animate={!showIntro ? { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          filter: "blur(0px)" 
        } : { 
          opacity: 0, 
          scale: 0.96, 
          y: 20,
          filter: "blur(20px)" 
        }}
        transition={{ duration: 1.4, ease: customEase, delay: !showIntro ? 0.3 : 0 }}
        className="min-h-screen text-[var(--text-primary)] transition-colors duration-300"
        style={{ opacity: isMounted ? 1 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
