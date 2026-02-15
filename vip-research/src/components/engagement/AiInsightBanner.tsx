"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AiInsight } from "@/lib/types";
import { motion } from "framer-motion";

interface AiInsightBannerProps {
  insight: AiInsight;
}

export function AiInsightBanner({ insight }: AiInsightBannerProps) {
  const isPositive = insight.type === "positive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className={`flex items-start gap-4 p-5 rounded-lg border shadow-tight relative overflow-hidden ${
        isPositive 
          ? "bg-status-green-100/50 border-status-green-200" 
          : "bg-status-orange-100/50 border-status-orange-200"
      }`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 pointer-events-none ${
        isPositive ? "bg-status-green-500/10" : "bg-status-orange-500/10"
      }`} />

      <div
        className={`w-10 h-10 rounded-cta flex items-center justify-center flex-shrink-0 shadow-sm relative z-10 ${
          isPositive ? "bg-status-green-500" : "bg-status-orange-500"
        }`}
      >
        {isPositive ? (
          <TrendingUp size={20} className="text-white" />
        ) : (
          <TrendingDown size={20} className="text-white" />
        )}
      </div>
      <div className="flex-1 relative z-10">
        <p
          className={`text-[11px] font-bold mb-1 uppercase tracking-[0.15em] ${
            isPositive ? "text-status-green-700" : "text-status-orange-700"
          }`}
        >
          {insight.title}
        </p>
        <p className="text-[15px] text-neutral-900 leading-relaxed font-semibold">
          {insight.body}
        </p>
      </div>
    </motion.div>
  );
}
