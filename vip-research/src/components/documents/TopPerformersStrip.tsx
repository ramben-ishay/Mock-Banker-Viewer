import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Trophy, Users, Gauge } from "lucide-react";
import type { Document } from "@/lib/types";
import type { DocumentMetrics } from "@/lib/document-metrics";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";

function scoreVariant(score: number) {
  if (score >= 82) return "green" as const;
  if (score >= 68) return "orange" as const;
  return "neutral" as const;
}

export function TopPerformersStrip(props: {
  items: Array<{ doc: Document; metrics: DocumentMetrics }>;
}) {
  const { items } = props;

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-neutral-700" />
          <h6 className="text-sm font-semibold text-neutral-950">Top Performing</h6>
        </div>
        <span className="text-xs text-neutral-600">Ranked by AI performance</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map(({ doc, metrics }, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className={cn(
              "min-w-[260px] bg-neutral-000 border border-neutral-300 rounded-popup p-4 hover:shadow-tight transition-shadow",
              "bg-gradient-to-br from-neutral-000 to-neutral-100"
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <Badge variant="neutral" size="sm">
                #{idx + 1}
              </Badge>
              <Badge variant={scoreVariant(metrics.performanceScore)} size="sm">
                <Gauge size={12} className="mr-1" />
                {metrics.performanceScore} AI
              </Badge>
            </div>

            <div className="text-sm font-semibold text-neutral-950 font-[family-name:var(--font-heading)] leading-tight mb-1">
              {doc.title}
            </div>
            <p className="text-xs text-neutral-600 mb-3">
              Published {formatDate(doc.date)}
              {doc.version ? ` · ${doc.version}` : ""}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">
                  <Users size={12} className="mr-1" />
                  {metrics.reachCount} VIPs
                </Badge>
                <Badge variant="neutral" size="sm">
                  {metrics.avgCompletion}% completion
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/viewer/${doc.id}`}
                  className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                >
                  Open <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

