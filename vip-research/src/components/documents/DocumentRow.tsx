import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, ExternalLink, FileText, Sparkles, Users, Gauge } from "lucide-react";
import type { Document } from "@/lib/types";
import type { DocumentMetrics } from "@/lib/document-metrics";
import { Tag, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, formatDate } from "@/lib/utils";

function scoreVariant(score: number) {
  if (score >= 82) return "green" as const;
  if (score >= 68) return "orange" as const;
  if (score >= 55) return "blue" as const;
  return "neutral" as const;
}

export function DocumentRow(props: {
  doc: Document;
  metrics: DocumentMetrics;
  index: number;
}) {
  const { doc, metrics, index } = props;
  const topics = doc.topics ?? [];
  const shownTopics = topics.slice(0, 3);
  const overflowCount = Math.max(0, topics.length - shownTopics.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(0.3, index * 0.03) }}
      className={cn(
        "bg-neutral-000 border border-neutral-300 rounded-popup px-4 py-3",
        "hover:shadow-tight hover:border-neutral-400 transition-all duration-200"
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Left: title/meta */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-cta bg-brand-100 flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-brand-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="text-sm font-semibold text-neutral-950 font-[family-name:var(--font-heading)] truncate">
                {doc.title}
              </div>
              {metrics.hasVersionAlert && (
                <Badge variant="orange" size="sm">
                  <Sparkles size={12} className="mr-1" />
                  Update
                </Badge>
              )}
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Published {formatDate(doc.date)}
              {doc.version ? ` · ${doc.version}` : ""}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {shownTopics.map((topic) => (
                <Tag key={topic}>{topic}</Tag>
              ))}
              {overflowCount > 0 && (
                <Badge variant="neutral" size="sm">
                  +{overflowCount}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right: metrics + actions */}
        <div className="flex items-center justify-between lg:justify-end gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={scoreVariant(metrics.performanceScore)} size="sm">
              <Gauge size={12} className="mr-1" />
              {metrics.performanceScore} Rel.
            </Badge>
            <Badge variant="blue" size="sm">
              <Users size={12} className="mr-1" />
              {metrics.reachCount} VIPs
            </Badge>
            <Badge variant="neutral" size="sm">
              {metrics.avgCompletion}% completion
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/viewer/${doc.id}`}>
              <Button variant="primary" size="sm" icon={<ExternalLink size={14} />}>
                Open
              </Button>
            </Link>
            <Link href={`/document/${doc.id}`}>
              <Button variant="secondary" size="sm" icon={<BarChart3 size={14} />}>
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

