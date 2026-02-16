"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Sparkles, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { FactificationAnimation } from "@/components/viewer/FactificationAnimation";

function FeaturePill({ icon: Icon, label, delay }: { icon: React.ElementType; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-neutral-200 shadow-tight text-sm text-neutral-700 font-medium"
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
  const [uploadCount, setUploadCount] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validatePdfFiles = (files: File[]): File[] => {
    if (!files.length) return [];
    const maxBytes = 25 * 1024 * 1024;
    const valid = files.filter((f) => f.type === "application/pdf" && f.size <= maxBytes);
    if (valid.length === 0) {
      setUploadError("Please upload PDF files (max 25 MB each).");
      return [];
    }
    if (valid.length !== files.length) {
      setUploadError("Some files were skipped. Only PDFs up to 25 MB are supported.");
    } else {
      setUploadError(null);
    }
    return valid;
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = validatePdfFiles(files);
    if (valid.length > 0) {
      setUploadCount(valid.length);
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
    const files = Array.from(e.dataTransfer.files ?? []);
    const valid = validatePdfFiles(files);
    if (valid.length > 0) {
      setUploadCount(valid.length);
      setIsFactifying(true);
    }
  };

  const handleAnimationComplete = () => {
    router.push("/vips");
  };

  if (isFactifying) {
    return (
      <FactificationAnimation
        onComplete={handleAnimationComplete}
        documentCount={uploadCount}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2 px-3 py-1 mb-6 bg-brand-50 rounded-full border border-brand-100"
        >
          <Sparkles size={14} className="text-brand-500" />
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">AI Powered Research Platform</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <h2 className="text-[32px] font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight leading-tight">
            Distribute Research,{" "}
            <span className="text-brand-500">Intelligently</span>
          </h2>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="text-neutral-600 text-base mb-10 max-w-lg font-medium"
        >
          Upload your research documents and let AI match the right insights
          to the right clients, instantly.
        </motion.p>

        {/* Upload card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            className={`
              relative group cursor-pointer
              flex flex-col items-center justify-center
              py-16 px-10 w-full
              rounded-[24px] border-2 border-dashed
              transition-all duration-300
              ${isDragging
                ? "border-brand-500 bg-brand-50/50 scale-[1.02] shadow-lg shadow-brand-500/10"
                : "border-neutral-200 bg-white hover:border-brand-300 hover:shadow-md"
              }
            `}
          >
            <div className={`
              w-16 h-16 rounded-xl flex items-center justify-center mb-6
              transition-all duration-300
              ${isDragging
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                : "bg-neutral-100 text-neutral-500 group-hover:bg-brand-50 group-hover:text-brand-500"
              }
            `}>
              <Upload size={28} />
            </div>

            <h3 className="text-xl font-bold text-neutral-950 mb-2 tracking-tight">
              Upload Research Documents
            </h3>

            <p className="text-neutral-500 text-sm mb-8 font-medium">
              Drop PDFs here or click to browse
            </p>

            <div className={`
              flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold tracking-tight
              transition-all duration-300
              ${isDragging
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                : "bg-neutral-950 text-white group-hover:bg-brand-500 group-hover:shadow-lg group-hover:shadow-brand-500/20"
              }
            `}>
              <span>Get Started</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
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
