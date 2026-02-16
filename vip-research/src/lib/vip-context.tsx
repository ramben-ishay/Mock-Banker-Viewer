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
  HighlightArea,
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
// PERSISTENCE (for cross-tab demo sync)
// ============================================================
const STORAGE_KEY = "factify_demo_state_v1";

type PersistedState = Pick<
  AppState,
  "vips" | "isConnected" | "recommendations" | "commentThreads" | "engagementTimelines"
>;

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) return null;
    if (typeof parsed.isConnected !== "boolean") return null;
    if (!Array.isArray(parsed.vips)) return null;
    if (!isObject(parsed.recommendations)) return null;
    if (!isObject(parsed.commentThreads)) return null;
    if (!isObject(parsed.engagementTimelines)) return null;
    return parsed as PersistedState;
  } catch {
    return null;
  }
}

function selectPersistedState(state: AppState): PersistedState {
  return {
    vips: state.vips,
    isConnected: state.isConnected,
    recommendations: state.recommendations,
    commentThreads: state.commentThreads,
    engagementTimelines: state.engagementTimelines,
  };
}

function parsePageNumber(pageReference?: string): number | undefined {
  if (!pageReference) return undefined;
  const m = pageReference.match(/p\.\s*(\d+)/i);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : undefined;
}

function highlightForIndex(idx: number): HighlightArea {
  // Demo-friendly deterministic placement (percentages).
  const top = 14 + (idx % 4) * 18;
  const left = 8;
  const width = 84;
  const height = 9;
  return { top, left, width, height };
}

// ============================================================
// ACTIONS
// ============================================================
type Action =
  | { type: "HYDRATE_STATE"; payload: PersistedState }
  | { type: "RESET_DEMO" }
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
      type: "ADD_THREAD_REPLY";
      payload: {
        vipId: string;
        threadId: string;
        text: string;
        author: {
          name: string;
          initials: string;
          role: "banker" | "vip";
          color: string;
        };
      };
    }
  | {
      type: "ADD_REPLY";
      payload: { vipId: string; threadId: string; text: string };
    };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE_STATE":
      return {
        ...state,
        ...action.payload,
        // Never persist/hydrate transient UI toasts.
        toasts: state.toasts,
      };

    case "RESET_DEMO":
      return initialState;

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
        .map((q, idx) => {
          const pageNumber = parsePageNumber(q.pageReference);
          return {
            id: `ct-share-${Date.now()}-${idx}`,
            documentId: documentId || "",
            documentTitle,
            quoteText: q.quoteText,
            pageReference: q.pageReference,
            pageNumber,
            highlightArea: highlightForIndex(idx),
            comments: [
              {
                id: `c-share-${Date.now()}-${idx}`,
                author: {
                  name: "Your Banker",
                  initials: "YB",
                  role: "banker" as const,
                  color: "#444aff",
                },
                text: q.comment,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        });

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

    case "ADD_THREAD_REPLY": {
      const { vipId, threadId, text, author } = action.payload;
      const threads = (state.commentThreads[vipId] || []).map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            comments: [
              ...thread.comments,
              {
                id: `c-${Date.now()}`,
                author,
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
                  // In this demo, the VIP is the "user" of the PDF viewer.
                  // Banker-authored messages should never render as "You Banker".
                  name: "Your Banker",
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
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const persisted = loadPersistedState();
    return persisted ? { ...init, ...persisted } : init;
  });
  const toastTimeoutsRef = useRef<number[]>([]);
  const persistTimerRef = useRef<number | null>(null);

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

  // Persist core demo state (excluding toasts). Debounced to avoid chatty writes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (persistTimerRef.current) window.clearTimeout(persistTimerRef.current);
    persistTimerRef.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(selectPersistedState(state))
        );
      } catch {
        // Ignore quota / serialization errors in demo mode.
      }
    }, 120);
  }, [
    state.vips,
    state.isConnected,
    state.recommendations,
    state.commentThreads,
    state.engagementTimelines,
  ]);

  // Cross-tab sync: rehydrate when another tab updates the storage key.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const persisted = loadPersistedState();
      if (persisted) dispatch({ type: "HYDRATE_STATE", payload: persisted });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  // Exposed helper for repeatable demos.
  const resetDemo = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    dispatch({ type: "RESET_DEMO" });
  }, [dispatch]);

  return (
    <AppContext.Provider value={{ state, dispatch, addToast, resetDemo }}>
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
