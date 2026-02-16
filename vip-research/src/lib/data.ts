import {
  VIP,
  Document,
  TimelineEntry,
  Recommendation,
  QuoteSuggestion,
  CommentThread,
  AiInsight,
  WalkthroughStep,
  WalkthroughStepTemplate,
  PredefinedVipSuggestion,
} from "./types";

// ============================================================
// DOCUMENTS (15 J.P. Morgan Research PDFs)
// ============================================================
export const DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    title: "Q1 2026 Global Semiconductor Outlook",
    version: "v2",
    topics: ["Semiconductors", "AI chips", "Memory", "TSMC"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-fa38-7662-95b8-27c427e6e686",
    pdfPath: "/pdfs/JP_Research_Q1_2026_Global_Semiconductor_Outlook.pdf",
  },
  {
    id: "doc-2",
    title: "AI Infrastructure: The $500B Capex Cycle",
    topics: ["AI infrastructure", "Cloud", "Data centers", "Capex"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-c6ac-7407-8f5b-154a193f9f06",
    pdfPath: "/pdfs/JP_Research_AI_Infrastructure_500B_Capex_Cycle.pdf",
  },
  {
    id: "doc-3",
    title: "URGENT: US China Export Controls Impact",
    topics: ["Geopolitics", "China tech", "Export controls", "Semiconductors"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c81-0612-7273-84cc-ef2f0b2a1009",
    pdfPath: "/pdfs/JP_Research_URGENT_US_China_Export_Controls_Impact.pdf",
  },
  {
    id: "doc-4",
    title: "ESG and Clean Energy: 2026 Sector Review",
    topics: ["ESG", "Renewables", "Green bonds", "Grid infrastructure"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-d216-746a-809a-c44fe73afd07",
    pdfPath: "/pdfs/JP_Research_ESG_Clean_Energy_2026_Sector_Review.pdf",
  },
  {
    id: "doc-5",
    title: "Emerging Markets Fixed Income Outlook",
    topics: ["EM debt", "Bonds", "India", "Local currency"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-d7ca-7b0e-a6df-e75538b83a0b",
    pdfPath: "/pdfs/JP_Research_Emerging_Markets_Fixed_Income_Outlook.pdf",
  },
  {
    id: "doc-6",
    title: "European Banking Stress Test Review",
    topics: ["Banking", "CET1 capital", "Credit quality", "NII"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-dd7f-73a9-88aa-9e1ff8cbe4ac",
    pdfPath: "/pdfs/JP_Research_European_Banking_Stress_Test_Review.pdf",
  },
  {
    id: "doc-7",
    title: "Global Commercial Real Estate Reset",
    topics: ["Real estate", "Office repricing", "Cap rates", "CMBS"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-e37e-7e2b-a974-b00e37a4a45d",
    pdfPath: "/pdfs/JP_Research_Global_Commercial_Real_Estate_Reset.pdf",
  },
  {
    id: "doc-8",
    title: "Global Cybersecurity Spending Outlook",
    topics: ["Cybersecurity", "Cloud security", "Zero trust", "AI threats"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-e927-7134-963a-145323c84963",
    pdfPath: "/pdfs/JP_Research_Global_Cybersecurity_Spending_Outlook.pdf",
  },
  {
    id: "doc-9",
    title: "Global Oil and Gas Supply Demand Rebalancing",
    topics: ["Oil and gas", "OPEC+", "Energy transition", "Commodities"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-eef7-718e-bab3-986d00b4d657",
    pdfPath: "/pdfs/JP_Research_Global_Oil_Gas_Supply_Demand_Rebalancing.pdf",
  },
  {
    id: "doc-10",
    title: "Japan Monetary Policy and Equity Implications",
    topics: ["Japan", "BOJ", "Yen", "Nikkei", "Rates"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-f4af-7e72-9b45-1d36ec80fcec",
    pdfPath: "/pdfs/JP_Research_Japan_Monetary_Policy_Equity_Implications.pdf",
  },
  {
    id: "doc-11",
    title: "2026 US Healthcare and Biotech Outlook",
    topics: ["Healthcare", "Biotech", "GLP-1", "Pharma M&A"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-c0b0-78ec-9707-4a9103f1983d",
    pdfPath: "/pdfs/JP_Research_2026_US_Healthcare_Biotech_Outlook.pdf",
  },
  {
    id: "doc-12",
    title: "Crypto Regulation and Institutional Adoption",
    topics: ["Crypto", "Bitcoin ETF", "Stablecoins", "Digital assets"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c80-cc60-771e-8888-6b0a00c7bce5",
    pdfPath: "/pdfs/JP_Research_Crypto_Regulation_Institutional_Adoption.pdf",
  },
  {
    id: "doc-13",
    title: "Quantum Computing Commercialization Roadmap",
    topics: ["Quantum computing", "Enterprise tech", "Hardware milestones"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c81-0010-75c4-86ea-c48643cfd7c2",
    pdfPath: "/pdfs/JP_Research_Quantum_Computing_Commercialization_Roadmap.pdf",
  },
  {
    id: "doc-14",
    title: "US Consumer Credit Delinquency Monitor",
    topics: ["Consumer credit", "Delinquencies", "Auto loans", "BNPL"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c81-0bd0-75d1-a73e-6753b06941b0",
    pdfPath: "/pdfs/JP_Research_US_Consumer_Credit_Delinquency_Monitor.pdf",
  },
  {
    id: "doc-15",
    title: "US Infrastructure and Industrials Capex Tracker",
    topics: ["Infrastructure", "IIJA", "CHIPS Act", "Reshoring", "Construction"],
    date: "2026-02-11",
    factifyUrl:
      "https://d.factify.com/documents/019c4c81-118b-7e50-aca1-ad0a151392e3",
    pdfPath: "/pdfs/JP_Research_US_Infrastructure_Industrials_Capex_Tracker.pdf",
  },
];

// ============================================================
// VIPs
// ============================================================
export const VIPS: VIP[] = [
  {
    id: "vip-1",
    name: "Sarah Chen",
    email: "sarah.chen@globalfund.com",
    company: "Global Fund Management",
    role: "CIO",
    aum: "$4.2B",
    interests: ["Semiconductors", "AI chips", "TSMC", "Cybersecurity", "Quantum computing"],
    communicationNotes: "Prefers concise bullet points. Reads on mobile during commute.",
    docsShared: 8,
    avgCompletion: 87,
    lastActive: "2026-02-10",
    lastMeeting: "2026-02-03",
    readingProfile: "Reads 85% of shared content within 2 hours. Prefers mobile, peak reading at 7am. Focuses heavily on semiconductor sections. Average time per page: 1.8 minutes.",
    pastCommunications: [
      { date: "2026-02-03", type: "meeting", summary: "Quarterly portfolio review. Discussed increasing semiconductor allocation by 5%. Sarah expressed interest in TSMC 3nm capacity data." },
      { date: "2026-01-20", type: "call", summary: "Quick call on AI chip demand outlook. Sarah mentioned she is tracking NVIDIA inference revenue closely." },
      { date: "2026-01-08", type: "email", summary: "Shared Q4 semiconductor wrap. Sarah replied asking for more detail on advanced packaging trends." },
    ],
    avatar: { initials: "SC", color: "#5ad45a" },
  },
  {
    id: "vip-2",
    name: "Michael Torres",
    email: "m.torres@capitalpartners.com",
    company: "Capital Partners LLC",
    role: "Head of Infrastructure",
    aum: "$2.8B",
    interests: ["Cloud infrastructure", "Data centers", "Capex", "Real estate", "US infrastructure"],
    communicationNotes: "Likes detailed analysis with charts. Usually responds within 24h.",
    docsShared: 5,
    avgCompletion: 52,
    lastActive: "2026-02-03",
    lastMeeting: "2026-01-28",
    readingProfile: "Moderate reader. Opens documents within 6 hours on average. Completion drops off after page 10. Prefers desktop. Spends more time on charts and data tables.",
    pastCommunications: [
      { date: "2026-01-28", type: "meeting", summary: "Discussed cloud infrastructure capex trends. Michael is cautious on hyperscaler spending sustainability." },
      { date: "2026-01-15", type: "email", summary: "Sent data center market update. Michael replied with questions about power constraint analysis." },
      { date: "2025-12-20", type: "call", summary: "Year end review call. Michael wants more granular regional data center supply data for 2026." },
    ],
    avatar: { initials: "MT", color: "#ffa537" },
  },
  {
    id: "vip-3",
    name: "Fatima Al Rashid",
    email: "fatima.alrashid@gulfwealth.ae",
    company: "Gulf Wealth Sovereign Fund",
    role: "Director, Sustainable Investments",
    aum: "$12.5B",
    interests: ["ESG", "Clean energy", "Green bonds", "Oil and gas", "Carbon credits"],
    communicationNotes: "Prefers formal tone. Recently mentioned interest in carbon credits at annual review.",
    docsShared: 4,
    avgCompletion: 15,
    lastActive: "2026-01-19",
    lastMeeting: "2026-01-12",
    readingProfile: "Selective reader. When engaged, reads 100% of ESG content with 2 min/page average. Non ESG topics see near zero engagement. Reads exclusively on desktop between 9am and 12pm GST.",
    pastCommunications: [
      { date: "2026-01-12", type: "meeting", summary: "Annual review meeting. Fatima mentioned expanding the ESG mandate to include carbon credit instruments. Asked for pricing outlook data." },
      { date: "2025-12-18", type: "email", summary: "Shared ESG sector overview. Fatima forwarded it to her compliance team and asked about EU Green Bond Standard implications." },
      { date: "2025-11-25", type: "call", summary: "Brief check in call. Fatima confirmed the fund is increasing green bond allocation target from 8% to 15% of AUM." },
    ],
    avatar: { initials: "FA", color: "#f6554f" },
  },
  {
    id: "vip-4",
    name: "James Whitfield",
    email: "j.whitfield@sterlingam.co.uk",
    company: "Sterling Asset Management",
    role: "Senior Portfolio Manager, Fixed Income",
    aum: "$6.1B",
    interests: ["Bonds", "EM debt", "India markets", "European banking", "Consumer credit"],
    communicationNotes: "Early riser, sends emails before 7am. Prefers PDF format.",
    docsShared: 12,
    avgCompletion: 91,
    lastActive: "2026-02-11",
    lastMeeting: "2026-02-10",
    readingProfile: "Top reader across all VIPs. Reads 91% average completion. Opens documents within 30 minutes of sharing. Reads between 5:30am and 7am UK time. Highlights extensively and often leaves comments.",
    pastCommunications: [
      { date: "2026-02-10", type: "meeting", summary: "Morning briefing on EM fixed income. James increased India allocation last week and wants validation from the India index inclusion analysis." },
      { date: "2026-02-01", type: "call", summary: "Discussed export controls impact on EM supply chains. James wants to understand second order effects on Indian manufacturing." },
      { date: "2026-01-22", type: "email", summary: "James proactively asked for the upcoming EM fixed income outlook. Wants early access to the India chapter." },
    ],
    avatar: { initials: "JW", color: "#5ad45a" },
  },
  {
    id: "vip-5",
    name: "Priya Sharma",
    email: "priya.sharma@asianinvest.sg",
    company: "Asian Investment Corp",
    role: "Head of Geopolitical Research",
    aum: "$3.5B",
    interests: ["Geopolitics", "China tech", "Export controls", "Japan", "Crypto regulation"],
    communicationNotes: "Appreciates regional context for APAC. Also tracks semiconductor supply chain.",
    docsShared: 6,
    avgCompletion: 45,
    lastActive: "2026-02-05",
    lastMeeting: "2026-01-30",
    readingProfile: "Focused reader on geopolitics content (70%+ completion). Non core topics get 20 30% engagement. Reads on tablet during commute. Peak reading: 8am 9am SGT.",
    pastCommunications: [
      { date: "2026-01-30", type: "meeting", summary: "Deep dive on US China tech decoupling. Priya wants more APAC focused semiconductor analysis, especially around supply chain resilience." },
      { date: "2026-01-18", type: "call", summary: "Discussed export control implications for APAC portfolio companies. Priya flagged interest in Japan monetary policy shifts." },
      { date: "2026-01-05", type: "email", summary: "Priya requested a briefing on how export controls will affect APAC semiconductor supply chains specifically." },
    ],
    avatar: { initials: "PS", color: "#ffa537" },
  },
  {
    id: "vip-6",
    name: "David Nakamura",
    email: "d.nakamura@nihonsovereign.jp",
    company: "Nihon Sovereign Wealth Fund",
    role: "Head of Real Assets",
    aum: "$18.7B",
    interests: ["Infrastructure", "Real assets", "Japan", "BOJ policy", "Commercial real estate"],
    communicationNotes: "Very detail oriented. Prefers structured reports with executive summaries. Typically schedules calls 2 weeks in advance.",
    docsShared: 7,
    avgCompletion: 73,
    lastActive: "2026-02-08",
    lastMeeting: "2026-02-04",
    readingProfile: "Methodical reader. Reads reports in full but takes 2 3 days. Average completion 73%. Prefers desktop with dual monitor setup. Prints important reports.",
    pastCommunications: [
      { date: "2026-02-04", type: "meeting", summary: "Reviewed infrastructure pipeline in Japan and APAC. David is evaluating data center REIT exposure and renewable energy infrastructure." },
      { date: "2026-01-20", type: "call", summary: "Discussed BOJ normalization and its effect on real asset valuations. David wants analysis on commercial real estate cap rates." },
      { date: "2026-01-06", type: "email", summary: "David requested research on APAC semiconductor fab investments as potential infrastructure plays." },
    ],
    avatar: { initials: "DN", color: "#d04aff" },
  },
  {
    id: "vip-7",
    name: "Elena Kostrova",
    email: "e.kostrova@apexhedge.ch",
    company: "Apex Macro Hedge Fund",
    role: "Chief Strategist",
    aum: "$5.3B",
    interests: ["Macro", "FX", "Rates", "Healthcare", "Oil and gas"],
    communicationNotes: "Sharp and direct. Prefers 1 page summaries. Trades on speed of information.",
    docsShared: 9,
    avgCompletion: 68,
    lastActive: "2026-02-10",
    lastMeeting: "2026-02-07",
    readingProfile: "Speed reader. Opens documents within 15 minutes of sharing. Reads first 5 pages quickly (avg 45 seconds per page) then deep reads sections relevant to macro. Total session time: 8 12 minutes.",
    pastCommunications: [
      { date: "2026-02-07", type: "meeting", summary: "Macro outlook discussion. Elena is positioning for rate cuts in EM and wants the latest Japan monetary policy analysis." },
      { date: "2026-01-25", type: "call", summary: "FX strategy call. Elena is building a position around yen dynamics and wants BOJ rate path analysis." },
      { date: "2026-01-10", type: "email", summary: "Elena asked for a summary of export control impact on APAC currencies. Wants macro angle, not just sector." },
    ],
    avatar: { initials: "EK", color: "#4a92ff" },
  },
  {
    id: "vip-8",
    name: "Carlos Mendes",
    email: "c.mendes@mendesfamily.br",
    company: "Mendes Family Office",
    role: "Managing Director",
    aum: "$1.9B",
    interests: ["LatAm", "Commodities", "ESG", "Private credit", "Healthcare"],
    communicationNotes: "Relationship focused. Prefers personal calls over email. Interested in impact investing.",
    docsShared: 4,
    avgCompletion: 56,
    lastActive: "2026-02-06",
    lastMeeting: "2026-01-31",
    readingProfile: "Moderate engagement. Reads ESG and commodity content thoroughly (75%+). Other topics get 30 40% completion. Reads on mobile in evenings, BRT timezone.",
    pastCommunications: [
      { date: "2026-01-31", type: "meeting", summary: "Carlos discussed expanding into carbon credit investments. Wants to understand voluntary market pricing and LatAm carbon offset opportunities." },
      { date: "2026-01-14", type: "call", summary: "Reviewed EM fixed income opportunities in Brazil and Mexico. Carlos is cautious on duration but interested in private credit." },
      { date: "2025-12-22", type: "email", summary: "Year end wrap up. Carlos expressed interest in ESG reporting frameworks and impact measurement for the family office." },
    ],
    avatar: { initials: "CM", color: "#ffa537" },
  },
];

// ============================================================
// ENGAGEMENT TIMELINES
// ============================================================
export const ENGAGEMENT_TIMELINES: Record<string, TimelineEntry[]> = {
  "vip-1": [
    {
      id: "te-1-1",
      date: "2026-02-10",
      documentId: "doc-1",
      documentTitle: "Q1 2026 Global Semiconductor Outlook",
      actionType: "read",
      completionPercent: 92,
    },
    {
      id: "te-1-2",
      date: "2026-02-06",
      documentId: "doc-2",
      documentTitle: "AI Infrastructure: The $500B Capex Cycle",
      actionType: "read",
      completionPercent: 78,
    },
    {
      id: "te-1-3",
      date: "2026-01-28",
      documentId: "doc-3",
      documentTitle: "URGENT: US China Export Controls Impact",
      actionType: "opened",
      completionPercent: 35,
    },
    {
      id: "te-1-4",
      date: "2026-01-20",
      documentId: "doc-8",
      documentTitle: "Global Cybersecurity Spending Outlook",
      actionType: "opened",
      completionPercent: 40,
    },
    {
      id: "te-1-5",
      date: "2026-01-08",
      documentId: "doc-13",
      documentTitle: "Quantum Computing Commercialization Roadmap",
      actionType: "not_opened",
      completionPercent: 0,
    },
  ],
  "vip-2": [
    {
      id: "te-2-1",
      date: "2026-02-03",
      documentId: "doc-2",
      documentTitle: "AI Infrastructure: The $500B Capex Cycle",
      actionType: "read",
      completionPercent: 65,
    },
    {
      id: "te-2-2",
      date: "2026-01-25",
      documentId: "doc-15",
      documentTitle: "US Infrastructure and Industrials Capex Tracker",
      actionType: "read",
      completionPercent: 55,
    },
    {
      id: "te-2-3",
      date: "2026-01-18",
      documentId: "doc-7",
      documentTitle: "Global Commercial Real Estate Reset",
      actionType: "opened",
      completionPercent: 22,
    },
    {
      id: "te-2-4",
      date: "2026-01-10",
      documentId: "doc-9",
      documentTitle: "Global Oil and Gas Supply Demand Rebalancing",
      actionType: "not_opened",
      completionPercent: 0,
    },
    {
      id: "te-2-5",
      date: "2025-12-28",
      documentId: "doc-1",
      documentTitle: "Q1 2026 Global Semiconductor Outlook",
      actionType: "opened",
      completionPercent: 18,
    },
  ],
  "vip-3": [
    {
      id: "te-3-1",
      date: "2026-01-19",
      documentId: "doc-4",
      documentTitle: "ESG and Clean Energy: 2026 Sector Review",
      actionType: "read",
      completionPercent: 100,
    },
    {
      id: "te-3-2",
      date: "2026-01-10",
      documentId: "doc-9",
      documentTitle: "Global Oil and Gas Supply Demand Rebalancing",
      actionType: "read",
      completionPercent: 70,
    },
    {
      id: "te-3-3",
      date: "2025-12-28",
      documentId: "doc-5",
      documentTitle: "Emerging Markets Fixed Income Outlook",
      actionType: "opened",
      completionPercent: 8,
    },
    {
      id: "te-3-4",
      date: "2025-12-15",
      documentId: "doc-1",
      documentTitle: "Q1 2026 Global Semiconductor Outlook",
      actionType: "not_opened",
      completionPercent: 0,
    },
    {
      id: "te-3-5",
      date: "2025-12-01",
      documentId: "doc-11",
      documentTitle: "2026 US Healthcare and Biotech Outlook",
      actionType: "not_opened",
      completionPercent: 0,
    },
  ],
  "vip-4": [
    {
      id: "te-4-1",
      date: "2026-02-11",
      documentId: "doc-5",
      documentTitle: "Emerging Markets Fixed Income Outlook",
      actionType: "read",
      completionPercent: 95,
    },
    {
      id: "te-4-2",
      date: "2026-02-07",
      documentId: "doc-6",
      documentTitle: "European Banking Stress Test Review",
      actionType: "read",
      completionPercent: 88,
    },
    {
      id: "te-4-3",
      date: "2026-02-01",
      documentId: "doc-14",
      documentTitle: "US Consumer Credit Delinquency Monitor",
      actionType: "read",
      completionPercent: 72,
    },
    {
      id: "te-4-4",
      date: "2026-01-20",
      documentId: "doc-4",
      documentTitle: "ESG and Clean Energy: 2026 Sector Review",
      actionType: "read",
      completionPercent: 85,
    },
    {
      id: "te-4-5",
      date: "2026-01-10",
      documentId: "doc-1",
      documentTitle: "Q1 2026 Global Semiconductor Outlook",
      actionType: "read",
      completionPercent: 90,
    },
    {
      id: "te-4-6",
      date: "2025-12-20",
      documentId: "doc-10",
      documentTitle: "Japan Monetary Policy and Equity Implications",
      actionType: "read",
      completionPercent: 80,
    },
  ],
  "vip-5": [
    {
      id: "te-5-1",
      date: "2026-02-05",
      documentId: "doc-3",
      documentTitle: "URGENT: US China Export Controls Impact",
      actionType: "read",
      completionPercent: 58,
    },
    {
      id: "te-5-2",
      date: "2026-01-28",
      documentId: "doc-10",
      documentTitle: "Japan Monetary Policy and Equity Implications",
      actionType: "opened",
      completionPercent: 30,
    },
    {
      id: "te-5-3",
      date: "2026-01-15",
      documentId: "doc-12",
      documentTitle: "Crypto Regulation and Institutional Adoption",
      actionType: "opened",
      completionPercent: 25,
    },
    {
      id: "te-5-4",
      date: "2026-01-05",
      documentId: "doc-1",
      documentTitle: "Q1 2026 Global Semiconductor Outlook",
      actionType: "opened",
      completionPercent: 30,
    },
    {
      id: "te-5-5",
      date: "2025-12-22",
      documentId: "doc-4",
      documentTitle: "ESG and Clean Energy: 2026 Sector Review",
      actionType: "not_opened",
      completionPercent: 0,
    },
  ],
  "vip-6": [
    {
      id: "te-6-1",
      date: "2026-02-08",
      documentId: "doc-10",
      documentTitle: "Japan Monetary Policy and Equity Implications",
      actionType: "read",
      completionPercent: 82,
    },
    {
      id: "te-6-2",
      date: "2026-02-02",
      documentId: "doc-7",
      documentTitle: "Global Commercial Real Estate Reset",
      actionType: "read",
      completionPercent: 90,
    },
    {
      id: "te-6-3",
      date: "2026-01-22",
      documentId: "doc-15",
      documentTitle: "US Infrastructure and Industrials Capex Tracker",
      actionType: "read",
      completionPercent: 68,
    },
    {
      id: "te-6-4",
      date: "2026-01-12",
      documentId: "doc-2",
      documentTitle: "AI Infrastructure: The $500B Capex Cycle",
      actionType: "opened",
      completionPercent: 45,
    },
    {
      id: "te-6-5",
      date: "2025-12-28",
      documentId: "doc-4",
      documentTitle: "ESG and Clean Energy: 2026 Sector Review",
      actionType: "read",
      completionPercent: 55,
    },
  ],
  "vip-7": [
    {
      id: "te-7-1",
      date: "2026-02-10",
      documentId: "doc-10",
      documentTitle: "Japan Monetary Policy and Equity Implications",
      actionType: "read",
      completionPercent: 88,
    },
    {
      id: "te-7-2",
      date: "2026-02-05",
      documentId: "doc-3",
      documentTitle: "URGENT: US China Export Controls Impact",
      actionType: "read",
      completionPercent: 72,
    },
    {
      id: "te-7-3",
      date: "2026-01-28",
      documentId: "doc-5",
      documentTitle: "Emerging Markets Fixed Income Outlook",
      actionType: "read",
      completionPercent: 60,
    },
    {
      id: "te-7-4",
      date: "2026-01-18",
      documentId: "doc-9",
      documentTitle: "Global Oil and Gas Supply Demand Rebalancing",
      actionType: "opened",
      completionPercent: 50,
    },
    {
      id: "te-7-5",
      date: "2026-01-05",
      documentId: "doc-11",
      documentTitle: "2026 US Healthcare and Biotech Outlook",
      actionType: "opened",
      completionPercent: 25,
    },
  ],
  "vip-8": [
    {
      id: "te-8-1",
      date: "2026-02-06",
      documentId: "doc-4",
      documentTitle: "ESG and Clean Energy: 2026 Sector Review",
      actionType: "read",
      completionPercent: 78,
    },
    {
      id: "te-8-2",
      date: "2026-01-30",
      documentId: "doc-5",
      documentTitle: "Emerging Markets Fixed Income Outlook",
      actionType: "read",
      completionPercent: 55,
    },
    {
      id: "te-8-3",
      date: "2026-01-18",
      documentId: "doc-9",
      documentTitle: "Global Oil and Gas Supply Demand Rebalancing",
      actionType: "read",
      completionPercent: 65,
    },
    {
      id: "te-8-4",
      date: "2026-01-05",
      documentId: "doc-11",
      documentTitle: "2026 US Healthcare and Biotech Outlook",
      actionType: "opened",
      completionPercent: 20,
    },
    {
      id: "te-8-5",
      date: "2025-12-18",
      documentId: "doc-1",
      documentTitle: "Q1 2026 Global Semiconductor Outlook",
      actionType: "not_opened",
      completionPercent: 0,
    },
  ],
};

// ============================================================
// AI RECOMMENDATIONS
// No VIP is recommended a document they already have in their timeline
// ============================================================
export const RECOMMENDATIONS: Record<string, Recommendation[]> = {
  "vip-1": [
    {
      id: "rec-1-1",
      documentId: "doc-8",
      documentTitle: "Global Cybersecurity Spending Outlook",
      relevanceScore: 92,
      aiExplanation:
        "Sarah's tech portfolio has significant cybersecurity exposure. The report estimates the global cybersecurity market at approximately $215 billion in 2026 with 10% growth, and AI powered threats are driving investment in detection and response. Directly relevant given her semiconductor and tech mandate.",
      dismissed: false,
      shared: false,
    },
    {
      id: "rec-1-2",
      documentId: "doc-13",
      documentTitle: "Quantum Computing Commercialization Roadmap",
      relevanceScore: 75,
      aiExplanation:
        "Sarah tracks emerging tech inflection points. The report notes financial services firms are exploring quantum for portfolio optimization and risk simulation, with initial commercial impact expected by 2028 to 2030. Connects to her AI and semiconductor investment thesis.",
      dismissed: false,
      shared: false,
    },
  ],
  "vip-2": [
    {
      id: "rec-2-1",
      documentId: "doc-7",
      documentTitle: "Global Commercial Real Estate Reset",
      relevanceScore: 85,
      aiExplanation:
        "Michael's infrastructure focus extends to real asset valuations. The report estimates office cap rates expanded 120 to 180 basis points from cycle lows, while logistics, multifamily, and data center segments show resilience. Directly relevant for his REIT and infrastructure exposure.",
      dismissed: false,
      shared: false,
    },
    {
      id: "rec-2-2",
      documentId: "doc-6",
      documentTitle: "European Banking Stress Test Review",
      relevanceScore: 60,
      aiExplanation:
        "European banks are key lenders to the infrastructure sector. The stress test results show capital adequacy dispersion across institutions, with implications for project finance availability. NII normalization has implications for Michael's cost-of-capital assumptions on data center projects.",
      dismissed: false,
      shared: false,
    },
  ],
  "vip-3": [
    {
      id: "rec-3-1",
      documentId: "doc-9",
      documentTitle: "Global Oil and Gas Supply Demand Rebalancing",
      relevanceScore: 90,
      aiExplanation:
        "Fatima's sovereign fund has significant energy transition exposure. The report projects Brent in the $72 to $82 range and notes peak oil demand is approaching. The energy transition dynamics section connects directly to her ESG mandate and carbon offset strategy.",
      dismissed: false,
      shared: false,
    },
    {
      id: "rec-3-2",
      documentId: "doc-7",
      documentTitle: "Global Commercial Real Estate Reset",
      relevanceScore: 45,
      aiExplanation:
        "Lower relevance for Fatima's ESG mandate, but the green building and energy efficiency sections in the CRE report connect to sustainable real estate investing themes. The data center energy consumption angle also ties to her ESG screening criteria.",
      dismissed: false,
      shared: false,
    },
  ],
  "vip-4": [
    {
      id: "rec-4-1",
      documentId: "doc-15",
      documentTitle: "US Infrastructure and Industrials Capex Tracker",
      relevanceScore: 88,
      aiExplanation:
        "James reads broadly across fixed income and credit themes. The report estimates 35% of IIJA funding has been obligated with over $250 billion in manufacturing construction announced since 2022. The reshoring theme has direct implications for EM supply chain positioning.",
      dismissed: false,
      shared: false,
    },
    {
      id: "rec-4-2",
      documentId: "doc-12",
      documentTitle: "Crypto Regulation and Institutional Adoption",
      relevanceScore: 42,
      aiExplanation:
        "Peripheral to James's fixed income mandate, but crypto regulation is increasingly relevant for institutional portfolio diversification. Spot Bitcoin ETFs have attracted over $60 billion in cumulative inflows and the stablecoin market exceeds $200 billion. Merits monitoring for cross-asset implications.",
      dismissed: false,
      shared: false,
    },
  ],
  "vip-5": [
    {
      id: "rec-5-1",
      documentId: "doc-10",
      documentTitle: "Japan Monetary Policy and Equity Implications",
      relevanceScore: 93,
      aiExplanation:
        "Priya's geopolitical research extends to APAC monetary policy. The report projects one to two BOJ rate increases bringing the policy rate to 0.75% by year end, with yen strengthening toward 140 to 145 against the dollar. Carry trade unwinds could affect her APAC portfolio companies.",
      dismissed: false,
      shared: false,
    },
    {
      id: "rec-5-2",
      documentId: "doc-8",
      documentTitle: "Global Cybersecurity Spending Outlook",
      relevanceScore: 72,
      aiExplanation:
        "Cybersecurity has a geopolitical dimension. The report highlights AI powered threats and regulatory mandates like DORA driving spending, with cloud security growth at 18% in 2026. Connects to Priya's interest in tech supply chain and national security implications.",
      dismissed: false,
      shared: false,
    },
  ],
  "vip-6": [
    {
      id: "rec-6-1",
      documentId: "doc-9",
      documentTitle: "Global Oil and Gas Supply Demand Rebalancing",
      relevanceScore: 78,
      aiExplanation:
        "David's real asset mandate includes energy infrastructure. The report's OPEC+ strategy analysis and the approaching peak oil demand plateau have implications for energy infrastructure investment horizons. The downstream refining section connects to his Japan energy exposure.",
      dismissed: false,
      shared: false,
    },
    {
      id: "rec-6-2",
      documentId: "doc-6",
      documentTitle: "European Banking Stress Test Review",
      relevanceScore: 62,
      aiExplanation:
        "European banks provide significant project finance for infrastructure. The stress test results showing CET1 capital buffers and NII sustainability inform lending capacity for David's pipeline of infrastructure projects in the eurozone.",
      dismissed: false,
      shared: false,
    },
  ],
  "vip-7": [
    {
      id: "rec-7-1",
      documentId: "doc-11",
      documentTitle: "2026 US Healthcare and Biotech Outlook",
      relevanceScore: 82,
      aiExplanation:
        "Elena's macro strategy benefits from sector rotation signals. The report estimates the GLP-1 market could exceed $80 billion by 2028, and pharma M&A activity is accelerating. Healthcare is the second largest sector weight and has macro implications for consumer spending.",
      dismissed: false,
      shared: false,
    },
    {
      id: "rec-7-2",
      documentId: "doc-12",
      documentTitle: "Crypto Regulation and Institutional Adoption",
      relevanceScore: 58,
      aiExplanation:
        "Elena trades across asset classes. Spot Bitcoin ETFs compressed bid ask spreads and reduced volatility. The stablecoin legislation section has FX implications. At $200 billion market cap, stablecoins are relevant to her macro and FX positioning framework.",
      dismissed: false,
      shared: false,
    },
  ],
  "vip-8": [
    {
      id: "rec-8-1",
      documentId: "doc-12",
      documentTitle: "Crypto Regulation and Institutional Adoption",
      relevanceScore: 80,
      aiExplanation:
        "Carlos is exploring alternative investments for the family office. The report covers institutional custody frameworks and portfolio allocation approaches for digital assets. At $60 billion in Bitcoin ETF inflows, this is increasingly relevant for family office portfolio diversification.",
      dismissed: false,
      shared: false,
    },
    {
      id: "rec-8-2",
      documentId: "doc-15",
      documentTitle: "US Infrastructure and Industrials Capex Tracker",
      relevanceScore: 65,
      aiExplanation:
        "The IIJA and IRA spending ramp creates LatAm supply chain opportunities. Over $250 billion in US manufacturing construction has been announced, with growing demand for commodities and construction materials from Carlos's region of focus.",
      dismissed: false,
      shared: false,
    },
  ],
};

// ============================================================
// AI INSIGHTS
// ============================================================
export const AI_INSIGHTS: Record<string, AiInsight> = {
  "vip-1": {
    type: "positive",
    title: "High-Conviction Reader",
    body: "Sarah is one of your most engaged VIP relationships. She consistently reads 85%+ of shared research and typically opens documents within 2 hours of receiving them. Continue sharing semiconductor, AI infrastructure, and cybersecurity content.",
  },
  "vip-2": {
    type: "negative",
    title: "Engagement Declining -- Action Needed",
    body: "Michael's document completion rate dropped from 70% to 52% over the past month. He did not open the oil and gas report. Consider a targeted share of the commercial real estate reset or US infrastructure tracker to re-engage.",
  },
  "vip-3": {
    type: "negative",
    title: "Disengagement Alert",
    body: "Fatima has not opened any research in the last 3 weeks. Her completion rates have dropped from 65% to 15% over the past month. The ESG and oil and gas reports matched her interests best. A re-engagement call is recommended.",
  },
  "vip-4": {
    type: "positive",
    title: "Highest-Engagement VIP",
    body: "James has read every document you shared this quarter with an average completion of 91%. He is especially engaged with EM fixed income, European banking, and consumer credit content. Recommend early-sharing the US infrastructure tracker to maintain momentum.",
  },
  "vip-5": {
    type: "positive",
    title: "Emerging Interest Signal",
    body: "For the first time, Priya opened the crypto regulation report (25% completion). Combined with her geopolitics focus and Japan monetary policy reading, this signals an expanding focus on APAC financial regulation -- a potential coverage expansion opportunity.",
  },
  "vip-6": {
    type: "positive",
    title: "Consistent Reader",
    body: "David reads infrastructure, Japan monetary policy, and commercial real estate research methodically, averaging 73% completion. He takes 2 3 days but engages deeply. His CRE report completion of 90% suggests strong current interest.",
  },
  "vip-7": {
    type: "positive",
    title: "Speed Reader",
    body: "Elena opens documents within 15 minutes and makes trading decisions based on research. Her 88% completion on the Japan monetary policy piece suggests strong current interest in BOJ positioning and yen dynamics.",
  },
  "vip-8": {
    type: "negative",
    title: "Narrow Engagement Profile",
    body: "Carlos engages deeply with ESG and commodity content (75%+) but ignores other topics. His 65% completion on the oil and gas report and 20% on healthcare confirm commodity and ESG content as the primary engagement levers for this relationship.",
  },
};

// ============================================================
// QUOTE SUGGESTIONS (for Share Modal) - Real quotes from PDFs
// ============================================================
export const QUOTE_SUGGESTIONS: Record<string, QuoteSuggestion[]> = {
  "doc-1": [
    {
      id: "qs-1-1",
      documentId: "doc-1",
      quoteText:
        "We maintain a selective overweight on memory and advanced logic exposed to data center and edge AI, while remaining neutral on broader analog and discrete names until visibility improves.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-1-2",
      documentId: "doc-1",
      quoteText:
        "Our analysis suggests that the memory cycle has entered a recovery phase, with pricing power gradually returning to producers. We model low to mid single digit revenue growth for the broader sector in 2026.",
      pageReference: "p.1, Demand and Supply Balance",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-1-3",
      documentId: "doc-1",
      quoteText:
        "Key risks to our outlook include a sharper than expected slowdown in cloud capital expenditure, further escalation of export controls affecting China exposure, and inventory rebuild that proves short lived.",
      pageReference: "p.3, Risks and Monitoring Points",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-2": [
    {
      id: "qs-2-1",
      documentId: "doc-2",
      quoteText:
        "We estimate aggregate capital expenditure tied to AI infrastructure will approach $500 billion over the 2025 to 2028 period, driven by hyperscaler buildouts and enterprise adoption.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-2-2",
      documentId: "doc-2",
      quoteText:
        "Semiconductors capture the largest share of incremental spend, with GPUs and custom accelerators representing the bulk of content growth.",
      pageReference: "p.1, Semiconductor and Hardware Exposure",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-2-3",
      documentId: "doc-2",
      quoteText:
        "Grid connectivity and backup power solutions are critical, and we see opportunities for utilities and power equipment vendors. Cooling technologies are evolving to support higher density deployments.",
      pageReference: "p.2, Data Center Real Estate and Power",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-3": [
    {
      id: "qs-3-1",
      documentId: "doc-3",
      quoteText:
        "Recent updates to U.S. export controls affecting advanced semiconductors and equipment shipments to China require a reassessment of revenue and supply chain exposure across our coverage universe.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-3-2",
      documentId: "doc-3",
      quoteText:
        "Semiconductor equipment and select fabless vendors face the largest direct revenue impact. Diversification of end markets and geography remains a key differentiator in our ratings framework.",
      pageReference: "p.1, Sector and Name Level Impact",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-3-3",
      documentId: "doc-3",
      quoteText:
        "Allied and partner countries may adopt similar or complementary controls, which could broaden the impact over time.",
      pageReference: "p.2, Supply Chain and Customer Implications",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-4": [
    {
      id: "qs-4-1",
      documentId: "doc-4",
      quoteText:
        "Implementation of major climate and energy legislation in the U.S. and Europe continues to drive project pipelines and grid investment.",
      pageReference: "p.1, Policy and Regulation",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-4-2",
      documentId: "doc-4",
      quoteText:
        "Storage is increasingly critical for grid stability and for capturing renewable output; we review the outlook for batteries and for other storage technologies.",
      pageReference: "p.1, Renewables and Power Generation",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-4-3",
      documentId: "doc-4",
      quoteText:
        "Grid investment is a major theme, with aging infrastructure and renewable integration driving capital expenditure. We favor utilities with transparent regulatory frameworks and manageable execution risk.",
      pageReference: "p.2, Grid Infrastructure and Utilities",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-5": [
    {
      id: "qs-5-1",
      documentId: "doc-5",
      quoteText:
        "Our base case assumes a gradual easing cycle in the U.S. and Europe with a soft landing for growth. We see selective value in hard currency high yield and in local markets with attractive real yields and reform momentum.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-5-2",
      documentId: "doc-5",
      quoteText:
        "Our overweight positions reflect a combination of real yield appeal, reform progress, and relative value versus peers. We highlight selected countries in Latin America and EMEA.",
      pageReference: "p.2, Country and Segment Views",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-5-3",
      documentId: "doc-5",
      quoteText:
        "Key risks include a more hawkish than expected Fed, sovereign stress in high yield names, and political or geopolitical shocks.",
      pageReference: "p.2, Risks and Scenario Analysis",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-6": [
    {
      id: "qs-6-1",
      documentId: "doc-6",
      quoteText:
        "Results show that the majority of large banks maintain CET1 ratios above minimum requirements even under stressed conditions, reflecting the capital build of recent years. However, dispersion across institutions remains meaningful.",
      pageReference: "p.1, Stress Test Results",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-6-2",
      documentId: "doc-6",
      quoteText:
        "We expect NII to plateau in 2026 as rate cuts take effect and deposit repricing accelerates. Fee income and cost management are increasingly important differentiators for sustaining returns.",
      pageReference: "p.2, Profitability and NII",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-6-3",
      documentId: "doc-6",
      quoteText:
        "We favor banks with strong CET1 generation, diversified revenue streams, and clear capital return visibility. Our top picks are concentrated in northern European markets.",
      pageReference: "p.3, Sector Positioning",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-7": [
    {
      id: "qs-7-1",
      documentId: "doc-7",
      quoteText:
        "We estimate that office cap rates in the U.S. have expanded by 120 to 180 basis points from cycle lows, with further adjustment likely in secondary locations.",
      pageReference: "p.1, Office Market Repricing",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-7-2",
      documentId: "doc-7",
      quoteText:
        "Remote and hybrid work patterns have structurally reduced net absorption in many central business districts, and we see limited near term recovery in take up.",
      pageReference: "p.1, Office Market Repricing",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-7-3",
      documentId: "doc-7",
      quoteText:
        "Our base case assumes that the repricing cycle continues through 2026, with stabilization beginning in late 2026 or early 2027 for select segments. We favor logistics, multifamily, and data center exposure.",
      pageReference: "p.3, Outlook and Recommendations",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-8": [
    {
      id: "qs-8-1",
      documentId: "doc-8",
      quoteText:
        "We estimate the global cybersecurity market at approximately $215 billion in 2026, up from $195 billion in 2025, representing roughly 10 percent year over year growth.",
      pageReference: "p.1, Market Sizing",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-8-2",
      documentId: "doc-8",
      quoteText:
        "AI powered threats and the emergence of adversarial AI are also driving investment in advanced detection and response capabilities.",
      pageReference: "p.1, Growth Drivers",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-8-3",
      documentId: "doc-8",
      quoteText:
        "We estimate cloud security spending growth at approximately 18 percent in 2026, outpacing the broader market. Identity and access management is another high growth area, with zero trust architectures becoming the standard framework.",
      pageReference: "p.2, Cloud and Identity Security",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-9": [
    {
      id: "qs-9-1",
      documentId: "doc-9",
      quoteText:
        "Our base case projects Brent in the $72 to $82 per barrel range for 2026, with risks tilted to the downside from weaker global growth and upside from supply disruptions.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-9-2",
      documentId: "doc-9",
      quoteText:
        "We estimate global oil supply growth of approximately 1.2 million barrels per day in 2026, with demand growth of 0.9 to 1.1 million barrels per day.",
      pageReference: "p.1, Supply Dynamics",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-9-3",
      documentId: "doc-9",
      quoteText:
        "Our analysis suggests that peak oil demand is approaching but that the plateau period could extend for several years.",
      pageReference: "p.2, Demand Trends and Energy Transition",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-10": [
    {
      id: "qs-10-1",
      documentId: "doc-10",
      quoteText:
        "Our base case projects one to two additional rate increases in 2026, bringing the policy rate to approximately 0.75 percent by year end.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-10-2",
      documentId: "doc-10",
      quoteText:
        "We project a gradual strengthening toward the 140 to 145 range against the dollar by year end, contingent on our rate and growth assumptions. Carry trade unwinds remain a source of episodic volatility.",
      pageReference: "p.2, Yen Dynamics and FX Implications",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-10-3",
      documentId: "doc-10",
      quoteText:
        "Japanese equities have delivered strong returns in recent years, supported by corporate governance reform, shareholder return programs, and foreign investor interest. We expect the Nikkei to remain well supported in 2026.",
      pageReference: "p.2, Equity Market and Sector Positioning",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-11": [
    {
      id: "qs-11-1",
      documentId: "doc-11",
      quoteText:
        "We estimate the global GLP-1 market could exceed $80 billion by 2028, driven by expanding indications and improved access.",
      pageReference: "p.1, GLP-1 and Obesity Therapeutics",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-11-2",
      documentId: "doc-11",
      quoteText:
        "We maintain a constructive stance on diversified pharma with strong pipelines and see selective value in mid cap biotech names approaching key catalysts.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-11-3",
      documentId: "doc-11",
      quoteText:
        "Pharma and biotech M&A activity has picked up in 2025 and 2026, driven by patent cliff exposure and the need to replenish pipelines.",
      pageReference: "p.2, M&A and Capital Deployment",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-12": [
    {
      id: "qs-12-1",
      documentId: "doc-12",
      quoteText:
        "Spot Bitcoin ETFs have attracted over $60 billion in cumulative net inflows since launch, with Ethereum ETFs adding incremental demand.",
      pageReference: "p.1, ETF Flows and Market Structure",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-12-2",
      documentId: "doc-12",
      quoteText:
        "The total stablecoin market capitalization has exceeded $200 billion, with growing use in cross border payments and settlement.",
      pageReference: "p.1, Stablecoin Legislation",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-12-3",
      documentId: "doc-12",
      quoteText:
        "Our allocation framework treats crypto as a satellite position within diversified portfolios, with position sizing reflecting the higher volatility and uncertainty.",
      pageReference: "p.2, Outlook and Investment Implications",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-13": [
    {
      id: "qs-13-1",
      documentId: "doc-13",
      quoteText:
        "Quantum computing is transitioning from a research curiosity to an early stage commercial technology, with hardware milestones accelerating and enterprise experimentation broadening.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-13-2",
      documentId: "doc-13",
      quoteText:
        "Financial services firms are exploring quantum computing for portfolio optimization, risk simulation, and fraud detection.",
      pageReference: "p.2, Enterprise Use Cases",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-13-3",
      documentId: "doc-13",
      quoteText:
        "Our timeline assumes initial commercial impact in select use cases by 2028 to 2030, with broader adoption following as hardware scales.",
      pageReference: "p.2, Enterprise Use Cases",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-14": [
    {
      id: "qs-14-1",
      documentId: "doc-14",
      quoteText:
        "Delinquency rates have risen to approximately 2.8 percent for 30 plus day delinquencies, modestly above pre pandemic norms.",
      pageReference: "p.1, Credit Card Trends",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-14-2",
      documentId: "doc-14",
      quoteText:
        "Delinquencies in the subprime auto segment have risen to levels that exceed 2019 readings, reflecting the cumulative impact of higher rates and affordability pressure.",
      pageReference: "p.1, Auto Lending",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-14-3",
      documentId: "doc-14",
      quoteText:
        "Our economists project unemployment remaining in the 4.0 to 4.4 percent range through 2026, consistent with a soft landing scenario.",
      pageReference: "p.2, Labor Market and Outlook",
      approved: null,
      bankerComment: "",
    },
  ],
  "doc-15": [
    {
      id: "qs-15-1",
      documentId: "doc-15",
      quoteText:
        "We estimate that approximately 35 percent of total authorized IIJA funding has been obligated through early 2026, with disbursement rates improving as projects move from planning to execution.",
      pageReference: "p.1, Federal Spending Implementation",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-15-2",
      documentId: "doc-15",
      quoteText:
        "We estimate that over $250 billion in manufacturing construction has been announced since 2022, with a significant share tied to federal incentives.",
      pageReference: "p.2, Reshoring and Manufacturing",
      approved: null,
      bankerComment: "",
    },
    {
      id: "qs-15-3",
      documentId: "doc-15",
      quoteText:
        "The spending ramp is still in early stages, with significant project backlogs and growing order books supporting a multiyear growth cycle for key sectors.",
      pageReference: "p.1, Executive Summary",
      approved: null,
      bankerComment: "",
    },
  ],
};

// ============================================================
// COMMENT THREADS (pre populated for Comments View)
// ============================================================
export const COMMENT_THREADS: Record<string, CommentThread[]> = {
  "vip-1": [
    {
      id: "ct-1-1",
      documentId: "doc-1",
      documentTitle: "Q1 2026 Global Semiconductor Outlook",
      quoteText:
        "Our analysis suggests that the memory cycle has entered a recovery phase, with pricing power gradually returning to producers.",
      comments: [
        {
          id: "c-1-1-1",
          author: {
            name: "Alexandra Whitfield",
            initials: "AW",
            role: "banker",
            color: "#444aff",
          },
          text: "Sarah, the memory recovery thesis here is directly relevant to your semiconductor allocation. The return of pricing power could support your overweight positioning on memory names.",
          timestamp: "2026-02-10T09:15:00Z",
        },
        {
          id: "c-1-1-2",
          author: {
            name: "Sarah Chen",
            initials: "SC",
            role: "vip",
            color: "#5ad45a",
          },
          text: "The timing is constructive. I was considering increasing memory exposure. Does the team have a view on the duration of pricing power given the AI inference demand tailwind?",
          timestamp: "2026-02-10T10:30:00Z",
        },
        {
          id: "c-1-1-3",
          author: {
            name: "Alexandra Whitfield",
            initials: "AW",
            role: "banker",
            color: "#444aff",
          },
          text: "The report models low-to-mid single-digit revenue growth for 2026, with memory outperforming. I will flag the AI demand section for your review.",
          timestamp: "2026-02-10T11:00:00Z",
        },
      ],
    },
    {
      id: "ct-1-2",
      documentId: "doc-2",
      documentTitle: "AI Infrastructure: The $500B Capex Cycle",
      quoteText:
        "We estimate aggregate capital expenditure tied to AI infrastructure will approach $500 billion over the 2025 to 2028 period.",
      comments: [
        {
          id: "c-1-2-1",
          author: {
            name: "Alexandra Whitfield",
            initials: "AW",
            role: "banker",
            color: "#444aff",
          },
          text: "The $500B capex figure is front loaded in 2025 and 2026. Worth considering how this affects your semiconductor hardware positioning.",
          timestamp: "2026-02-10T09:20:00Z",
        },
        {
          id: "c-1-2-2",
          author: {
            name: "Sarah Chen",
            initials: "SC",
            role: "vip",
            color: "#5ad45a",
          },
          text: "The front-loading dynamic is critical. If deceleration begins in 2027, we need to position now. Can we schedule a call to discuss the semiconductor hardware and power equipment angle?",
          timestamp: "2026-02-10T14:45:00Z",
        },
      ],
    },
  ],
  "vip-3": [
    {
      id: "ct-3-1",
      documentId: "doc-4",
      documentTitle: "ESG and Clean Energy: 2026 Sector Review",
      quoteText:
        "Implementation of major climate and energy legislation in the U.S. and Europe continues to drive project pipelines and grid investment.",
      comments: [
        {
          id: "c-3-1-1",
          author: {
            name: "Alexandra Whitfield",
            initials: "AW",
            role: "banker",
            color: "#444aff",
          },
          text: "Fatima, given your fund's ESG mandate, the pace of legislative implementation is critical to monitor. The grid infrastructure section has specific implications for your renewable allocation.",
          timestamp: "2026-01-19T08:00:00Z",
        },
        {
          id: "c-3-1-2",
          author: {
            name: "Fatima Al Rashid",
            initials: "FA",
            role: "vip",
            color: "#f6554f",
          },
          text: "Thank you for flagging this. The grid investment theme aligns well with our infrastructure mandate. We are also interested in the battery storage outlook as it relates to our clean energy portfolio.",
          timestamp: "2026-01-19T16:30:00Z",
        },
      ],
    },
  ],
  "vip-4": [
    {
      id: "ct-4-1",
      documentId: "doc-5",
      documentTitle: "Emerging Markets Fixed Income Outlook",
      quoteText:
        "Our base case assumes a gradual easing cycle in the U.S. and Europe with a soft landing for growth. We see selective value in hard currency high yield and in local markets with attractive real yields.",
      comments: [
        {
          id: "c-4-1-1",
          author: {
            name: "Alexandra Whitfield",
            initials: "AW",
            role: "banker",
            color: "#444aff",
          },
          text: "James, the EM easing cycle thesis aligns with your duration positioning. The LatAm and EMEA overweights in the report could complement your recent India allocation increase.",
          timestamp: "2026-02-11T07:00:00Z",
        },
        {
          id: "c-4-1-2",
          author: {
            name: "James Whitfield",
            initials: "JW",
            role: "vip",
            color: "#5ad45a",
          },
          text: "The timing is excellent. The real yield analysis validates our EM local currency overweight. What is the team's view on the hawkish-Fed risk scenario and its impact on our EM duration positioning?",
          timestamp: "2026-02-11T07:30:00Z",
        },
      ],
    },
  ],
  "vip-7": [
    {
      id: "ct-7-1",
      documentId: "doc-10",
      documentTitle: "Japan Monetary Policy and Equity Implications",
      quoteText:
        "Our base case projects one to two additional rate increases in 2026, bringing the policy rate to approximately 0.75 percent by year end.",
      comments: [
        {
          id: "c-7-1-1",
          author: {
            name: "Alexandra Whitfield",
            initials: "AW",
            role: "banker",
            color: "#444aff",
          },
          text: "Elena, the BOJ rate path and yen dynamics analysis aligns with the macro view we discussed last week. The carry trade unwind risk section warrants a closer look given your current FX positioning.",
          timestamp: "2026-02-10T08:15:00Z",
        },
        {
          id: "c-7-1-2",
          author: {
            name: "Elena Kostrova",
            initials: "EK",
            role: "vip",
            color: "#4a92ff",
          },
          text: "We are already adjusting our yen position based on the 140-145 target. The carry trade unwind is playing out as expected. What is the team's conviction level on the Nikkei downside scenario at 34,000-36,000?",
          timestamp: "2026-02-10T08:30:00Z",
        },
      ],
    },
  ],
};

// ============================================================
// SUGGESTED ACTIONS
// ============================================================
export const SUGGESTED_ACTIONS: Record<string, string[]> = {
  "vip-1": ["Share Cybersecurity Spending Outlook", "Schedule Quarterly Review Call"],
  "vip-2": [
    "Share CRE Reset -- Emphasize Data Center Angle",
    "Follow Up on Unread Oil & Gas Report",
  ],
  "vip-3": [
    "Share Oil & Gas Rebalancing -- Energy Transition Focus",
    "Schedule Re-Engagement Call",
    "Align Research Distribution to ESG and Carbon Mandate",
  ],
  "vip-4": [
    "Early-Share US Infrastructure Capex Tracker",
    "Highlight LatAm and EMEA Sections in EM Outlook",
  ],
  "vip-5": [
    "Priority: Share Japan Monetary Policy Report",
    "Include Cybersecurity Geopolitical Context in Next Distribution",
  ],
  "vip-6": [
    "Share oil and gas report for energy infrastructure angle",
    "Schedule infrastructure and CRE pipeline review",
  ],
  "vip-7": [
    "Share Healthcare & Biotech Outlook -- Sector Rotation Signals",
    "Provide 1-Page Summary: BOJ Rate Trade Implications",
  ],
  "vip-8": [
    "Share Crypto Regulation Report -- Family Office Diversification",
    "Schedule Impact Investing Discussion",
  ],
};

export const PREDEFINED_VIP_SUGGESTIONS: PredefinedVipSuggestion[] = [
  {
    name: "Alexandra Petrov",
    email: "a.petrov@northstarwealth.com",
    company: "NorthStar Wealth Management",
    role: "Chief Investment Officer",
    aum: "$7.8B",
    interests: ["Macro", "FX", "Commodities", "ESG", "Oil and gas", "Healthcare"],
    communicationNotes: "Prefers detailed PDF reports with executive summaries. Reads on desktop, usually mornings.",
    readingProfile: "Thorough reader. Averages 80% completion across all topics. Peak reading between 8am and 10am EST.",
    pastCommunications: [
      { date: "2026-02-05", type: "meeting", summary: "Discussed macro outlook and commodity positioning for Q2." },
      { date: "2026-01-20", type: "email", summary: "Requested updated FX strategy piece with focus on EUR/USD." },
    ],
    avatarColor: "#d04aff",
  },
  {
    name: "Benjamin Okafor",
    email: "b.okafor@lagoscapital.ng",
    company: "Lagos Capital Partners",
    role: "Managing Partner",
    aum: "$2.1B",
    interests: ["EM debt", "Private credit", "Africa markets", "Consumer credit", "Infrastructure"],
    communicationNotes: "Relationship driven. Prefers calls over email. Interested in frontier markets.",
    readingProfile: "Selective reader. High engagement on EM and Africa content (85%+). Other topics see 30% completion.",
    pastCommunications: [
      { date: "2026-02-03", type: "call", summary: "Discussed private credit opportunities in West Africa and India." },
      { date: "2026-01-18", type: "meeting", summary: "Quarterly review. Benjamin wants more frontier market coverage." },
    ],
    avatarColor: "#5ad45a",
  },
  {
    name: "Catherine Wu",
    email: "c.wu@pacificridge.hk",
    company: "Pacific Ridge Investments",
    role: "Head of Technology Research",
    aum: "$4.5B",
    interests: ["Semiconductors", "AI chips", "China tech", "Cybersecurity", "Quantum computing"],
    communicationNotes: "Very responsive via email. Appreciates data heavy reports with charts.",
    readingProfile: "Fast reader with high completion (88%). Opens documents within 1 hour. Focuses on tech sector content.",
    pastCommunications: [
      { date: "2026-02-07", type: "email", summary: "Asked for early access to the next semiconductor outlook report." },
      { date: "2026-01-25", type: "call", summary: "Discussed TSMC and Samsung foundry capacity updates." },
    ],
    avatarColor: "#4a92ff",
  },
  {
    name: "Daniel Eriksson",
    email: "d.eriksson@nordicpension.se",
    company: "Nordic Pension Alliance",
    role: "Head of Fixed Income",
    aum: "$15.3B",
    interests: ["Bonds", "Duration", "Rates", "ESG", "European banking", "Consumer credit"],
    communicationNotes: "Methodical and detail oriented. Prefers structured analysis with scenario modeling.",
    readingProfile: "Deep reader. 92% average completion on fixed income content. Reads between 6am and 8am CET.",
    pastCommunications: [
      { date: "2026-02-06", type: "meeting", summary: "Reviewed duration positioning strategy for 2026. Daniel favors barbell approach." },
      { date: "2026-01-22", type: "email", summary: "Requested analysis on Nordic vs US rate differential and curve dynamics." },
    ],
    avatarColor: "#ffa537",
  },
  {
    name: "Emily Richardson",
    email: "e.richardson@londonmacro.co.uk",
    company: "London Macro Advisors",
    role: "Chief Strategist",
    aum: "$3.2B",
    interests: ["Macro", "Geopolitics", "Rates", "FX", "Japan", "Oil and gas"],
    communicationNotes: "Sharp and concise. Prefers bullet point summaries. Trades on speed of information.",
    readingProfile: "Speed reader. Opens within 10 minutes. Reads key sections quickly (avg 40 seconds per page). Focused on macro content.",
    pastCommunications: [
      { date: "2026-02-08", type: "call", summary: "Discussed rate trajectory and positioning for upcoming central bank meetings." },
      { date: "2026-01-28", type: "email", summary: "Emily requested a geopolitical risk briefing on US China trade tensions." },
    ],
    avatarColor: "#f6554f",
  },
  {
    name: "Farid Hassan",
    email: "f.hassan@gulfbridge.ae",
    company: "GulfBridge Capital",
    role: "Director, Real Assets",
    aum: "$9.6B",
    interests: ["Infrastructure", "Real assets", "Clean energy", "ESG", "Commercial real estate", "Oil and gas"],
    communicationNotes: "Formal communication style. Prefers scheduled calls with agenda. Interested in sustainability themes.",
    readingProfile: "Moderate reader. 70% completion on infrastructure and ESG reports. Reads on tablet, afternoons GST.",
    pastCommunications: [
      { date: "2026-02-04", type: "meeting", summary: "Reviewed renewable energy infrastructure pipeline in MENA region." },
      { date: "2026-01-15", type: "email", summary: "Requested carbon credit pricing data for GCC markets." },
    ],
    avatarColor: "#5ad45a",
  },
  {
    name: "Grace Tanaka",
    email: "g.tanaka@tokyoasset.jp",
    company: "Tokyo Asset Management",
    role: "Portfolio Manager, Global Equities",
    aum: "$5.7B",
    interests: ["AI chips", "Semiconductors", "Japan", "BOJ", "Cybersecurity"],
    communicationNotes: "Prefers bilingual summaries (English/Japanese). Detail oriented with focus on regional context.",
    readingProfile: "Consistent reader. 75% completion average. Reads in the evening JST. Strong focus on APAC semiconductor content.",
    pastCommunications: [
      { date: "2026-02-09", type: "call", summary: "Discussed Japan semiconductor ecosystem and BOJ policy impact on equity valuations." },
      { date: "2026-01-30", type: "meeting", summary: "Quarterly review. Grace wants more Japan monetary policy and tech supply chain analysis." },
    ],
    avatarColor: "#d04aff",
  },
  {
    name: "Henrik Johansson",
    email: "h.johansson@scandifund.fi",
    company: "Scandi Fund Management",
    role: "Head of Sustainable Investing",
    aum: "$8.4B",
    interests: ["ESG", "Green bonds", "Clean energy", "Oil and gas", "Healthcare", "Crypto"],
    communicationNotes: "Values transparency and data integrity. Prefers reports with methodology sections.",
    readingProfile: "Deep ESG reader. 95% completion on sustainability content. Other topics 40%. Reads mornings EET.",
    pastCommunications: [
      { date: "2026-02-07", type: "meeting", summary: "Discussed EU Green Bond Standard compliance and portfolio alignment." },
      { date: "2026-01-21", type: "email", summary: "Henrik asked for oil and gas energy transition analysis with Nordic relevance." },
    ],
    avatarColor: "#4a92ff",
  },
];

// ============================================================
// DOCUMENT ALERTS (version update notifications)
// ============================================================
export const DOCUMENT_ALERTS: {
  documentId: string;
  message: string;
  previousVersion: string;
  affectedVipIds: string[];
}[] = [
  {
    documentId: "doc-1",
    message: "A new version updated with Q1 2026 report data is now available. These VIPs read the previous Q4 version.",
    previousVersion: "v1",
    affectedVipIds: ["vip-1", "vip-4", "vip-5"],
  },
];

// ============================================================
// RECOMMENDATION GENERATOR (for newly added VIPs)
// ============================================================
const AI_EXPLANATION_TEMPLATES = [
  "Based on {name}'s focus on {interest}, this report on {topic} provides directly relevant analysis. The {docTitle} covers key themes that align with their investment mandate.",
  "{name}'s interest in {interest} makes this a strong match. The {docTitle} report explores {topic} dynamics that connect to their portfolio strategy.",
  "This report is highly relevant for {name} given their {interest} focus. The analysis in {docTitle} covers {topic} themes they are actively tracking.",
];

export function generateRecommendationsForVip(vip: VIP): Recommendation[] {
  const scored: { doc: Document; score: number; matchedInterests: string[]; matchedTopics: string[] }[] = [];

  for (const doc of DOCUMENTS) {
    const matchedInterests: string[] = [];
    const matchedTopics: string[] = [];

    for (const interest of vip.interests) {
      for (const topic of doc.topics) {
        if (
          interest.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(interest.toLowerCase())
        ) {
          if (!matchedInterests.includes(interest)) matchedInterests.push(interest);
          if (!matchedTopics.includes(topic)) matchedTopics.push(topic);
        }
      }
    }

    if (matchedInterests.length > 0) {
      const score = Math.min(98, 50 + matchedInterests.length * 15 + matchedTopics.length * 5);
      scored.push({ doc, score, matchedInterests, matchedTopics });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  const topDocs = scored.slice(0, 3);

  return topDocs.map((item, idx) => {
    const template = AI_EXPLANATION_TEMPLATES[idx % AI_EXPLANATION_TEMPLATES.length];
    const explanation = template
      .replace("{name}", vip.name.split(" ")[0])
      .replace("{interest}", item.matchedInterests.join(" and "))
      .replace("{topic}", item.matchedTopics.join(", "))
      .replace("{docTitle}", item.doc.title);

    return {
      id: `rec-new-${vip.id}-${idx + 1}`,
      documentId: item.doc.id,
      documentTitle: item.doc.title,
      relevanceScore: item.score,
      aiExplanation: explanation,
      dismissed: false,
      shared: false,
    };
  });
}

// ============================================================
// WALKTHROUGH STEPS (guided document walkthrough per document)
// Each step uses highlightText to find and highlight real text
// in the PDF's rendered text layer for precise targeting.
// ============================================================
export const WALKTHROUGH_TEMPLATES: Record<string, WalkthroughStepTemplate[]> = {
  "doc-1": [
    {
      id: "wt-1-1", documentId: "doc-1", pageNumber: 2,
      title: "Executive Summary",
      messageTemplate: "Given your focus on {interest}, this executive overview highlights the selective overweight on memory and advanced logic exposed to data center and edge AI.",
      relevantTopics: ["Semiconductors", "AI chips"],
      highlightText: QUOTE_SUGGESTIONS["doc-1"][0].quoteText,
      highlightArea: { top: 8, left: 8, width: 86, height: 12 },
    },
    {
      id: "wt-1-2", documentId: "doc-1", pageNumber: 2,
      title: "Memory Cycle Recovery",
      messageTemplate: "Given your positioning in {interest}, note the memory cycle recovery phase with pricing power gradually returning to producers.",
      relevantTopics: ["AI chips", "Semiconductors"],
      highlightText: QUOTE_SUGGESTIONS["doc-1"][1].quoteText,
      highlightArea: { top: 33, left: 8, width: 86, height: 14 },
    },
    {
      id: "wt-1-3", documentId: "doc-1", pageNumber: 3,
      title: "Key Risks to Watch",
      messageTemplate: "Based on your portfolio exposure, these risk factors around {interest} slowdown and export controls could directly affect your positions.",
      relevantTopics: ["Semiconductors", "Export controls"],
      highlightText: QUOTE_SUGGESTIONS["doc-1"][2].quoteText,
      highlightArea: { top: 72, left: 8, width: 86, height: 14 },
    },
  ],
  "doc-2": [
    {
      id: "wt-2-1", documentId: "doc-2", pageNumber: 1,
      title: "The $500B Capex Estimate",
      messageTemplate: "Given your focus on {interest}, this headline projection of $500 billion in AI infrastructure spending over 2025 to 2028 sets the investment framework.",
      relevantTopics: ["Cloud infrastructure", "Capex"],
      highlightText: QUOTE_SUGGESTIONS["doc-2"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-2-2", documentId: "doc-2", pageNumber: 1,
      title: "GPU and Accelerator Content Growth",
      messageTemplate: "Given your positioning in {interest}, this section on GPUs and custom accelerators capturing the largest share of incremental spend is directly relevant.",
      relevantTopics: ["AI chips", "Cloud infrastructure"],
      highlightText: QUOTE_SUGGESTIONS["doc-2"][1].quoteText,
      highlightArea: { top: 35, left: 10, width: 85, height: 14 },
    },
    {
      id: "wt-2-3", documentId: "doc-2", pageNumber: 2,
      title: "Data Center Power and Cooling",
      messageTemplate: "Given your focus on {interest}, the grid connectivity and cooling technology analysis highlights critical infrastructure bottlenecks.",
      relevantTopics: ["Data centers", "Cloud infrastructure"],
      highlightText: QUOTE_SUGGESTIONS["doc-2"][2].quoteText,
      highlightArea: { top: 18, left: 10, width: 85, height: 22 },
    },
  ],
  "doc-3": [
    {
      id: "wt-3-1", documentId: "doc-3", pageNumber: 1,
      title: "Export Controls Overview",
      messageTemplate: "Given your focus on {interest}, this urgent assessment of US export controls on advanced semiconductors requires immediate attention.",
      relevantTopics: ["Geopolitics", "Export controls"],
      highlightText: QUOTE_SUGGESTIONS["doc-3"][0].quoteText,
      highlightArea: { top: 8, left: 10, width: 85, height: 20 },
    },
    {
      id: "wt-3-2", documentId: "doc-3", pageNumber: 1,
      title: "Revenue Impact by Sector",
      messageTemplate: "Building on {context}, this breakdown of revenue exposure for equipment and fabless vendors shows the direct financial impact.",
      relevantTopics: ["Semiconductors", "Export controls"],
      highlightText: QUOTE_SUGGESTIONS["doc-3"][1].quoteText,
      highlightArea: { top: 38, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-3-3", documentId: "doc-3", pageNumber: 2,
      title: "Supply Chain Ripple Effects",
      messageTemplate: "Given your focus on {interest}, the analysis of allied countries potentially adopting similar controls could broaden the impact over time.",
      relevantTopics: ["China tech", "Geopolitics"],
      highlightText: QUOTE_SUGGESTIONS["doc-3"][2].quoteText,
      highlightArea: { top: 22, left: 10, width: 85, height: 18 },
    },
  ],
  "doc-4": [
    {
      id: "wt-4-1", documentId: "doc-4", pageNumber: 1,
      title: "Climate Legislation Implementation",
      messageTemplate: "Given your focus on {interest}, the pace of climate legislation implementation in the US and Europe is driving project pipelines at an accelerating rate.",
      relevantTopics: ["ESG", "Clean energy"],
      highlightText: QUOTE_SUGGESTIONS["doc-4"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-4-2", documentId: "doc-4", pageNumber: 1,
      title: "Battery Storage Outlook",
      messageTemplate: "Given your positioning in {interest}, storage is becoming critical for grid stability. This section reviews the outlook for batteries and alternative storage technologies.",
      relevantTopics: ["Clean energy", "ESG"],
      highlightText: QUOTE_SUGGESTIONS["doc-4"][1].quoteText,
      highlightArea: { top: 35, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-4-3", documentId: "doc-4", pageNumber: 2,
      title: "Grid Infrastructure Spending",
      messageTemplate: "Given your focus on {interest}, grid investment is a major theme with aging infrastructure and renewable integration driving significant capital expenditure.",
      relevantTopics: ["Green bonds", "ESG"],
      highlightText: QUOTE_SUGGESTIONS["doc-4"][2].quoteText,
      highlightArea: { top: 15, left: 10, width: 85, height: 20 },
    },
  ],
  "doc-5": [
    {
      id: "wt-5-1", documentId: "doc-5", pageNumber: 1,
      title: "EM Easing Cycle Thesis",
      messageTemplate: "Given your focus on {interest}, the base case of gradual easing in the US and Europe with selective value in hard currency high yield sets the macro backdrop.",
      relevantTopics: ["EM debt", "Bonds"],
      highlightText: QUOTE_SUGGESTIONS["doc-5"][0].quoteText,
      highlightArea: { top: 12, left: 10, width: 85, height: 20 },
    },
    {
      id: "wt-5-2", documentId: "doc-5", pageNumber: 2,
      title: "Country and Segment Overweights",
      messageTemplate: "Building on {context}, these overweight positions in Latin America and EMEA complement your broader fixed income view.",
      relevantTopics: ["Bonds", "EM debt"],
      highlightText: QUOTE_SUGGESTIONS["doc-5"][1].quoteText,
      highlightArea: { top: 8, left: 10, width: 85, height: 22 },
    },
    {
      id: "wt-5-3", documentId: "doc-5", pageNumber: 2,
      title: "Key Risk Scenarios",
      messageTemplate: "Given your {interest} focus, the risk analysis around a hawkish Fed and sovereign stress in high yield names deserves careful review.",
      relevantTopics: ["Bonds", "Fixed income"],
      highlightText: QUOTE_SUGGESTIONS["doc-5"][2].quoteText,
      highlightArea: { top: 45, left: 10, width: 85, height: 18 },
    },
  ],
  "doc-6": [
    {
      id: "wt-6-1", documentId: "doc-6", pageNumber: 1,
      title: "CET1 Capital Adequacy",
      messageTemplate: "Given your focus on {interest}, the stress test results show most large banks maintain CET1 ratios above requirements, but dispersion across institutions is meaningful.",
      relevantTopics: ["European banking", "Bonds"],
      highlightText: QUOTE_SUGGESTIONS["doc-6"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 20 },
    },
    {
      id: "wt-6-2", documentId: "doc-6", pageNumber: 2,
      title: "NII Plateau and Fee Income",
      messageTemplate: "Given your positioning in {interest} and banking profitability, NII is expected to plateau in 2026 as rate cuts take effect. Fee income and cost management become key differentiators.",
      relevantTopics: ["Rates", "European banking"],
      highlightText: QUOTE_SUGGESTIONS["doc-6"][1].quoteText,
      highlightArea: { top: 20, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-6-3", documentId: "doc-6", pageNumber: 3,
      title: "Top Bank Picks",
      messageTemplate: "Given your focus on {interest}, the report favors banks with strong CET1 generation and diversified revenue, concentrated in northern European markets.",
      relevantTopics: ["Credit quality", "European banking"],
      highlightText: QUOTE_SUGGESTIONS["doc-6"][2].quoteText,
      highlightArea: { top: 28, left: 10, width: 85, height: 20 },
    },
  ],
  "doc-7": [
    {
      id: "wt-7-1", documentId: "doc-7", pageNumber: 1,
      title: "Office Cap Rate Expansion",
      messageTemplate: "Given your focus on {interest}, US office cap rates have expanded 120 to 180 basis points from cycle lows with further adjustment likely.",
      relevantTopics: ["Real estate", "Commercial real estate"],
      highlightText: QUOTE_SUGGESTIONS["doc-7"][0].quoteText,
      highlightArea: { top: 8, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-7-2", documentId: "doc-7", pageNumber: 1,
      title: "Remote Work Impact",
      messageTemplate: "Given your positioning in {interest}, hybrid work patterns have structurally reduced net absorption in CBDs with limited near term recovery expected.",
      relevantTopics: ["Commercial real estate", "Real estate"],
      highlightText: QUOTE_SUGGESTIONS["doc-7"][1].quoteText,
      highlightArea: { top: 35, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-7-3", documentId: "doc-7", pageNumber: 3,
      title: "Stabilization Timeline",
      messageTemplate: "Building on {context}, data center, logistics, and multifamily segments show resilience within the broader CRE repricing cycle.",
      relevantTopics: ["Real estate", "Commercial real estate"],
      highlightText: QUOTE_SUGGESTIONS["doc-7"][2].quoteText,
      highlightArea: { top: 22, left: 10, width: 85, height: 22 },
    },
  ],
  "doc-8": [
    {
      id: "wt-8-1", documentId: "doc-8", pageNumber: 1,
      title: "$215B Market Sizing",
      messageTemplate: "Given your focus on {interest}, the global market is estimated at approximately $215 billion in 2026 with 10% year over year growth.",
      relevantTopics: ["Cybersecurity", "Cloud infrastructure"],
      highlightText: QUOTE_SUGGESTIONS["doc-8"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-8-2", documentId: "doc-8", pageNumber: 1,
      title: "AI Powered Threat Landscape",
      messageTemplate: "Given your positioning in {interest}, adversarial AI and AI powered threats are driving investment in advanced detection and response capabilities.",
      relevantTopics: ["AI chips", "Cybersecurity"],
      highlightText: QUOTE_SUGGESTIONS["doc-8"][1].quoteText,
      highlightArea: { top: 35, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-8-3", documentId: "doc-8", pageNumber: 2,
      title: "Cloud Security Growth at 18%",
      messageTemplate: "Given your focus on {interest}, cloud security spending growth at 18% outpaces the broader market with zero trust becoming the standard framework.",
      relevantTopics: ["Cloud infrastructure", "Cybersecurity"],
      highlightText: QUOTE_SUGGESTIONS["doc-8"][2].quoteText,
      highlightArea: { top: 15, left: 10, width: 85, height: 20 },
    },
  ],
  "doc-9": [
    {
      id: "wt-9-1", documentId: "doc-9", pageNumber: 1,
      title: "Brent Price Projection",
      messageTemplate: "Given your focus on {interest}, the base case projects Brent in the $72 to $82 range for 2026 with downside risk from weaker growth.",
      relevantTopics: ["Oil and gas", "Commodities"],
      highlightText: QUOTE_SUGGESTIONS["doc-9"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-9-2", documentId: "doc-9", pageNumber: 1,
      title: "Supply vs Demand Balance",
      messageTemplate: "Given your positioning in {interest}, global oil supply growth of approximately 1.2 million barrels per day versus demand growth creates a slight surplus.",
      relevantTopics: ["Commodities", "Oil and gas"],
      highlightText: QUOTE_SUGGESTIONS["doc-9"][1].quoteText,
      highlightArea: { top: 38, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-9-3", documentId: "doc-9", pageNumber: 2,
      title: "Peak Oil Demand Approaching",
      messageTemplate: "Given your focus on {interest}, peak oil demand is approaching but the plateau period could extend for several years.",
      relevantTopics: ["Energy transition", "Oil and gas"],
      highlightText: QUOTE_SUGGESTIONS["doc-9"][2].quoteText,
      highlightArea: { top: 20, left: 10, width: 85, height: 20 },
    },
  ],
  "doc-10": [
    {
      id: "wt-10-1", documentId: "doc-10", pageNumber: 1,
      title: "BOJ Rate Path",
      messageTemplate: "Given your focus on {interest} and rates, the base case projects one to two additional rate increases bringing the policy rate to approximately 0.75% by year end.",
      relevantTopics: ["Japan", "Rates"],
      highlightText: QUOTE_SUGGESTIONS["doc-10"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-10-2", documentId: "doc-10", pageNumber: 2,
      title: "Yen Strengthening to 140 to 145",
      messageTemplate: "Given your positioning in {interest} markets, the yen is projected to strengthen toward 140 to 145 against the dollar. Carry trade unwinds remain a source of episodic volatility.",
      relevantTopics: ["FX", "Japan"],
      highlightText: QUOTE_SUGGESTIONS["doc-10"][1].quoteText,
      highlightArea: { top: 15, left: 10, width: 85, height: 20 },
    },
    {
      id: "wt-10-3", documentId: "doc-10", pageNumber: 2,
      title: "Nikkei Equity Positioning",
      messageTemplate: "Given your focus on {interest}, corporate governance reform and shareholder return programs continue to support the Nikkei in 2026.",
      relevantTopics: ["Japanese equities", "Japan"],
      highlightText: QUOTE_SUGGESTIONS["doc-10"][2].quoteText,
      highlightArea: { top: 48, left: 10, width: 85, height: 18 },
    },
  ],
  "doc-11": [
    {
      id: "wt-11-1", documentId: "doc-11", pageNumber: 1,
      title: "GLP 1 Market Exceeding $80B",
      messageTemplate: "Given your focus on {interest}, the global GLP 1 market could exceed $80 billion by 2028 driven by expanding indications and improved access.",
      relevantTopics: ["Healthcare", "Biotech"],
      highlightText: QUOTE_SUGGESTIONS["doc-11"][0].quoteText,
      highlightArea: { top: 12, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-11-2", documentId: "doc-11", pageNumber: 1,
      title: "Pharma Pipeline Outlook",
      messageTemplate: "Given your positioning in {interest}, the report maintains a constructive stance on diversified pharma with strong pipelines and sees selective value in mid cap names.",
      relevantTopics: ["Biotech", "Healthcare"],
      highlightText: QUOTE_SUGGESTIONS["doc-11"][1].quoteText,
      highlightArea: { top: 38, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-11-3", documentId: "doc-11", pageNumber: 2,
      title: "M&A Acceleration",
      messageTemplate: "Given your focus on {interest}, activity has picked up driven by patent cliff exposure and the need to replenish pipelines.",
      relevantTopics: ["Pharma M&A", "Healthcare"],
      highlightText: QUOTE_SUGGESTIONS["doc-11"][2].quoteText,
      highlightArea: { top: 20, left: 10, width: 85, height: 20 },
    },
  ],
  "doc-12": [
    {
      id: "wt-12-1", documentId: "doc-12", pageNumber: 1,
      title: "Bitcoin ETF Inflows at $60B+",
      messageTemplate: "Given your focus on {interest}, spot Bitcoin ETFs have attracted over $60 billion in cumulative net inflows since launch.",
      relevantTopics: ["Crypto", "Digital assets"],
      highlightText: QUOTE_SUGGESTIONS["doc-12"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-12-2", documentId: "doc-12", pageNumber: 1,
      title: "Stablecoin Market at $200B",
      messageTemplate: "Given your positioning in {interest}, the stablecoin market has exceeded $200 billion with growing use in cross border payments.",
      relevantTopics: ["Digital assets", "Crypto"],
      highlightText: QUOTE_SUGGESTIONS["doc-12"][1].quoteText,
      highlightArea: { top: 38, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-12-3", documentId: "doc-12", pageNumber: 2,
      title: "Institutional Allocation Framework",
      messageTemplate: "Given your review of {context}, the crypto allocation framework treats it as a satellite position with sizing reflecting higher volatility.",
      relevantTopics: ["Portfolio diversification", "Crypto"],
      highlightText: QUOTE_SUGGESTIONS["doc-12"][2].quoteText,
      highlightArea: { top: 22, left: 10, width: 85, height: 22 },
    },
  ],
  "doc-13": [
    {
      id: "wt-13-1", documentId: "doc-13", pageNumber: 1,
      title: "Quantum Commercialization Timeline",
      messageTemplate: "Given your focus on {interest}, quantum computing is transitioning from research to early stage commercial technology with hardware milestones accelerating.",
      relevantTopics: ["Emerging tech", "Quantum computing"],
      highlightText: QUOTE_SUGGESTIONS["doc-13"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 20 },
    },
    {
      id: "wt-13-2", documentId: "doc-13", pageNumber: 2,
      title: "Financial Services Use Cases",
      messageTemplate: "Given your work in {interest}, financial services firms are exploring quantum for portfolio optimization, risk simulation, and fraud detection.",
      relevantTopics: ["Investment management", "Quantum computing"],
      highlightText: QUOTE_SUGGESTIONS["doc-13"][1].quoteText,
      highlightArea: { top: 15, left: 10, width: 85, height: 22 },
    },
    {
      id: "wt-13-3", documentId: "doc-13", pageNumber: 2,
      title: "2028 to 2030 Impact Horizon",
      messageTemplate: "Given your {interest} investment horizon, initial commercial impact is expected in select use cases by 2028 to 2030 with broader adoption following.",
      relevantTopics: ["Technology investment", "Emerging tech"],
      highlightText: QUOTE_SUGGESTIONS["doc-13"][2].quoteText,
      highlightArea: { top: 50, left: 10, width: 85, height: 18 },
    },
  ],
  "doc-14": [
    {
      id: "wt-14-1", documentId: "doc-14", pageNumber: 1,
      title: "Credit Card Delinquency at 2.8%",
      messageTemplate: "Given your focus on {interest}, 30+ day delinquency rates have risen to approximately 2.8%, modestly above pre pandemic norms.",
      relevantTopics: ["Consumer credit", "Macro"],
      highlightText: QUOTE_SUGGESTIONS["doc-14"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-14-2", documentId: "doc-14", pageNumber: 1,
      title: "Subprime Auto Stress",
      messageTemplate: "Given your positioning in {interest}, subprime auto delinquencies have exceeded 2019 readings reflecting the impact of higher rates and affordability pressure.",
      relevantTopics: ["Auto lending", "Consumer credit"],
      highlightText: QUOTE_SUGGESTIONS["doc-14"][1].quoteText,
      highlightArea: { top: 38, left: 10, width: 85, height: 16 },
    },
    {
      id: "wt-14-3", documentId: "doc-14", pageNumber: 2,
      title: "Labor Market Soft Landing",
      messageTemplate: "Given your focus on {interest}, the soft landing projection with unemployment at 4.0 to 4.4% provides context for your credit positioning.",
      relevantTopics: ["Macro outlook", "Consumer credit"],
      highlightText: QUOTE_SUGGESTIONS["doc-14"][2].quoteText,
      highlightArea: { top: 22, left: 10, width: 85, height: 20 },
    },
  ],
  "doc-15": [
    {
      id: "wt-15-1", documentId: "doc-15", pageNumber: 1,
      title: "IIJA Implementation at 35%",
      messageTemplate: "Given your focus on {interest}, approximately 35% of total authorized IIJA funding has been obligated with disbursement rates improving.",
      relevantTopics: ["US infrastructure", "Infrastructure"],
      highlightText: QUOTE_SUGGESTIONS["doc-15"][0].quoteText,
      highlightArea: { top: 10, left: 10, width: 85, height: 18 },
    },
    {
      id: "wt-15-2", documentId: "doc-15", pageNumber: 1,
      title: "Multiyear Growth Cycle",
      messageTemplate: "Given your positioning in {interest}, the spending ramp is still in early stages with significant backlogs supporting a multiyear growth cycle.",
      relevantTopics: ["Construction", "Industrials"],
      highlightText: QUOTE_SUGGESTIONS["doc-15"][1].quoteText,
      highlightArea: { top: 38, left: 10, width: 85, height: 20 },
    },
    {
      id: "wt-15-3", documentId: "doc-15", pageNumber: 2,
      title: "$250B+ Manufacturing Construction",
      messageTemplate: "Given your focus on {interest}, over $250 billion in manufacturing construction has been announced since 2022 with a significant share tied to federal incentives.",
      relevantTopics: ["Reshoring", "US infrastructure"],
      highlightText: QUOTE_SUGGESTIONS["doc-15"][2].quoteText,
      highlightArea: { top: 15, left: 10, width: 85, height: 22 },
    },
  ],
};

/**
 * Generates personalized walkthrough steps for a specific VIP and document.
 * Matches VIP interests to step topics and injects context into templates.
 */
export function personalizeWalkthroughSteps(docId: string, vipId: string | null): WalkthroughStep[] {
  const templates = WALKTHROUGH_TEMPLATES[docId] || [];
  const vip = VIPS.find((v) => v.id === vipId) || null;

  const context = (() => {
    if (!vip) return "related coverage";
    const otherDocs = DOCUMENTS.filter((d) => d.id !== docId);

    let bestTitle = "related coverage";
    let bestScore = 0;

    for (const d of otherDocs) {
      const score = d.topics.reduce((sum, topic) => {
        const topicLc = topic.toLowerCase();
        const matches = vip.interests.some((interest) => {
          const interestLc = interest.toLowerCase();
          return (
            topicLc.includes(interestLc) || interestLc.includes(topicLc)
          );
        });
        return sum + (matches ? 1 : 0);
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestTitle = d.title;
      }
    }

    return bestTitle;
  })();

  return templates.map((template) => {
    let message = template.messageTemplate;

    // 1. Find best matching interest
    let matchingInterest = "";
    if (vip) {
      // Find the first interest that matches any of the relevant topics
      matchingInterest =
        vip.interests.find((interest) =>
          template.relevantTopics.some(
            (topic) =>
              topic.toLowerCase().includes(interest.toLowerCase()) ||
              interest.toLowerCase().includes(topic.toLowerCase())
          )
        ) ||
        vip.interests[0] ||
        "your investment focus";
    } else {
      matchingInterest = template.relevantTopics[0] || "this sector";
    }

    // 3. Replace placeholders
    message = message
      .replace(/{interest}/g, matchingInterest)
      .replace(/{context}/g, context);

    return {
      id: template.id,
      documentId: template.documentId,
      pageNumber: template.pageNumber,
      title: template.title,
      message: message,
      highlightText: template.highlightText,
      highlightPadding: template.highlightPadding,
      highlightArea: template.highlightArea,
    };
  });
}
