export type ActionType = "shared" | "opened" | "read" | "not_opened";

export interface VIP {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  aum: string;
  interests: string[];
  communicationNotes: string;
  docsShared: number;
  avgCompletion: number;
  lastActive: string;
  lastMeeting: string;
  readingProfile: string;
  pastCommunications: {
    date: string;
    type: "call" | "email" | "meeting";
    summary: string;
  }[];
  avatar: {
    initials: string;
    color: string;
  };
}

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

export interface Document {
  id: string;
  title: string;
  version?: string;
  topics: string[];
  date: string;
  factifyUrl: string;
  /** Local PDF path served from /public/pdfs/ */
  pdfPath: string;
}

export interface TimelineEntry {
  id: string;
  date: string;
  documentId: string;
  documentTitle: string;
  actionType: ActionType;
  completionPercent: number;
}

export interface Recommendation {
  id: string;
  documentId: string;
  documentTitle: string;
  relevanceScore: number;
  aiExplanation: string;
  dismissed: boolean;
  shared: boolean;
}

export interface QuoteSuggestion {
  id: string;
  documentId: string;
  quoteText: string;
  pageReference: string;
  approved: boolean | null;
  bankerComment: string;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    initials: string;
    role: "banker" | "vip";
    color: string;
  };
  text: string;
  timestamp: string;
}

export interface CommentThread {
  id: string;
  documentId: string;
  documentTitle: string;
  quoteText: string;
  pageReference?: string;
  /** Optional page number for inline annotations in the viewer */
  pageNumber?: number;
  /** Optional highlight area for inline annotations in the viewer */
  highlightArea?: HighlightArea;
  comments: Comment[];
}

export interface AiInsight {
  type: "positive" | "negative";
  title: string;
  body: string;
}

/** Coordinates as percentages of the page (0 to 100) */
export interface HighlightArea {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Optional padding (in page %) applied around a computed highlight. */
export interface HighlightPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface WalkthroughStep {
  id: string;
  documentId: string;
  pageNumber: number;
  title: string;
  message: string;
  /**
   * Text anchor used to locate the precise region in the PDF text layer.
   * If provided, the viewer will prefer this over static coordinates.
   */
  highlightText?: string;
  /** Optional padding (in page %) to broaden the highlight region. */
  highlightPadding?: HighlightPadding;
  /** Coordinates for the highlight overlay (percentages of the page) */
  highlightArea: HighlightArea;
}

export interface WalkthroughStepTemplate {
  id: string;
  documentId: string;
  pageNumber: number;
  title: string;
  /** Template message with placeholders like {interest}, {context}, {name} */
  messageTemplate: string;
  /** Topics this step relates to (for matching against VIP interests) */
  relevantTopics: string[];
  /** Text anchor used to locate the precise region in the PDF text layer. */
  highlightText?: string;
  /** Optional padding (in page %) to broaden the highlight region. */
  highlightPadding?: HighlightPadding;
  /** Coordinates for the highlight overlay (percentages of the page) */
  highlightArea: HighlightArea;
}
