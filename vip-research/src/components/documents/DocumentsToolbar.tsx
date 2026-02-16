import React from "react";
import { Search, Sparkles, AlertCircle, TrendingUp, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type DocumentsFilterKey =
  | "trending"
  | "needs_attention"
  | "new_versions"
  | "high_ai_match";

export type DocumentsSortKey =
  | "performance"
  | "newest"
  | "relevance"
  | "completion"
  | "reach";

const FILTERS: Array<{
  key: DocumentsFilterKey;
  label: string;
  icon: React.ReactNode;
}> = [
  { key: "trending", label: "Trending", icon: <TrendingUp size={14} /> },
  { key: "needs_attention", label: "Under-Distributed", icon: <AlertCircle size={14} /> },
  { key: "new_versions", label: "New Versions", icon: <Sparkles size={14} /> },
  { key: "high_ai_match", label: "High Relevance", icon: <Wand2 size={14} /> },
];

export function DocumentsToolbar(props: {
  searchQuery: string;
  onSearchQueryChange: (next: string) => void;
  activeFilters: Set<DocumentsFilterKey>;
  onToggleFilter: (key: DocumentsFilterKey) => void;
  sortKey: DocumentsSortKey;
  onSortKeyChange: (key: DocumentsSortKey) => void;
  totalCount: number;
  filteredCount: number;
}) {
  const {
    searchQuery,
    onSearchQueryChange,
    activeFilters,
    onToggleFilter,
    sortKey,
    onSortKeyChange,
    totalCount,
    filteredCount,
  } = props;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h5 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-neutral-950">
            Research Documents
          </h5>
          <p className="text-sm text-neutral-600 mt-1">
            {filteredCount} of {totalCount} documents
          </p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="text"
            placeholder="Search by title or topic..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-neutral-000 border border-neutral-300 rounded-cta text-sm text-neutral-950 placeholder-neutral-500 outline-none focus:border-brand-300 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = activeFilters.has(f.key);
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => onToggleFilter(f.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-9 px-2.5 rounded-cta border text-xs font-semibold transition-colors cursor-pointer",
                  active
                    ? "bg-neutral-000 border-neutral-400 text-neutral-950"
                    : "bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-000 hover:text-neutral-950"
                )}
              >
                <span className={cn(active ? "text-brand-500" : "text-neutral-600")}>
                  {f.icon}
                </span>
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-600">Sort</span>
          <select
            value={sortKey}
            onChange={(e) => onSortKeyChange(e.target.value as DocumentsSortKey)}
            className="h-9 px-2 rounded-cta bg-neutral-000 border border-neutral-300 text-xs text-neutral-950 outline-none focus:border-brand-300"
          >
            <option value="performance">Engagement Score</option>
            <option value="newest">Newest</option>
            <option value="relevance">Relevance</option>
            <option value="completion">Completion</option>
            <option value="reach">Client Reach</option>
          </select>
        </div>
      </div>
    </div>
  );
}

