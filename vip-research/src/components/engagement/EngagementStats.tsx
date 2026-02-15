"use client";

import React from "react";
import { FileText, BarChart3, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface EngagementStatsProps {
  docsShared: number;
  avgCompletion: number;
  lastActive: string;
}

export function EngagementStats({
  docsShared,
  avgCompletion,
  lastActive,
}: EngagementStatsProps) {
  const stats = [
    {
      label: "Total Docs Shared",
      value: docsShared.toString(),
      icon: FileText,
      iconColor: "text-brand-500",
      bgColor: "bg-brand-100",
    },
    {
      label: "Avg Completion Rate",
      value: `${avgCompletion}%`,
      icon: BarChart3,
      iconColor: avgCompletion > 70 ? "text-status-green-700" : avgCompletion > 40 ? "text-status-orange-700" : "text-status-red-700",
      bgColor: avgCompletion > 70 ? "bg-status-green-100" : avgCompletion > 40 ? "bg-status-orange-100" : "bg-status-red-100",
    },
    {
      label: "Last Active",
      value: lastActive,
      icon: Clock,
      iconColor: "text-neutral-700",
      bgColor: "bg-neutral-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="bg-white border border-neutral-300 rounded-lg p-5 shadow-tight hover:shadow-fluffy transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-10 h-10 rounded-cta ${stat.bgColor} flex items-center justify-center shadow-sm`}
            >
              <stat.icon size={20} className={stat.iconColor} />
            </div>
            <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.1em]">{stat.label}</p>
          </div>
          <p className="text-3xl font-bold font-[family-name:var(--font-heading)] text-neutral-950 tracking-tight">
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
