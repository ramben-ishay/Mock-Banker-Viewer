"use client";

import React from "react";
import { Recommendation } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getRelevanceColor } from "@/lib/utils";
import { Share2, X, Sparkles, ExternalLink, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface RecommendationCardProps {
  recommendation: Recommendation;
  vipId?: string;
  onShare: () => void;
  onDismiss: () => void;
}

export function RecommendationCard({
  recommendation,
  vipId,
  onShare,
  onDismiss,
}: RecommendationCardProps) {
  const relevance = getRelevanceColor(recommendation.relevanceScore);
  const viewerUrl = `/viewer/${recommendation.documentId}${
    vipId ? `?vipId=${encodeURIComponent(vipId)}` : ""
  }`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white border rounded-lg p-6 shadow-tight hover:shadow-fluffy transition-all duration-300 relative overflow-hidden group ${
        recommendation.shared ? "border-status-green-500 bg-status-green-100/10" : "border-neutral-300 hover:border-brand-300"
      }`}
    >
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <a
            href={viewerUrl}
            className="text-lg font-bold font-[family-name:var(--font-heading)] text-neutral-950 hover:text-brand-500 transition-colors inline-flex items-center gap-2 mb-2 tracking-tight"
          >
            {recommendation.documentTitle}
            <ExternalLink size={16} className="opacity-30 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </a>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                recommendation.relevanceScore > 70
                  ? "green"
                  : recommendation.relevanceScore >= 40
                  ? "orange"
                  : "red"
              }
              size="md"
              className="font-bold tracking-widest uppercase text-[10px]"
            >
              {recommendation.relevanceScore}% {relevance.label}
            </Badge>
            {recommendation.shared && (
              <Badge variant="green" size="md" className="font-bold tracking-widest uppercase text-[10px]">
                <CheckCircle size={12} className="mr-1.5" /> Shared
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="flex items-start gap-4 mb-6 p-4 bg-brand-100/50 rounded-lg border border-brand-200/30 relative z-10">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles size={16} className="text-brand-500" />
        </div>
        <p className="text-[15px] text-neutral-800 leading-relaxed font-medium">
          {recommendation.aiExplanation}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 relative z-10">
        {!recommendation.shared ? (
          <Button
            variant="primary"
            size="md"
            icon={<Share2 size={18} />}
            onClick={onShare}
            className="shadow-md shadow-brand-500/10"
          >
            Distribute to VIP
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="md"
            icon={<CheckCircle size={18} />}
            disabled
            className="bg-status-green-100 text-status-green-700 border-status-green-200"
          >
            Shared
          </Button>
        )}
        <a href={viewerUrl} className="block">
          <Button
            variant="secondary"
            size="md"
            icon={<ExternalLink size={18} />}
            className="bg-white"
          >
            View in Factify
          </Button>
        </a>
        <Button
          variant="tertiary"
          size="md"
          icon={<X size={18} />}
          onClick={onDismiss}
          className="text-neutral-500 hover:text-status-red-700 hover:bg-status-red-100"
        >
          Dismiss
        </Button>
      </div>
    </motion.div>
  );
}
