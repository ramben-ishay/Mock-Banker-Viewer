"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "commenter" | "reply" | "message";

const variantClasses: Record<Variant, string> = {
  commenter: "bg-brand-100 text-brand-700 border-brand-200",
  reply: "bg-neutral-100 text-neutral-700 border-neutral-200",
  message: "bg-brand-100 text-brand-700 border-brand-200",
};

export function AIPersonalizedBadge({
  label = "AI Generated",
  variant = "commenter",
  className,
}: {
  label?: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide select-none",
        variantClasses[variant],
        className
      )}
      initial={{ opacity: 0, y: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex"
      >
        <Sparkles size={12} />
      </motion.span>
      <span>{label}</span>
    </motion.span>
  );
}

