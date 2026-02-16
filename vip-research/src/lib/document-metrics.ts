import type { ActionType, Document, Recommendation, TimelineEntry, VIP } from "./types";

export type ResearchCategoryId =
  | "technology"
  | "macro_fixed_income"
  | "esg_energy"
  | "real_assets_infra"
  | "geopolitics_regional"
  | "other";

export interface ResearchCategory {
  id: ResearchCategoryId;
  label: string;
  shortLabel: string;
  description: string;
}

export const RESEARCH_CATEGORIES: ResearchCategory[] = [
  {
    id: "technology",
    label: "Technology",
    shortLabel: "Tech",
    description: "Semiconductors, AI infrastructure, cybersecurity, and emerging compute.",
  },
  {
    id: "macro_fixed_income",
    label: "Macro & Fixed Income",
    shortLabel: "Macro/FI",
    description: "Rates, credit, EM debt, and banking system themes.",
  },
  {
    id: "esg_energy",
    label: "ESG & Energy",
    shortLabel: "ESG/Energy",
    description: "Clean energy, transition, commodities, and sustainability.",
  },
  {
    id: "real_assets_infra",
    label: "Real Assets & Infrastructure",
    shortLabel: "Real Assets",
    description: "Infrastructure capex, CRE, and real-asset positioning.",
  },
  {
    id: "geopolitics_regional",
    label: "Geopolitics & Regional",
    shortLabel: "Geo/Region",
    description: "Export controls, APAC policy, and regional cross-currents.",
  },
  {
    id: "other",
    label: "Other",
    shortLabel: "Other",
    description: "Coverage not classified under the primary research desks.",
  },
];

export interface DocumentMetrics {
  docId: string;
  categoryId: ResearchCategoryId;
  hasVersionAlert: boolean;

  reachVipIds: string[];
  reachCount: number;
  actionCounts: Record<ActionType, number>;
  avgCompletion: number;

  recommendedVipIds: string[];
  recommendedVipCount: number;
  avgRelevanceScore: number | null;
  maxRelevanceScore: number | null;

  freshnessScore: number; // 0-100
  performanceScore: number; // 0-100 composite
  needsAttention: boolean;
}

export interface AiShareAction {
  vipId: string;
  docId: string;
  relevanceScore: number;
  explanation: string;
  reasonTag: "high_match" | "needs_attention" | "fresh";
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeParseDate(d: string): Date | null {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

export function getReferenceDateFromData(
  documents: Document[],
  engagementTimelines: Record<string, TimelineEntry[]>
): Date {
  const candidates: Date[] = [];

  for (const doc of documents) {
    const dt = safeParseDate(doc.date);
    if (dt) candidates.push(dt);
  }

  for (const entries of Object.values(engagementTimelines)) {
    for (const e of entries) {
      const dt = safeParseDate(e.date);
      if (dt) candidates.push(dt);
    }
  }

  // Using the latest in-data timestamp makes the demo stable even if runtime date differs.
  candidates.sort((a, b) => b.getTime() - a.getTime());
  return candidates[0] ?? new Date();
}

export function computeFreshnessScore(docDate: string, referenceDate: Date): number {
  const dt = safeParseDate(docDate);
  if (!dt) return 50;

  const diffMs = referenceDate.getTime() - dt.getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  // 0..~35 day shelf-life feel for finance research in demo.
  const score = 100 - days * 3;
  return Math.round(clamp(score, 0, 100));
}

function lcSet(items: string[]) {
  return items.map((t) => t.toLowerCase());
}

export function getResearchCategoryForDocument(doc: Document): ResearchCategoryId {
  const topics = lcSet(doc.topics);
  const title = (doc.title || "").toLowerCase();

  const hit = (keywords: string[]) =>
    keywords.reduce((sum, kw) => {
      const k = kw.toLowerCase();
      return sum + (topics.some((t) => t.includes(k)) || title.includes(k) ? 1 : 0);
    }, 0);

  const scores: Record<ResearchCategoryId, number> = {
    technology: hit([
      "semiconductor",
      "ai chip",
      "ai infrastructure",
      "cloud",
      "data center",
      "cyber",
      "quantum",
      "gpu",
    ]),
    macro_fixed_income: hit([
      "rates",
      "fixed income",
      "bond",
      "credit",
      "em debt",
      "banking",
      "consumer credit",
      "delinquen",
      "stress test",
    ]),
    esg_energy: hit([
      "esg",
      "clean energy",
      "renewable",
      "green bond",
      "oil",
      "gas",
      "energy transition",
      "commodit",
      "carbon",
    ]),
    real_assets_infra: hit([
      "real estate",
      "commercial real estate",
      "cbs",
      "cmbs",
      "cap rate",
      "infrastructure",
      "capex",
      "construction",
      "industrial",
      "reshoring",
    ]),
    geopolitics_regional: hit([
      "geopolitic",
      "export control",
      "china",
      "japan",
      "boj",
      "yen",
      "opec",
      "apac",
      "regulation",
    ]),
    other: 0,
  };

  // Small heuristic: "URGENT" docs skew geopolitical/regional.
  if (title.includes("urgent")) scores.geopolitics_regional += 2;

  let best: ResearchCategoryId = "other";
  let bestScore = 0;
  for (const [id, s] of Object.entries(scores) as Array<[ResearchCategoryId, number]>) {
    if (s > bestScore) {
      bestScore = s;
      best = id;
    }
  }
  return bestScore > 0 ? best : "other";
}

function getEngagementForDoc(
  docId: string,
  engagementTimelines: Record<string, TimelineEntry[]>
) {
  const entries: Array<{ vipId: string; entry: TimelineEntry }> = [];
  for (const [vipId, timeline] of Object.entries(engagementTimelines)) {
    for (const entry of timeline) {
      if (entry.documentId === docId) entries.push({ vipId, entry });
    }
  }
  return entries;
}

function getRecommendationsForDoc(docId: string, recommendations: Record<string, Recommendation[]>) {
  const recs: Array<{ vipId: string; rec: Recommendation }> = [];
  for (const [vipId, list] of Object.entries(recommendations)) {
    for (const rec of list) {
      if (rec.documentId === docId && !rec.dismissed) recs.push({ vipId, rec });
    }
  }
  return recs;
}

export function computeDocumentMetrics(params: {
  doc: Document;
  engagementTimelines: Record<string, TimelineEntry[]>;
  recommendations: Record<string, Recommendation[]>;
  documentAlerts: Array<{ documentId: string }>;
  referenceDate: Date;
}): DocumentMetrics {
  const { doc, engagementTimelines, recommendations, documentAlerts, referenceDate } = params;
  const categoryId = getResearchCategoryForDocument(doc);
  const hasVersionAlert = documentAlerts.some((a) => a.documentId === doc.id);

  const engagements = getEngagementForDoc(doc.id, engagementTimelines);
  const reachVipIds = Array.from(new Set(engagements.map((e) => e.vipId)));

  const actionCounts: Record<ActionType, number> = {
    shared: 0,
    opened: 0,
    read: 0,
    not_opened: 0,
  };

  let completionSum = 0;
  for (const { entry } of engagements) {
    actionCounts[entry.actionType] += 1;
    completionSum += entry.completionPercent;
  }

  const avgCompletion =
    engagements.length > 0 ? Math.round(completionSum / engagements.length) : 0;

  const docRecs = getRecommendationsForDoc(doc.id, recommendations);
  const recommendedVipIds = Array.from(new Set(docRecs.map((r) => r.vipId)));
  const relevanceScores = docRecs.map((r) => r.rec.relevanceScore);
  const avgRelevanceScore =
    relevanceScores.length > 0
      ? Math.round(relevanceScores.reduce((s, n) => s + n, 0) / relevanceScores.length)
      : null;
  const maxRelevanceScore = relevanceScores.length > 0 ? Math.max(...relevanceScores) : null;

  let freshnessScore = computeFreshnessScore(doc.date, referenceDate);
  if (hasVersionAlert) freshnessScore = clamp(freshnessScore + 12, 0, 100);
  if (doc.version) freshnessScore = clamp(freshnessScore + 5, 0, 100);

  const reachCount = reachVipIds.length;

  // Composite performance score tuned for demo:
  // - Engagement quality matters most (avgCompletion + read rate)
  // - Reach matters (how many VIPs touched it)
  // - AI relevance matters (avg/max relevance)
  // - Freshness provides a subtle boost
  const reads = actionCounts.read;
  const opens = actionCounts.opened;
  const notOpened = actionCounts.not_opened;
  const total = reads + opens + notOpened + actionCounts.shared;
  const readRate = total > 0 ? reads / total : 0;

  const engagementComponent = clamp(avgCompletion * 0.55 + readRate * 30, 0, 70);
  const reachComponent = clamp(reachCount * 8, 0, 20);
  const relevanceComponent = clamp((avgRelevanceScore ?? 40) * 0.18, 0, 18);
  const freshnessComponent = clamp(freshnessScore * 0.08, 0, 8);

  const performanceScore = Math.round(
    clamp(engagementComponent + reachComponent + relevanceComponent + freshnessComponent, 0, 100)
  );

  const lowEngagement = reachCount === 0 || (reads + opens) === 0;
  const highMatch = (maxRelevanceScore ?? 0) >= 75;
  const needsAttention = lowEngagement && highMatch;

  return {
    docId: doc.id,
    categoryId,
    hasVersionAlert,
    reachVipIds,
    reachCount,
    actionCounts,
    avgCompletion,
    recommendedVipIds,
    recommendedVipCount: recommendedVipIds.length,
    avgRelevanceScore,
    maxRelevanceScore,
    freshnessScore,
    performanceScore,
    needsAttention,
  };
}

export function computeAllDocumentMetrics(params: {
  documents: Document[];
  engagementTimelines: Record<string, TimelineEntry[]>;
  recommendations: Record<string, Recommendation[]>;
  documentAlerts: Array<{ documentId: string }>;
  referenceDate?: Date;
}): Record<string, DocumentMetrics> {
  const referenceDate =
    params.referenceDate ?? getReferenceDateFromData(params.documents, params.engagementTimelines);

  const out: Record<string, DocumentMetrics> = {};
  for (const doc of params.documents) {
    out[doc.id] = computeDocumentMetrics({
      doc,
      engagementTimelines: params.engagementTimelines,
      recommendations: params.recommendations,
      documentAlerts: params.documentAlerts,
      referenceDate,
    });
  }
  return out;
}

export function computeAiShareActions(params: {
  vips: VIP[];
  documents: Document[];
  recommendations: Record<string, Recommendation[]>;
  engagementTimelines: Record<string, TimelineEntry[]>;
  limit?: number;
}): AiShareAction[] {
  const { vips, recommendations, engagementTimelines } = params;
  const limit = Math.max(1, params.limit ?? 6);

  const actions: AiShareAction[] = [];

  for (const vip of vips) {
    const recs = (recommendations[vip.id] ?? []).filter((r) => !r.dismissed && !r.shared);
    if (recs.length === 0) continue;

    // Skip documents the VIP already has engagement entries for.
    const alreadyTouched = new Set(
      (engagementTimelines[vip.id] ?? []).map((e) => e.documentId)
    );

    const candidates = recs
      .filter((r) => !alreadyTouched.has(r.documentId))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    const top = candidates[0];
    if (!top) continue;

    const reasonTag: AiShareAction["reasonTag"] =
      top.relevanceScore >= 85 ? "high_match" : top.relevanceScore >= 70 ? "fresh" : "needs_attention";

    actions.push({
      vipId: vip.id,
      docId: top.documentId,
      relevanceScore: top.relevanceScore,
      explanation: top.aiExplanation,
      reasonTag,
    });
  }

  actions.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return actions.slice(0, limit);
}

