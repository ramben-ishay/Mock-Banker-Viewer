"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { StarsIcon } from "./Icons";

interface FactificationAnimationProps {
  onComplete: () => void;
  documentTitle?: string;
}

export function FactificationAnimation({
  onComplete,
  documentTitle = "Constructing_Policies_and_Procedures_(Rev_16)",
}: FactificationAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-050 fv-root">
      {/* Header-like status */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-16 flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
            AI is analyzing your document
          </span>
        </div>
        <p className="text-sm font-medium text-neutral-600 uppercase tracking-[0.2em]">
          Matching with VIP interests
        </p>
      </motion.div>

      {/* Main Animation Container */}
      <div className="relative w-full max-w-[600px] h-[60vh] max-h-[450px] mx-4 p-1 rounded-2xl overflow-hidden">
        {/* Animated Gradient Border */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(0deg, #444aff, #ff7ff6, #444aff)",
              "linear-gradient(120deg, #444aff, #ff7ff6, #444aff)",
              "linear-gradient(240deg, #444aff, #ff7ff6, #444aff)",
              "linear-gradient(360deg, #444aff, #ff7ff6, #444aff)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />

        {/* Blurred Document Content */}
        <div className="relative w-full h-full bg-white rounded-[14px] overflow-hidden flex flex-col p-8">
          {/* Header area of blurred doc */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <div className="h-2 w-32 bg-neutral-200 rounded blur-[2px]" />
              <div className="h-2 w-24 bg-neutral-100 rounded blur-[2px]" />
            </div>
            <div className="w-12 h-12 bg-brand-100 rounded flex items-center justify-center blur-[1px]">
              {/* Logo placeholder */}
            </div>
          </div>

          {/* Title area of blurred doc */}
          <div className="space-y-3 mb-12">
            <div className="h-6 w-3/4 bg-neutral-300 rounded blur-[3px]" />
            <div className="h-4 w-1/2 bg-neutral-200 rounded blur-[2px]" />
          </div>

          {/* Body lines of blurred doc */}
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-2 bg-neutral-100 rounded blur-[2px]"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            ))}
          </div>

          {/* Scanning Overlay Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/10 to-transparent"
            animate={{
              top: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ height: "20%" }}
          />
        </div>
      </div>

      {/* Floating Sparkles/Stars */}
      <motion.div
        className="absolute"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ top: "20%", right: "20%" }}
      >
        <StarsIcon className="w-8 h-8 text-brand-300" />
      </motion.div>
      <motion.div
        className="absolute"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        style={{ bottom: "25%", left: "15%" }}
      >
        <StarsIcon className="w-6 h-6 text-brand-200" />
      </motion.div>
    </div>
  );
}
