"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  VIP,
  Recommendation,
  CommentThread,
  TimelineEntry,
} from "./types";
import {
  MOCK_VIPS,
  RECOMMENDATIONS,
  COMMENT_THREADS,
  ENGAGEMENT_TIMELINES,
  generateRecommendationsForVip,
} from "./mock-data";

// ============================================================
// STATE
// ============================================================
interface AppState {
  vips: VIP[];
  isConnected: boolean;
  recommendations: Record<string, Recommendation[]>;
  commentThreads: Record<string, CommentThread[]>;
  engagementTimelines: Record<string, TimelineEntry[]>;
  toasts: Toast[];
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "danger";
}

const initialState: AppState = {
  vips: [],
  isConnected: false,
  recommendations: {},
  commentThreads: {},
  engagementTimelines: {},
  toasts: [],
};

// ============================================================
// ACTIONS
// ============================================================
type Action =
  | { type: "CONNECT_CRM" }
  | { type: "ADD_VIP"; payload: VIP }
  | {
      type: "SHARE_DOCUMENT";
      payload: {
        vipId: string;
        recommendationId: string;
        documentId?: string;
        documentTitle: string;
        approvedQuotes?: { quoteText: string; comment: string; pageReference: string }[];
      };
    }
  | { type: "DISMISS_RECOMMENDATION"; payload: { vipId: string; recommendationId: string } }
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: string }
  | {
      type: "ADD_REPLY";
      payload: { vipId: string; threadId: string; text: string };
    };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "CONNECT_CRM":
      return {
        ...state,
        isConnected: true,
        vips: MOCK_VIPS,
        recommendations: { ...RECOMMENDATIONS },
        commentThreads: { ...COMMENT_THREADS },
        engagementTimelines: { ...ENGAGEMENT_TIMELINES },
      };

    case "ADD_VIP":
      return {
        ...state,
        vips: [...state.vips, action.payload],
        recommendations: {
          ...state.recommendations,
          [action.payload.id]: generateRecommendationsForVip(action.payload),
        },
        commentThreads: {
          ...state.commentThreads,
          [action.payload.id]: [],
        },
        engagementTimelines: {
          ...state.engagementTimelines,
          [action.payload.id]: [],
        },
      };

    case "SHARE_DOCUMENT": {
      const { vipId, recommendationId, documentId, documentTitle, approvedQuotes } = action.payload;
      const updatedRecs = (state.recommendations[vipId] || []).map((r) =>
        r.id === recommendationId ? { ...r, shared: true } : r
      );
      const newTimelineEntry: TimelineEntry = {
        id: `te-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        documentId: documentId || "",
        documentTitle,
        actionType: "shared",
        completionPercent: 0,
      };
      const existingTimeline = state.engagementTimelines[vipId] || [];

      // Create comment threads from approved quotes
      const existingComments = state.commentThreads[vipId] || [];
      const newCommentThreads: CommentThread[] = (approvedQuotes || [])
        .filter((q) => q.comment.trim().length > 0)
        .map((q, idx) => ({
          id: `ct-share-${Date.now()}-${idx}`,
          documentId: documentId || "",
          documentTitle,
          quoteText: q.quoteText,
          pageReference: q.pageReference,
          comments: [
            {
              id: `c-share-${Date.now()}-${idx}`,
              author: {
                name: "You",
                initials: "YB",
                role: "banker" as const,
                color: "#444aff",
              },
              text: q.comment,
              timestamp: new Date().toISOString(),
            },
          ],
        }));

      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [vipId]: updatedRecs,
        },
        engagementTimelines: {
          ...state.engagementTimelines,
          [vipId]: [newTimelineEntry, ...existingTimeline],
        },
        commentThreads: {
          ...state.commentThreads,
          [vipId]: [...newCommentThreads, ...existingComments],
        },
      };
    }

    case "DISMISS_RECOMMENDATION": {
      const { vipId, recommendationId } = action.payload;
      const updatedRecs = (state.recommendations[vipId] || []).map((r) =>
        r.id === recommendationId ? { ...r, dismissed: true } : r
      );
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [vipId]: updatedRecs,
        },
      };
    }

    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    case "ADD_REPLY": {
      const { vipId, threadId, text } = action.payload;
      const threads = (state.commentThreads[vipId] || []).map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            comments: [
              ...thread.comments,
              {
                id: `c-${Date.now()}`,
                author: {
                  name: "You",
                  initials: "YB",
                  role: "banker" as const,
                  color: "#444aff",
                },
                text,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return thread;
      });
      return {
        ...state,
        commentThreads: {
          ...state.commentThreads,
          [vipId]: threads,
        },
      };
    }

    default:
      return state;
  }
}

// ============================================================
// CONTEXT
// ============================================================
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addToast: (message: string, type?: Toast["type"]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const toastTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      toastTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      toastTimeoutsRef.current = [];
    };
  }, []);

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `toast-${Date.now()}`;
    dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", payload: id });
      toastTimeoutsRef.current = toastTimeoutsRef.current.filter(
        (activeId) => activeId !== timeoutId
      );
    }, 4000);
    toastTimeoutsRef.current.push(timeoutId);
  }, [dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch, addToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
