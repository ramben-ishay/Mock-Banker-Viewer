"use client";

import { DOCUMENTS, QUOTE_SUGGESTIONS } from "@/lib/mock-data";

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function firstName(fullName?: string): string {
  if (!fullName) return "Alexandra";
  return fullName.split(" ")[0] || "Alexandra";
}

const FALLBACK_SUMMARY_TEXT =
  "This document provides a detailed analysis examining key themes, data, and conclusions. The AI has processed all pages and is ready to answer questions about the content.";

// A couple of curated summaries help the demo feel closer to the design reference.
// Everything else falls back to an auto-generated, doc-aware summary built from mock data.
const CURATED_SUMMARIES: Record<string, string> = {
  "doc-4":
    "This J.P. Morgan Research report provides a 2026 sector review of ESG and clean energy investing, analyzing the impact of evolving regulations, subsidy implementation, and capital allocation trends across renewables, grid infrastructure, and carbon markets. The report examines policy developments in the U.S. and Europe, including IRA implementation and the Green Deal, while maintaining a constructive outlook on select utilities and renewable developers with strong growth prospects and financial discipline. It highlights investment opportunities across solar, wind, storage, and grid infrastructure, with detailed analysis of regional capital expenditure patterns and corporate renewable procurement trends.",
  "doc-7":
    "This J.P. Morgan Research report analyzes the ongoing reset in global commercial real estate, with a focus on office repricing and the persistence of remote and hybrid work patterns. It highlights an expansion in U.S. office cap rates from cycle lows, continued pressure in secondary locations, and a base case where repricing extends through 2026 with stabilization beginning in late 2026 or early 2027 for select segments. The report favors more resilient areas of the market including logistics, multifamily, and data center exposure, and frames the outlook around cap rates, net absorption, and segment-level fundamentals.",
};

export function getDocumentSummary({
  docId,
  vipName,
}: {
  docId: string;
  vipName?: string;
}): string {
  const curated = CURATED_SUMMARIES[docId];
  if (curated) return curated;

  const doc = DOCUMENTS.find((d) => d.id === docId);
  if (!doc) return FALLBACK_SUMMARY_TEXT;

  const topics = (doc.topics || []).slice(0, 4);
  const quotes = QUOTE_SUGGESTIONS[docId] || [];
  const takeawayA = quotes[0]?.quoteText;
  const takeawayB = quotes[2]?.quoteText ?? quotes[1]?.quoteText;

  const namePrefix = vipName ? `${firstName(vipName)}, ` : "";
  const topicSentence =
    topics.length > 0 ? `It focuses on ${topics.join(", ")}.` : "";

  // Keep it concise enough to fit the card but still feel "real".
  const takeaways: string[] = [];
  if (takeawayA) takeaways.push(takeawayA);
  if (takeawayB) takeaways.push(takeawayB);

  const takeawaySentence =
    takeaways.length > 0
      ? `Key takeaways (demo scripted): ${takeaways.join(" ")}`
      : "";

  return [
    `${namePrefix}This J.P. Morgan Research report ("${doc.title}") is ready to chat.`,
    topicSentence,
    takeawaySentence,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getChatSuggestions({
  docId,
  vipName,
}: {
  docId: string;
  vipName?: string;
}): string[] {
  const doc = DOCUMENTS.find((d) => d.id === docId);
  const vip = firstName(vipName);
  const topics = doc?.topics?.slice(0, 2).join(" and ");

  // Keep these short so Tab autocomplete feels crisp.
  const base = [
    `Can you summarize this document in 3 bullets?`,
    `What are the key risks mentioned?`,
    `What is the main conclusion and why?`,
  ];

  const topicSpecific = topics
    ? [
        `What does this say about ${topics}?`,
        `${vip} here - what should I watch for in the next 30-90 days?`,
      ]
    : [`${vip} here - what should I watch for in the next 30-90 days?`];

  // Add one quote-derived prompt to make it feel document-aware.
  const quotes = QUOTE_SUGGESTIONS[docId] || [];
  const quotePrompt =
    quotes.length > 0
      ? [`Explain this passage: "${quotes[0].quoteText.slice(0, 72)}..."`]
      : [];

  return [...topicSpecific, ...quotePrompt, ...base];
}

export function getChatResponse({
  docId,
  prompt,
  vipName,
}: {
  docId: string;
  prompt: string;
  vipName?: string;
}): { content: string; citations?: string[] } {
  const doc = DOCUMENTS.find((d) => d.id === docId);
  const q = normalize(prompt);
  const vip = firstName(vipName);
  const quotes = QUOTE_SUGGESTIONS[docId] || [];

  const cite = (idx: number) => quotes[idx]?.pageReference;
  const quote = (idx: number) => quotes[idx]?.quoteText;

  // Generic fallback (still doc-aware via title/topics).
  const fallback = {
    content: [
      `Here is a demo-mode answer based on the document "${doc?.title || "this document"}":`,
      "",
      `- Focus areas: ${(doc?.topics || []).slice(0, 4).join(", ") || "key themes and findings"}`,
      `- What to do next: review the executive summary and the risks/monitoring section, then follow up with your banker on positioning impacts.`,
      "",
      `${vip}, if you tell me what you are optimizing for (risk reduction, conviction, timing), I can tailor the next steps.`,
    ].join("\n"),
  };

  // Patterns that map to real quotes we already have in mock data.
  if (q.includes("3 bullets") || q.includes("three bullets") || q.includes("summarize")) {
    const bullets = quotes.slice(0, 3).map((qq) => `- ${qq.quoteText}`);
    return {
      content: [`Summary (demo scripted):`, "", ...bullets].join("\n"),
      citations: [cite(0), cite(1), cite(2)].filter(Boolean) as string[],
    };
  }

  if (q.includes("risk")) {
    // Many docs include an explicit risks quote in index 2 in this dataset.
    if (quote(2)) {
      return {
        content: [
          `Key risks called out in this document:`,
          "",
          `- ${quote(2)}`,
          "",
          `If you want, I can translate these into a simple watchlist (data points + triggers).`,
        ].join("\n"),
        citations: [cite(2)].filter(Boolean) as string[],
      };
    }
    return fallback;
  }

  if (q.includes("passage") || q.includes("explain this")) {
    const best = quotes[0];
    if (!best) return fallback;
    return {
      content: [
        `Explanation (demo scripted):`,
        "",
        `- In plain English: this passage highlights a key driver or conclusion the authors want you to anchor on.`,
        `- Why it matters: it affects positioning, timing, and downside scenarios for the themes in scope.`,
        "",
        `Passage: "${best.quoteText}"`,
      ].join("\n"),
      citations: [best.pageReference].filter(Boolean) as string[],
    };
  }

  if (q.includes("30-90") || q.includes("next 30") || q.includes("watch for")) {
    return {
      content: [
        `${vip}, here is a simple 30-90 day watchlist (demo scripted):`,
        "",
        `- Watch the headline drivers in the executive summary and compare them to the base-case assumptions.`,
        `- Track any risk factors explicitly called out (policy changes, demand slowdowns, or second-order effects).`,
        `- If any of those move materially, re-check the positioning section and update the thesis.`,
      ].join("\n"),
    };
  }

  return fallback;
}

