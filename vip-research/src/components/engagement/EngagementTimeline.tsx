"use client";

import React from "react";
import { TimelineEntry, ActionType } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate, cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const actionConfig: Record<
  ActionType,
  { label: string; variant: "green" | "orange" | "blue" | "red" }
> = {
  shared: { label: "Shared", variant: "blue" },
  opened: { label: "Opened", variant: "orange" },
  read: { label: "Read", variant: "green" },
  not_opened: { label: "Not Opened", variant: "red" },
};

interface EngagementTimelineProps {
  entries: TimelineEntry[];
  vipId?: string;
}

export function EngagementTimeline({ entries, vipId }: EngagementTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line with gradient */}
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-brand-500 via-neutral-300 to-neutral-200" />

      <div className="flex flex-col gap-2">
        {entries.map((entry, i) => {
          const config = actionConfig[entry.actionType];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              className="flex items-start gap-6 py-4 relative group"
            >
              {/* Dot with pulse for latest */}
              <div className="w-10 flex items-center justify-center flex-shrink-0 z-10">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 shadow-sm",
                  i === 0 
                    ? "bg-brand-500 border-white scale-110 ring-4 ring-brand-100" 
                    : "bg-white border-neutral-400 group-hover:border-brand-300"
                )} />
              </div>

              {/* Content */}
              <div className={cn(
                "flex-1 bg-white border rounded-lg p-4 shadow-tight transition-all duration-300 hover:shadow-fluffy hover:border-brand-200",
                i === 0 ? "border-brand-200 ring-1 ring-brand-50/50" : "border-neutral-200"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    {formatDate(entry.date)}
                  </span>
                  <Badge variant={config.variant} size="md" className="uppercase tracking-[0.1em] font-bold text-[9px] px-2 py-0.5">
                    {config.label}
                    {entry.actionType === "read" &&
                      ` ${entry.completionPercent}%`}
                  </Badge>
                </div>
                <a
                  href={`/viewer/${entry.documentId}${vipId ? `?vipId=${encodeURIComponent(vipId)}` : ""}`}
                  className="text-[15px] font-bold text-neutral-950 hover:text-brand-500 transition-colors flex items-center gap-2 group/link tracking-tight"
                >
                  {entry.documentTitle}
                  <ExternalLink size={14} className="opacity-30 group-hover/link:opacity-100 transition-opacity" />
                </a>

                {/* Progress bar for read entries */}
                {entry.completionPercent > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Read Progress</span>
                      <span className="text-[10px] font-bold text-neutral-950">{entry.completionPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.completionPercent}%` }}
                        transition={{ delay: 0.8 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full",
                          entry.completionPercent > 70
                            ? "bg-status-green-500 shadow-[0_0_8px_rgba(90,212,90,0.4)]"
                            : entry.completionPercent > 30
                            ? "bg-status-orange-500 shadow-[0_0_8px_rgba(255,165,55,0.4)]"
                            : "bg-status-red-500 shadow-[0_0_8px_rgba(246,85,79,0.4)]"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
