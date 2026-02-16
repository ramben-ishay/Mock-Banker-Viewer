# Mock Data

All mock data lives in `src/lib/mock-data.ts` (~2200 lines). This file is the single source of truth for all demo content.

## Documents (15 J.P. Morgan Research PDFs)

Each document has a real PDF file in `/public/pdfs/` and a Factify URL.

| ID | Title | Topics | Version |
|----|-------|--------|---------|
| doc-1 | Q1 2026 Global Semiconductor Outlook | Semiconductors, AI chips, TSMC | v2 |
| doc-2 | AI Infrastructure: The $500B Capex Cycle | Cloud, Data centers, Capex | - |
| doc-3 | URGENT: US China Export Controls Impact | Geopolitics, China tech, Export controls | - |
| doc-4 | ESG and Clean Energy: 2026 Sector Review | ESG, Renewables, Green bonds | - |
| doc-5 | Emerging Markets Fixed Income Outlook | Bonds, EM debt, India | - |
| doc-6 | European Banking Stress Test Review | Banking, Regulation, Eurozone | - |
| doc-7 | Global Commercial Real Estate Reset | Real estate, REITs, Office vacancy | - |
| doc-8 | Global Cybersecurity Spending Outlook | Cybersecurity, SaaS, Zero trust | - |
| doc-9 | Global Oil and Gas Supply Demand Rebalancing | Energy, OPEC, Oil prices | - |
| doc-10 | Japan Monetary Policy and Equity Implications | Japan, BOJ, Yen, Nikkei | - |
| doc-11 | 2026 US Healthcare and Biotech Outlook | Healthcare, Biotech, FDA approvals | - |
| doc-12 | Crypto Regulation and Institutional Adoption | Crypto, Bitcoin, Regulation | - |
| doc-13 | Quantum Computing Commercialization Roadmap | Quantum computing, IBM, Enterprise | - |
| doc-14 | US Consumer Credit Delinquency Monitor | Consumer credit, Delinquencies, Auto loans | - |
| doc-15 | US Infrastructure and Industrials Capex Tracker | Infrastructure, Industrials, Capex | - |

Each document object looks like:
```typescript
{
  id: "doc-1",
  title: "Q1 2026 Global Semiconductor Outlook",
  version: "v2",
  topics: ["Semiconductors", "AI chips", "TSMC"],
  date: "2026-01-10",
  factifyUrl: "https://d.factify.com/documents/...",
  pdfPath: "/pdfs/Q1_2026_Global_Semiconductor_Outlook.pdf"
}
```

## VIPs (8 Mock Clients)

| Name | Company | Role | AUM | Key Interests |
|------|---------|------|-----|---------------|
| Sarah Chen | Meridian Capital Partners | Managing Director | $2.4B | Semiconductors, AI chips, TSMC, Cloud computing |
| James Harrington | Blackstone Global | Senior Portfolio Manager | $5.1B | Real estate, Private equity, ESG |
| Fatima Al-Rashid | Dubai Investment Authority | Chief Investment Officer | $8.7B | EM debt, Sovereign wealth, Oil & gas |
| Alexandra Petrova | Renaissance Technologies | Quantitative Analyst | $1.2B | Quantum computing, AI/ML, Algorithmic trading |
| Michael O'Brien | Wellington Management | Fixed Income Director | $3.8B | US Treasuries, Credit markets, Consumer credit |
| Yuki Tanaka | Nomura Asset Management | Senior Fund Manager | $4.2B | Japan equities, BOJ policy, Asian markets |
| Carlos Rivera | Grupo Financiero Banorte | Head of Global Markets | $2.9B | EM fixed income, Mexico, Green bonds |
| Elena Voronova | Sberbank CIB | Head of Research | $6.3B | European banking, Cybersecurity, Geopolitics |

Each VIP has:
- Full profile (email, company, role, AUM)
- Interests array (3-5 topics)
- Communication notes (e.g., "Prefers concise 2-page summaries...")
- Reading profile (e.g., "Deep reader. Averages 4 minutes per page...")
- Past communications (3-5 entries with dates, types, summaries)
- Avatar with initials and custom color
- Engagement stats (docsShared, avgCompletion, lastActive)

## Engagement Timelines

Pre-populated engagement history per VIP showing document interactions:
```typescript
{
  id: "timeline-entry-id",
  date: "2026-01-12",
  documentId: "doc-1",
  documentTitle: "Q1 2026 Global Semiconductor Outlook",
  actionType: "read",        // "shared" | "opened" | "read" | "not_opened"
  completionPercent: 92       // 0-100
}
```

Each VIP has 3-6 timeline entries showing a realistic engagement history.

## Recommendations

AI-generated document recommendations per VIP. Each recommendation includes:
```typescript
{
  id: "rec-id",
  documentId: "doc-1",
  documentTitle: "Q1 2026 Global Semiconductor Outlook",
  relevanceScore: 95,         // 0-100
  aiExplanation: "Sarah has a strong interest in semiconductors and read 92% of the last TSMC report...",
  dismissed: false,
  shared: false
}
```

Each VIP typically has 2-4 recommendations. The AI explanation references both the VIP's interests AND their engagement history.

## AI Insights

Per-VIP engagement insights, either positive or negative:
```typescript
// Negative insight for a "cold" VIP
{
  type: "negative",
  title: "Engagement Declining",
  body: "Fatima hasn't opened any research in the last 3 weeks. Her completion rates have dropped from 65% to 15%..."
}

// Positive insight for an engaged VIP
{
  type: "positive",
  title: "Deep Engagement Detected",
  body: "Sarah spent an average of 4.2 minutes per page on the semiconductor report..."
}
```

## Quote Suggestions

Pre-extracted key passages from documents, used in the Share Modal when a banker shares a document:
```typescript
{
  id: "quote-id",
  documentId: "doc-1",
  quoteText: "TSMC's 3nm capacity expansion to 100,000 wafer starts/month by Q3 2026...",
  pageReference: "p. 3",
  approved: null,             // null = not decided, true = approved, false = rejected
  bankerComment: "This section on TSMC's 3nm capacity is directly relevant to your portfolio positioning."
}
```

Each document has 3-4 quote suggestions.

## Comment Threads

Pre-populated conversation threads showing banker-VIP interactions:
```typescript
{
  id: "thread-id",
  documentId: "doc-1",
  documentTitle: "Q1 2026 Global Semiconductor Outlook",
  quoteText: "TSMC's 3nm capacity expansion...",
  pageReference: "p. 3",
  pageNumber: 3,
  highlightArea: { top: 20, left: 10, width: 80, height: 15 },
  comments: [
    {
      id: "c1",
      author: { name: "You", initials: "JD", role: "banker", color: "#444aff" },
      text: "This directly impacts your TSMC position...",
      timestamp: "2026-01-10T09:30:00"
    },
    {
      id: "c2",
      author: { name: "Sarah Chen", initials: "SC", role: "vip", color: "#6e84ff" },
      text: "Great catch — I was planning to increase our allocation...",
      timestamp: "2026-01-10T14:15:00"
    }
  ]
}
```

## Suggested Actions

Per-VIP suggested actions (displayed on VIP detail page):
```typescript
{
  label: "Schedule a call to discuss declining engagement",
  type: "call"    // "call" | "email" | "share"
}
```

## Walkthrough Templates

Per-document walkthrough step templates with personalization placeholders:
```typescript
{
  id: "wt-1",
  documentId: "doc-1",
  pageNumber: 1,
  title: "Executive Summary",
  messageTemplate: "Based on your interest in {interest}, this executive summary highlights key shifts in the semiconductor landscape that could impact your portfolio.",
  relevantTopics: ["Semiconductors", "AI chips"],
  highlightArea: { top: 15, left: 5, width: 90, height: 25 }
}
```

Templates are personalized at runtime using `personalizeWalkthroughSteps()` which replaces `{interest}`, `{context}`, and `{name}` placeholders based on the VIP's profile.

## Predefined VIP Suggestions (for Add VIP autocomplete)

Additional VIP data used for the Tab autocomplete feature in the Add VIP modal. Includes pre-filled data for "Alexandra Petrova" and others that auto-populate when the user starts typing and presses Tab.
