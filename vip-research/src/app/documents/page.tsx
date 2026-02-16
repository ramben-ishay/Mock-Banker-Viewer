"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Send } from "lucide-react";
import { motion } from "framer-motion";
import { DOCUMENTS, DOCUMENT_ALERTS, ENGAGEMENT_TIMELINES, RECOMMENDATIONS, VIPS } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DocumentsToolbar, type DocumentsFilterKey, type DocumentsSortKey } from "@/components/documents/DocumentsToolbar";
import { AiSummaryBanner } from "@/components/documents/AiSummaryBanner";
import { TopPerformersStrip } from "@/components/documents/TopPerformersStrip";
import { DocumentCategorySection } from "@/components/documents/DocumentCategorySection";
import { DocumentShareModal } from "@/components/recommendations/DocumentShareModal";
import type { VIP, Document } from "@/lib/types";
import {
  computeAllDocumentMetrics,
  getReferenceDateFromData,
  RESEARCH_CATEGORIES,
  type ResearchCategoryId,
} from "@/lib/document-metrics";
import { formatDate } from "@/lib/utils";

interface ShareAlertState {
  document: Document;
  previousVersion: string;
  vips: VIP[];
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shareAlert, setShareAlert] = useState<ShareAlertState | null>(null);
  const [activeFilters, setActiveFilters] = useState<DocumentsFilterKey[]>([]);
  const [sortKey, setSortKey] = useState<DocumentsSortKey>("performance");
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState<ResearchCategoryId[]>([]);

  const referenceDate = useMemo(() => {
    return getReferenceDateFromData(DOCUMENTS, ENGAGEMENT_TIMELINES);
  }, []);

  const metricsByDocId = useMemo(() => {
    return computeAllDocumentMetrics({
      documents: DOCUMENTS,
      engagementTimelines: ENGAGEMENT_TIMELINES,
      recommendations: RECOMMENDATIONS,
      documentAlerts: DOCUMENT_ALERTS,
      referenceDate,
    });
  }, [referenceDate]);

  const activeFilterSet = useMemo(() => new Set(activeFilters), [activeFilters]);
  const collapsedCategorySet = useMemo(() => new Set(collapsedCategoryIds), [collapsedCategoryIds]);

  const toggleFilter = (key: DocumentsFilterKey) => {
    setActiveFilters((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const toggleCollapsedCategory = (id: ResearchCategoryId) => {
    setCollapsedCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const topPerformers = useMemo(() => {
    const items = DOCUMENTS.map((doc) => ({
      doc,
      metrics: metricsByDocId[doc.id],
    })).filter((x) => x.metrics);

    items.sort((a, b) => (b.metrics!.performanceScore ?? 0) - (a.metrics!.performanceScore ?? 0));
    return items.slice(0, 5) as Array<{ doc: Document; metrics: NonNullable<typeof items[number]["metrics"]> }>;
  }, [metricsByDocId]);

  const filteredDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let docs = DOCUMENTS.slice();

    if (q) {
      docs = docs.filter((doc) => {
        return (
          doc.title.toLowerCase().includes(q) ||
          doc.topics.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    // Derived thresholds (stable-ish): top 5 scores are “trending”.
    const allScores = DOCUMENTS.map((d) => metricsByDocId[d.id]?.performanceScore ?? 0)
      .slice()
      .sort((a, b) => b - a);
    const trendingCutoff = allScores[Math.min(4, allScores.length - 1)] ?? 0;

    if (activeFilterSet.size > 0) {
      docs = docs.filter((d) => {
        const m = metricsByDocId[d.id];
        if (!m) return false;

        if (activeFilterSet.has("new_versions") && m.hasVersionAlert) return true;
        if (activeFilterSet.has("needs_attention") && m.needsAttention) return true;
        if (activeFilterSet.has("high_ai_match") && (m.maxRelevanceScore ?? 0) >= 75) return true;
        if (activeFilterSet.has("trending") && (m.performanceScore ?? 0) >= trendingCutoff) return true;

        return false;
      });
    }

    const scoreFor = (d: Document) => metricsByDocId[d.id]?.performanceScore ?? 0;
    const completionFor = (d: Document) => metricsByDocId[d.id]?.avgCompletion ?? 0;
    const reachFor = (d: Document) => metricsByDocId[d.id]?.reachCount ?? 0;
    const relevanceFor = (d: Document) => metricsByDocId[d.id]?.maxRelevanceScore ?? 0;

    docs.sort((a, b) => {
      switch (sortKey) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "relevance":
          return relevanceFor(b) - relevanceFor(a);
        case "completion":
          return completionFor(b) - completionFor(a);
        case "reach":
          return reachFor(b) - reachFor(a);
        case "performance":
        default:
          return scoreFor(b) - scoreFor(a);
      }
    });

    return docs;
  }, [searchQuery, activeFilterSet, sortKey, metricsByDocId]);

  const docsByCategory = useMemo(() => {
    const by: Record<ResearchCategoryId, Document[]> = {
      technology: [],
      macro_fixed_income: [],
      esg_energy: [],
      real_assets_infra: [],
      geopolitics_regional: [],
      other: [],
    };

    for (const doc of filteredDocs) {
      const cat = metricsByDocId[doc.id]?.categoryId ?? "other";
      by[cat].push(doc);
    }
    return by;
  }, [filteredDocs, metricsByDocId]);

  const briefingText = useMemo(() => {
    const updatedCount = DOCUMENT_ALERTS.length;
    const attentionCount = DOCUMENTS.filter((d) => metricsByDocId[d.id]?.needsAttention).length;
    const top = topPerformers[0];
    const dayLabel = formatDate(referenceDate.toISOString());

    const updatedLine =
      updatedCount > 0
        ? `${updatedCount} document ${updatedCount === 1 ? "has" : "have"} a newer version flagged for follow-up.`
        : "No version updates are flagged right now.";

    const topLine = top
      ? `Top performer: ${top.doc.title} (${top.metrics.performanceScore} AI performance).`
      : "Top performers will appear once engagement signals are available.";

    const attentionLine =
      attentionCount > 0
        ? `${attentionCount} high-match documents have limited opens so far — consider a targeted share.`
        : "All high-match recommendations have at least some engagement.";

    return `As of ${dayLabel}: ${topLine} ${updatedLine} ${attentionLine}`;
  }, [metricsByDocId, topPerformers, referenceDate]);

  return (
    <div className="flex flex-col gap-6">
      <DocumentsToolbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        activeFilters={activeFilterSet}
        onToggleFilter={toggleFilter}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        totalCount={DOCUMENTS.length}
        filteredCount={filteredDocs.length}
      />

      <AiSummaryBanner text={briefingText} />

      {/* Version alerts (keep explicit call-to-action for demo) */}
      {DOCUMENT_ALERTS.map((alert) => {
        const alertDoc = DOCUMENTS.find((d) => d.id === alert.documentId);
        const affectedVips = alert.affectedVipIds
          .map((vid) => VIPS.find((v) => v.id === vid))
          .filter(Boolean);
        if (!alertDoc) return null;
        return (
          <motion.div
            key={alert.documentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-status-orange-100 border border-status-orange-500 rounded-popup p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-status-orange-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h6 className="text-sm font-semibold text-neutral-950 mb-1">
                  New Version Available: {alertDoc.title}
                </h6>
                <p className="text-sm text-neutral-800 mb-3">{alert.message}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-neutral-600">Previously read by:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {affectedVips.map(
                      (vip) =>
                        vip && (
                          <Link
                            key={vip.id}
                            href={`/vips/${vip.id}`}
                            className="flex items-center gap-1.5 hover:text-brand-500 transition-colors"
                          >
                            <Avatar initials={vip.avatar.initials} color={vip.avatar.color} size="sm" />
                            <span className="text-xs font-medium text-neutral-900">{vip.name}</span>
                          </Link>
                        )
                    )}
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send size={14} />}
                  onClick={() => {
                    setShareAlert({
                      document: alertDoc,
                      previousVersion: alert.previousVersion,
                      vips: affectedVips.filter((v): v is VIP => v !== undefined),
                    });
                  }}
                >
                  Share updated version with them
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}

      <TopPerformersStrip items={topPerformers} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-12 flex flex-col gap-4">
          {RESEARCH_CATEGORIES.filter((c) => docsByCategory[c.id].length > 0).map((category, idx) => (
            <DocumentCategorySection
              key={category.id}
              category={category}
              documents={docsByCategory[category.id]}
              metricsByDocId={metricsByDocId}
              collapsed={collapsedCategorySet.has(category.id)}
              onToggleCollapsed={() => toggleCollapsedCategory(category.id)}
              startIndexForAnimation={idx * 6}
            />
          ))}

          {filteredDocs.length === 0 && (
            <div className="text-center py-16 text-neutral-600 bg-neutral-000 border border-neutral-300 rounded-popup">
              <p>No documents match your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Share Updated Document Modal */}
      {shareAlert && (
        <DocumentShareModal
          isOpen={!!shareAlert}
          onClose={() => setShareAlert(null)}
          document={shareAlert.document}
          previousVersion={shareAlert.previousVersion}
          vips={shareAlert.vips}
        />
      )}
    </div>
  );
}
