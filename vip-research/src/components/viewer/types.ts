import type { WalkthroughStep } from "@/lib/types";

export interface ViewerCommentThread {
  id: string;
  quoteText: string;
  pageReference?: string;
  pageNumber?: number;
  highlightArea?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  comments: {
    id: string;
    author: {
      name: string;
      initials: string;
      role: "banker" | "vip";
      color: string;
    };
    text: string;
    timestamp: string;
  }[];
}

export interface FactifyViewerProps {
  /** Document id used for demo scripts and cross-feature behavior */
  docId?: string;
  /** When true, treat the viewer as the VIP/customer view */
  vipMode?: boolean;
  pdfUrl: string;
  documentTitle?: string;
  userName?: string;
  userInitials?: string;
  /** Comment threads from the banker app to display in the Comments drawer */
  commentThreads?: ViewerCommentThread[];
  /** Callback when user adds a reply in the viewer */
  onAddReply?: (threadId: string, text: string) => void;
  /** Callback for back navigation */
  onBack?: () => void;
  /** Walkthrough steps for the guided document walkthrough */
  walkthroughSteps?: WalkthroughStep[];
  /** When true, show Factify parity header (Preflight, no Back) */
  parityMode?: boolean;
  /** Active VIP name for personalized intro */
  vipName?: string;
  /** Active VIP interests for personalized intro */
  vipInterests?: string[];
}
