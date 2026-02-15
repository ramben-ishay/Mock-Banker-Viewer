"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Sparkles, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { FactificationAnimation } from "@/components/viewer/FactificationAnimation";

function FloatingOrb({ delay, duration, x, y, size, color }: { delay: number; duration: number; x: string; y: string; size: string; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function FeaturePill({ icon: Icon, label, delay }: { icon: React.ElementType; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200 shadow-tight text-sm text-neutral-700 font-medium"
    >
      <Icon size={15} className="text-brand-500" />
      <span>{label}</span>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isFactifying, setIsFactifying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validatePdfFile = (file: File | null): boolean => {
    if (!file) return false;
    if (file.type !== "application/pdf") {
      setUploadError("Please upload a PDF file.");
      return false;
    }
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError("File is too large. Maximum size is 25 MB.");
      return false;
    }
    setUploadError(null);
    return true;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (validatePdfFile(file)) {
      setIsFactifying(true);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (validatePdfFile(file)) {
      setIsFactifying(true);
    }
  };

  const handleAnimationComplete = () => {
    router.push("/vips");
  };

  if (isFactifying) {
    return <FactificationAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-neutral-100 via-white to-brand-100/30 flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Floating background orbs */}
      <FloatingOrb delay={0} duration={8} x="10%" y="15%" size="300px" color="#444aff" />
      <FloatingOrb delay={2} duration={10} x="75%" y="10%" size="250px" color="#6e84ff" />
      <FloatingOrb delay={4} duration={9} x="60%" y="70%" size="200px" color="#98a9ff" />
      <FloatingOrb delay={1} duration={12} x="20%" y="75%" size="280px" color="#c2ceff" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #444aff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center max-w-3xl w-full">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 mb-8 bg-brand-100/60 backdrop-blur-sm rounded-full border border-brand-200/50"
        >
          <Sparkles size={14} className="text-brand-500" />
          <span className="text-sm font-semibold text-brand-700 tracking-wide">AI Powered Research Platform</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-heading font-bold text-neutral-950 mb-6 tracking-tight"
          style={{ fontSize: "clamp(40px, 8vw, 84px)", lineHeight: 1.05 }}
        >
          Distribute Research,{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-600 to-brand-400">
              Intelligently
            </span>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 1, ease: "circOut" }}
              className="absolute -bottom-2 left-0 right-0 h-1.5 bg-brand-500/20 rounded-full origin-left"
            />
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="text-center text-neutral-600 text-xl mb-12 max-w-xl leading-relaxed font-medium"
        >
          Upload your research documents and let AI match the right insights
          to the right clients, instantly.
        </motion.p>

        {/* Upload card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            className={`
              relative group cursor-pointer
              flex flex-col items-center justify-center
              py-20 px-10 w-full
              rounded-[32px] border-2 border-dashed
              transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
              ${isDragging
                ? "border-brand-500 bg-brand-100/60 scale-[1.05] shadow-[0_32px_64px_-16px_rgba(68,74,255,0.25)]"
                : "border-neutral-300 bg-white/40 backdrop-blur-xl hover:border-brand-400 hover:bg-white/80 hover:shadow-[0_24px_48px_-12px_rgba(17,18,20,0.08)] hover:-translate-y-1"
              }
            `}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/40 to-transparent opacity-100 pointer-events-none" />
            
            <div className={`
              relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6
              transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
              ${isDragging
                ? "bg-brand-500 text-white shadow-2xl shadow-brand-500/40 rotate-6"
                : "bg-white text-brand-500 shadow-fluffy group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-brand-500/30 group-hover:-rotate-3"
              }
            `}>
              <Upload size={32} strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl font-bold text-neutral-950 mb-3 tracking-tight relative z-10">
              Upload Research Documents
            </h3>

            <div className="flex items-center gap-2 text-neutral-500 text-base mb-10 relative z-10 font-medium">
              <FileText size={18} className="text-neutral-400" />
              <span>Drop PDFs here or click to browse</span>
            </div>

            <div className={`
              flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold tracking-tight
              transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
              ${isDragging
                ? "bg-brand-500 text-white shadow-2xl shadow-brand-500/40"
                : "bg-neutral-950 text-white group-hover:bg-brand-500 group-hover:shadow-2xl group-hover:shadow-brand-500/30 group-hover:px-10"
              }
            `}>
              <span>Get Started</span>
              <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-1" />
            </div>

            {/* Drag state inner highlight */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-4 rounded-[24px] border border-brand-500/20 bg-brand-500/5 pointer-events-none"
                />
              )}
            </AnimatePresence>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelection}
            className="hidden"
          />
          {uploadError && (
            <p className="text-sm text-status-red-700 mt-3 text-center">
              {uploadError}
            </p>
          )}
        </motion.div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <FeaturePill icon={Zap} label="Instant Analysis" delay={0.75} />
          <FeaturePill icon={Shield} label="Compliance Ready" delay={0.85} />
          <FeaturePill icon={BarChart3} label="Engagement Tracking" delay={0.95} />
        </div>
      </div>
    </div>
  );
}
