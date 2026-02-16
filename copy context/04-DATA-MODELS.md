# Data Models (TypeScript Interfaces)

All types are defined in `src/lib/types.ts`.

## Core Types

### VIP
```typescript
export interface VIP {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  aum: string;                    // Assets Under Management (e.g., "$2.4B")
  interests: string[];            // e.g., ["Semiconductors", "AI chips", "TSMC"]
  communicationNotes: string;     // Free-text notes about communication preferences
  docsShared: number;             // Total documents shared with this VIP
  avgCompletion: number;          // Average read completion (0-100)
  lastActive: string;             // Date string (e.g., "2026-01-15")
  lastMeeting: string;            // Date string
  readingProfile: string;         // Description of reading habits
  pastCommunications: {
    date: string;
    type: "call" | "email" | "meeting";
    summary: string;
  }[];
  avatar: {
    initials: string;             // e.g., "AR"
    color: string;                // Hex color (e.g., "#6e84ff")
  };
}
```

### Document
```typescript
export interface Document {
  id: string;
  title: string;
  version?: string;               // e.g., "v2"
  topics: string[];               // e.g., ["Semiconductors", "AI chips", "TSMC"]
  date: string;                   // Publication date
  factifyUrl: string;             // URL to Factify hosted version
  pdfPath: string;                // Local path in /public/pdfs/
}
```

### TimelineEntry
```typescript
export type ActionType = "shared" | "opened" | "read" | "not_opened";

export interface TimelineEntry {
  id: string;
  date: string;
  documentId: string;
  documentTitle: string;
  actionType: ActionType;
  completionPercent: number;      // 0-100
}
```

### Recommendation
```typescript
export interface Recommendation {
  id: string;
  documentId: string;
  documentTitle: string;
  relevanceScore: number;         // 0-100
  aiExplanation: string;          // Why this doc matches this VIP
  dismissed: boolean;
  shared: boolean;
}
```

### QuoteSuggestion
```typescript
export interface QuoteSuggestion {
  id: string;
  documentId: string;
  quoteText: string;              // Extracted passage from the PDF
  pageReference: string;          // e.g., "p. 3"
  approved: boolean | null;       // null = not yet decided
  bankerComment: string;          // Banker's annotation for this quote
}
```

### Comment & CommentThread
```typescript
export interface Comment {
  id: string;
  author: {
    name: string;
    initials: string;
    role: "banker" | "vip";
    color: string;                // Avatar color
  };
  text: string;
  timestamp: string;
}

export interface CommentThread {
  id: string;
  documentId: string;
  documentTitle: string;
  quoteText: string;              // The quoted passage this thread is about
  pageReference?: string;
  pageNumber?: number;            // For inline annotations in viewer
  highlightArea?: HighlightArea;  // Position on PDF page
  comments: Comment[];            // Ordered list of comments in thread
}
```

### HighlightArea
```typescript
/** Coordinates as percentages of the page (0 to 100) */
export interface HighlightArea {
  top: number;
  left: number;
  width: number;
  height: number;
}
```

### AiInsight
```typescript
export interface AiInsight {
  type: "positive" | "negative";
  title: string;
  body: string;
}
```

### WalkthroughStep & Template
```typescript
export interface WalkthroughStep {
  id: string;
  documentId: string;
  pageNumber: number;
  title: string;
  message: string;                // Personalized message for the VIP
  highlightArea: HighlightArea;   // Area to highlight on the PDF page
}

export interface WalkthroughStepTemplate {
  id: string;
  documentId: string;
  pageNumber: number;
  title: string;
  messageTemplate: string;        // Template with {interest}, {context}, {name}
  relevantTopics: string[];       // For matching against VIP interests
  highlightArea: HighlightArea;
}
```

### PredefinedVipSuggestion (for Add VIP autocomplete)
```typescript
export interface PredefinedVipSuggestion {
  name: string;
  email: string;
  company: string;
  role: string;
  aum: string;
  interests: string[];
  communicationNotes: string;
  readingProfile: string;
  pastCommunications: {
    date: string;
    type: "call" | "email" | "meeting";
    summary: string;
  }[];
  avatarColor: string;
}
```

## Viewer-Specific Types

Defined in `src/components/viewer/types.ts`:

```typescript
export interface FactifyViewerProps {
  documentUrl: string;            // URL/path to the PDF
  documentTitle: string;
  onClose?: () => void;
  vipName?: string;               // For personalized experience
  vipInterests?: string[];        // For walkthrough personalization
  walkthroughSteps?: WalkthroughStep[];
  commentThreads?: ViewerCommentThread[];
  parityMode?: boolean;           // Factify-style header mode
}

export interface ViewerCommentThread {
  id: string;
  quoteText: string;
  pageNumber: number;
  highlightArea: HighlightArea;
  comments: {
    author: string;
    role: "banker" | "vip";
    text: string;
    timestamp: string;
  }[];
}
```

## Toast Type (in vip-context.tsx)

```typescript
interface Toast {
  id: string;
  type: "success" | "info" | "warning" | "danger";
  message: string;
}
```
