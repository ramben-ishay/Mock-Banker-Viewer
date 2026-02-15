import type { WalkthroughStep } from "@/lib/types";

export interface ViewerCommentThread {
  id: string;
  quoteText: string;
  pageReference?: string;
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
