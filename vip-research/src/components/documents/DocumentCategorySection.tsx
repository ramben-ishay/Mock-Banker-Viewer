import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Document } from "@/lib/types";
import type { DocumentMetrics, ResearchCategory } from "@/lib/document-metrics";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { DocumentRow } from "./DocumentRow";

function scoreVariant(score: number) {
  if (score >= 82) return "green" as const;
  if (score >= 68) return "orange" as const;
  if (score >= 55) return "blue" as const;
  return "neutral" as const;
}

export function DocumentCategorySection(props: {
  category: ResearchCategory;
  documents: Document[];
  metricsByDocId: Record<string, DocumentMetrics>;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  startIndexForAnimation: number;
}) {
  const { category, documents, metricsByDocId, collapsed, onToggleCollapsed, startIndexForAnimation } =
    props;

  const scores = documents
    .map((d) => metricsByDocId[d.id]?.performanceScore)
    .filter((n): n is number => typeof n === "number");
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length) : 0;

  return (
    <div className="bg-neutral-000 border border-neutral-300 rounded-popup overflow-hidden">
      <button
        type="button"
        onClick={onToggleCollapsed}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 cursor-pointer",
          "hover:bg-neutral-100 transition-colors"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-neutral-600">
            {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-950 truncate">{category.label}</p>
            <p className="text-xs text-neutral-600 truncate">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant="neutral" size="sm">
            {documents.length} docs
          </Badge>
          <Badge variant={scoreVariant(avgScore)} size="sm">
            {avgScore} avg AI
          </Badge>
        </div>
      </button>

      {!collapsed && (
        <div className="p-4 pt-0">
          <div className="flex flex-col gap-2.5">
            {documents.map((doc, idx) => {
              const metrics = metricsByDocId[doc.id];
              if (!metrics) return null;
              return (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  metrics={metrics}
                  index={startIndexForAnimation + idx}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

