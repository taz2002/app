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
  const [isRevealed, setIsRevealed] = useState(false);
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

    // Total cinematic duration
    const timer = setTimeout(() => {
      setShowIntro(false);
      // Reveal the background hero quickly during the fadeout
      setTimeout(() => setIsRevealed(true), 200);
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
              scale: 1.05,
              transition: { duration: 0.8, ease: exitEase } 
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0b0b] overflow-hidden pointer-events-none"
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

            <div className="relative z-10 flex flex-col items-center justify-center w-full px-4">
              {/* Brand Reveal Cinematic Focus */}
              <div className="relative flex items-center justify-center h-32 w-32 md:h-48 md:w-48 mb-8 md:mb-10">
                {/* Luminous Pulsing Aura */ }
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-[#b6ff3b]/30 mix-blend-screen"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [0.5, 1.2, 1.6], opacity: [0, 0.6, 0] }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeOut", 
                      delay: i * 1 
                    }}
                    style={{
                      background: "radial-gradient(circle at 50% 50%, rgba(139,195,74,0.1) 0%, transparent 70%)"
                    }}
                  />
                ))}
                
                {/* Logo Ascent */}
                <motion.img
                  src="/logo-large.png"
                  alt="Tazkhiir Logo"
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.3, ease: customEase }}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_25px_rgba(139,195,74,0.3)]"
                />
              </div>

              {/* Reflective Cinematic Messages */}
              <div className="h-8 overflow-hidden flex items-center justify-center mb-8 w-full max-w-[80vw] mx-auto text-center px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={messageIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.7, ease: customEase }}
                    className="text-[#b6ff3b] text-xs sm:text-sm md:text-base font-medium tracking-[0.05em] md:tracking-[0.1em]"
                    style={{ textShadow: '0 0 12px rgba(182,255,59,0.6)' }}
                  >
                    {messages[messageIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Glowing Precision Progress Line */}
              <motion.div 
                className="h-[1.5px] bg-[#8bc34a]/15 relative overflow-hidden rounded-full shadow-[0_0_12px_rgba(139,195,74,0.3)] max-w-[80vw]"
                initial={{ opacity: 0, width: "0%" }}
                animate={{ opacity: 1, width: "16rem" }} // 16rem = 256px max width
                transition={{ duration: 1.8, delay: 0.8, ease: customEase }}
              >
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-transparent via-[#b6ff3b] to-[#8bc34a]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 3.5, delay: 0.8, ease: customEase }}
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
          y: 0
        } : { 
          opacity: 0, 
          scale: 0.98, 
          y: 10
        }}
        transition={{ duration: 0.8, ease: customEase, delay: !showIntro ? 0.1 : 0 }}
        className="min-h-screen text-[var(--text-primary)] transition-colors duration-300"
        style={{ 
          opacity: isMounted ? undefined : 0,
          transform: isRevealed ? "none" : undefined
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
