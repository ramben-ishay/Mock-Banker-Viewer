/**
 * FactifyViewer (integrated version)
 *
 * Enhanced to accept comment threads from the banker app context
 * so that banker annotations and VIP replies are shown in the
 * viewer's Comments drawer.
 */

"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type FormEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { WalkthroughStep } from "@/lib/types";
import type { FactifyViewerProps, ViewerCommentThread } from "./types";

import {
  StarsIcon,
  CommentIcon,
  HistoryIcon,
  VersionsIcon,
  BarChartIcon,
  SettingsIcon,
  ArrowUpIcon,
  CloseIcon,
  SearchIcon,
  DownloadIcon,
  PrintIcon,
  ListIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  CommentAddIcon,
} from "./Icons";
import "./FactifyViewer.css";

// Prefer a local worker file served from /public for reliability in restricted networks.
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Types
type DrawerType =
  | "ai"
  | "comments"
  | "timeline"
  | "versions"
  | "analytics"
  | "settings"
  | null;

function useIsMobile(breakpoint = 480) {
  const getMatches = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  };

  const [isMobile, setIsMobile] = useState(getMatches);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Set once in case breakpoint changed.
    setIsMobile(mql.matches);

    // Some older browsers expose addListener/removeListener; DOM typings don't always include it.
    const mqlAny = mql as unknown as {
      addEventListener?: (type: "change", listener: (e: MediaQueryListEvent) => void) => void;
      removeEventListener?: (type: "change", listener: (e: MediaQueryListEvent) => void) => void;
      addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
    };

    if (typeof mqlAny.addEventListener === "function") {
      mqlAny.addEventListener("change", onChange);
      return () => mqlAny.removeEventListener?.("change", onChange);
    }
    if (typeof mqlAny.addListener === "function") {
      mqlAny.addListener(onChange);
      return () => mqlAny.removeListener?.(onChange);
    }
  }, [breakpoint]);

  return isMobile;
}

function titleFromUrl(url: string): string {
  const name = url.split("/").pop() ?? "Document";
  return name.replace(/\.pdf$/i, "").replace(/[_\-]+/g, " ");
}

// ======================== MAIN COMPONENT ========================

export function FactifyViewer({
  pdfUrl,
  documentTitle,
  userName = "User",
  userInitials,
  commentThreads = [],
  onAddReply,
  onBack,
  walkthroughSteps = [],
  parityMode = false,
  vipName,
  vipInterests,
}: FactifyViewerProps) {
  const isMobile = useIsMobile(480);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(0.97);
  const [scaleMode, setScaleMode] = useState<"auto" | "manual">("auto");
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Walkthrough state
  const [wtActive, setWtActive] = useState(false);
  const [wtStepIndex, setWtStepIndex] = useState(0);
  const [wtCardStyle, setWtCardStyle] = useState<CSSProperties>({});
  const pdfScrollRef = useRef<HTMLDivElement>(null);

  const title = documentTitle ?? titleFromUrl(pdfUrl);
  const initials =
    userInitials ?? userName.charAt(0).toUpperCase();

  const commentCount = commentThreads.reduce(
    (sum, t) => sum + t.comments.length,
    0
  );

  const onLoadSuccess = useCallback((d: { numPages: number }) => {
    setPdfError(null);
    setNumPages(d.numPages);
  }, []);
  const onLoadError = useCallback((error: Error) => {
    console.error("[FactifyViewer] PDF load error:", error);
    setPdfError("Unable to load the document. Please try again later.");
  }, []);
  const zoomIn = () => {
    setScaleMode("manual");
    setScale((s) => Math.min(2, +(s + 0.1).toFixed(2)));
  };
  const zoomOut = () => {
    setScaleMode("manual");
    setScale((s) => Math.max(0.3, +(s - 0.1).toFixed(2)));
  };
  const closeDrawer = () => setActiveDrawer(null);

  // On mobile, auto-fit the PDF to the available width unless the user has manually zoomed.
  useEffect(() => {
    if (!isMobile) return;
    if (scaleMode === "manual") return;
    const el = pdfScrollRef.current;
    if (!el) return;

    const compute = () => {
      const containerWidth = el.clientWidth;
      if (!containerWidth) return;
      const next = Math.min((containerWidth - 16) / 612, 1.2);
      setScale(+next.toFixed(2));
    };

    compute();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => compute());
      ro.observe(el);
      return () => ro.disconnect();
    }

    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile, scaleMode]);

  // Entering mobile view resets to auto-fit by default.
  useEffect(() => {
    if (isMobile) setScaleMode("auto");
  }, [isMobile]);

  // Walkthrough navigation
  const currentWtStep = walkthroughSteps[wtStepIndex] ?? null;

  const scrollToWtStep = useCallback(
    (stepIndex: number) => {
      const step = walkthroughSteps[stepIndex];
      if (!step || !pdfScrollRef.current) return;
      const pages = pdfScrollRef.current.querySelectorAll(".fv-pdf-page");
      const targetPage = pages[step.pageNumber - 1] as HTMLElement;
      if (targetPage) {
        const container = pdfScrollRef.current;
        const pageHeight = targetPage.offsetHeight;
        const viewportHeight = container.offsetHeight;
        const highlightYInPage = (step.highlightArea.top / 100) * pageHeight;
        const pageOffsetTop = targetPage.offsetTop;

        // Target scroll to center highlight at ~30% from top of viewport
        const targetScrollTop =
          pageOffsetTop + highlightYInPage - viewportHeight * 0.3;

        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth",
        });

        if (!isMobile) {
          // Update card position to align with highlight (desktop only).
          // On mobile we use fixed positioning via CSS.
          const cardTopPx = Math.min(
            Math.max(viewportHeight * 0.3, 80),
            viewportHeight - 280
          );
          setWtCardStyle({
            top: `${cardTopPx}px`,
            bottom: "auto",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          });
        }
      }
    },
    [walkthroughSteps, isMobile]
  );

  const startWalkthrough = useCallback(() => {
    setWtActive(true);
    setWtStepIndex(0);
    setTimeout(() => scrollToWtStep(0), 100);
  }, [scrollToWtStep]);

  const goToWtStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= walkthroughSteps.length) return;
      setWtStepIndex(index);
      scrollToWtStep(index);
    },
    [walkthroughSteps.length, scrollToWtStep]
  );

  const endWalkthrough = useCallback(() => {
    setWtActive(false);
    setWtStepIndex(0);
    setWtCardStyle({});
  }, []);

  return (
    <div
      className={`fv-root${isMobile ? " fv-root-mobile" : ""}`}
      data-fv-mobile={isMobile ? "1" : "0"}
    >
      {/* Header */}
      <header className="fv-header">
        <div className="fv-header-left">
          {!parityMode && onBack && (
            <button
              className="fv-btn fv-btn-ghost fv-btn-icon fv-header-back-btn"
              onClick={onBack}
              title="Back"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: 18, height: 18 }}
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 4.293a1 1 0 0 1 0 1.414L9.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          {parityMode && (
            <button
              className="fv-btn fv-btn-ghost fv-btn-icon fv-header-preflight-btn"
              title="Preflight"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <span className="fv-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              style={{ width: 16, height: 16 }}
            >
              <rect width="24" height="24" rx="4" fill="#333" />
              <text
                x="6"
                y="18"
                fill="white"
                fontSize="16"
                fontWeight="700"
                fontFamily="Inter,sans-serif"
              >
                F
              </text>
            </svg>
          </span>
          <span className="fv-doc-title">{title}</span>
        </div>
        <div className="fv-header-right">
          <button className="fv-btn fv-share-btn">
            <ShareIcon style={{ width: 16, height: 16 }} />
            <span className="fv-share-label">Share</span>
          </button>
          <span className="fv-green-dot" />
          <span className="fv-avatar">{initials}</span>
        </div>
      </header>

      <div className="fv-main">
        {/* Center: toolbar + pdf */}
        <div className="fv-center">
          <ToolbarBar
            currentPage={currentPage}
            totalPages={numPages}
            zoom={scale}
            onPageChange={setCurrentPage}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            showSearch={showSearch}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onToggleSearch={() => setShowSearch((v) => !v)}
            onToggleThumbnails={() => setShowThumbnails((v) => !v)}
            onCloseSearch={() => {
              setShowSearch(false);
              setSearchText("");
            }}
          />
          <div className="fv-pdf-area">
            {showThumbnails && !isMobile && (
              <aside className="fv-thumbnails-panel" aria-label="Document thumbnails">
                {Array.from({ length: numPages || 4 }, (_, i) => (
                  <button
                    key={i}
                    className={`fv-thumbnail-btn${i + 1 === currentPage ? " fv-thumbnail-btn-active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                    aria-label={`Page ${i + 1}`}
                  >
                    <span className="fv-thumbnail-box" />
                    <span className="fv-thumbnail-label">Page {i + 1}</span>
                  </button>
                ))}
              </aside>
            )}
            <div className="fv-pdf-scroll" ref={pdfScrollRef}>
              {pdfError ? (
                <div className="fv-pdf-error">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c0c3d0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="fv-pdf-error-title">{pdfError}</p>
                  <button
                    onClick={() => {
                      setPdfError(null);
                      setNumPages(0);
                    }}
                    className="fv-pdf-error-retry"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onLoadSuccess}
                  onLoadError={onLoadError}
                  className="fv-pdf-doc"
                  loading={<div className="fv-spinner" />}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <div key={i} className="fv-pdf-page">
                      <Page
                        pageNumber={i + 1}
                        scale={scale}
                        renderTextLayer
                        renderAnnotationLayer
                      />
                      {wtActive &&
                        currentWtStep &&
                        currentWtStep.pageNumber === i + 1 && (
                          <WalkthroughOverlay step={currentWtStep} />
                        )}
                    </div>
                  ))}
                </Document>
              )}
            </div>

            {/* Support chat button (bottom left) */}
            <button
              className="fv-support-btn"
              title="Toggle support chat"
              aria-label="Toggle support chat"
            >
              ?
            </button>

            {/* Thumbnails overlay (mobile) */}
            {showThumbnails && isMobile && (
              <div className="fv-thumbnails-overlay" role="dialog" aria-modal="true">
                <div className="fv-thumbnails-overlay-header">
                  <span className="fv-thumbnails-overlay-title">Pages</span>
                  <button
                    className="fv-btn fv-btn-ghost fv-btn-icon-sm"
                    aria-label="Close thumbnails"
                    onClick={() => setShowThumbnails(false)}
                  >
                    <CloseIcon style={{ width: 16, height: 16 }} />
                  </button>
                </div>
                <div className="fv-thumbnails-grid" aria-label="Document thumbnails">
                  {Array.from({ length: numPages || 4 }, (_, i) => (
                    <button
                      key={i}
                      className={`fv-thumbnail-btn${i + 1 === currentPage ? " fv-thumbnail-btn-active" : ""}`}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        setShowThumbnails(false);
                      }}
                      aria-label={`Page ${i + 1}`}
                    >
                      <span className="fv-thumbnail-box" />
                      <span className="fv-thumbnail-label">Page {i + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Walkthrough card */}
            {walkthroughSteps.length > 0 && (
              <WalkthroughCard
                steps={walkthroughSteps}
                isActive={wtActive}
                currentIndex={wtStepIndex}
                onStart={startWalkthrough}
                onNext={() => goToWtStep(wtStepIndex + 1)}
                onPrev={() => goToWtStep(wtStepIndex - 1)}
                onEnd={endWalkthrough}
                vipName={vipName}
                vipInterests={vipInterests}
                style={wtActive && !isMobile ? wtCardStyle : {}}
              />
            )}
          </div>
        </div>

        {isMobile && activeDrawer !== null && (
          <div
            className="fv-drawer-backdrop"
            role="presentation"
            onClick={closeDrawer}
          />
        )}

        {/* Inline drawer */}
        <div
          className="fv-drawer"
          aria-hidden={activeDrawer === null}
        >
          <div className="fv-drawer-inner">
            {activeDrawer === "ai" && (
              <AIChatDrawer onClose={closeDrawer} isMobile={isMobile} />
            )}
            {activeDrawer === "comments" && (
              <CommentsDrawer
                onClose={closeDrawer}
                userName={userName}
                userInitials={initials}
                appThreads={commentThreads}
                onAddReply={onAddReply}
              />
            )}
            {activeDrawer !== null &&
              activeDrawer !== "ai" &&
              activeDrawer !== "comments" && (
                <PlaceholderDrawer
                  name={activeDrawer}
                  onClose={closeDrawer}
                />
              )}
          </div>
        </div>

        {/* Side panel */}
        <SidePanelStrip
          activeDrawer={activeDrawer}
          onToggle={setActiveDrawer}
          commentCount={commentCount}
        />
      </div>
    </div>
  );
}

// ======================== TOOLBAR ========================

function ToolbarBar({
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomIn,
  onZoomOut,
  showSearch,
  searchText,
  onSearchTextChange,
  onToggleSearch,
  onToggleThumbnails,
  onCloseSearch,
}: {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPageChange: (p: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  showSearch: boolean;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onToggleSearch: () => void;
  onToggleThumbnails: () => void;
  onCloseSearch: () => void;
}) {
  return (
    <div className="fv-toolbar-wrap">
      <div className="fv-toolbar">
        <button
          className="fv-btn fv-btn-ghost fv-btn-icon"
          title="Toggle sidebar"
          aria-label="Show thumbnails"
          onClick={onToggleThumbnails}
        >
          <ListIcon style={{ width: 20, height: 20 }} />
        </button>

        <div className="fv-toolbar-center">
          <span className="fv-page-label">Page</span>
          <input
            className="fv-page-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={currentPage}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 1 && v <= totalPages)
                onPageChange(v);
            }}
          />
          <span className="fv-page-label">/</span>
          <span className="fv-page-label">{totalPages}</span>

          <div className="fv-toolbar-sep" />

          <button
            className="fv-btn fv-btn-ghost fv-btn-icon-sm"
            onClick={onZoomOut}
            title="Zoom out"
          >
            <MinusIcon style={{ width: 16, height: 16 }} />
          </button>
          <span className="fv-zoom-label">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="fv-btn fv-btn-ghost fv-btn-icon-sm"
            onClick={onZoomIn}
            title="Zoom in"
          >
            <PlusIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div className="fv-toolbar-right">
          <button
            className="fv-btn fv-btn-ghost fv-btn-icon-sm fv-toolbar-download"
            title="Download"
          >
            <DownloadIcon style={{ width: 16, height: 16 }} />
          </button>
          <button
            className="fv-btn fv-btn-ghost fv-btn-icon-sm fv-toolbar-print"
            title="Print"
          >
            <PrintIcon style={{ width: 16, height: 16 }} />
          </button>
          <button
            className="fv-btn fv-btn-ghost fv-btn-icon-sm"
            title="Search in document"
            aria-label="Search in document"
            onClick={onToggleSearch}
          >
            <SearchIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
      {showSearch && (
        <div className="fv-search-overlay">
          <input
            className="fv-search-overlay-input"
            placeholder="Search in document..."
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            aria-label="Search in document"
          />
          <button className="fv-btn fv-btn-ghost fv-btn-icon-sm" aria-label="Close search" onClick={onCloseSearch}>
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}
    </div>
  );
}

// ======================== SIDE PANEL ========================

const SP_ITEMS: {
  id: DrawerType;
  icon: typeof StarsIcon;
  label: string;
  ariaLabel: string;
  isAI?: boolean;
}[] = [
  { id: "ai", icon: StarsIcon, label: "Ask AI", ariaLabel: "Ask AI sidebar", isAI: true },
  { id: "comments", icon: CommentIcon, label: "Comments", ariaLabel: "Comments sidebar" },
  { id: "timeline", icon: HistoryIcon, label: "Timeline", ariaLabel: "Timeline sidebar" },
  { id: "versions", icon: VersionsIcon, label: "Versions", ariaLabel: "Document Versions sidebar" },
  { id: "analytics", icon: BarChartIcon, label: "Analytics", ariaLabel: "Document Analytics sidebar" },
  { id: "settings", icon: SettingsIcon, label: "Settings", ariaLabel: "Document Settings sidebar" },
];

function SidePanelStrip({
  activeDrawer,
  onToggle,
  commentCount,
}: {
  activeDrawer: DrawerType;
  onToggle: (d: DrawerType) => void;
  commentCount: number;
}) {
  return (
    <aside
      className="fv-sidepanel"
      role="toolbar"
      aria-orientation="vertical"
    >
      {SP_ITEMS.map((item) => {
        const active = activeDrawer === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className="fv-sp-btn"
            aria-pressed={active}
            aria-label={item.ariaLabel}
            title={item.label}
            onClick={() => onToggle(active ? null : item.id)}
          >
            {item.isAI && <span className="fv-gradient-ring" />}
            <Icon />
            {item.id === "comments" && commentCount > 0 && (
              <span className="fv-comment-badge">
                {commentCount > 9 ? "9+" : commentCount}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}

// ======================== AI CHAT DRAWER ========================

const SUMMARY_TEXT =
  "This document provides a detailed analysis examining key themes, data, and conclusions. The AI has processed all pages and is ready to answer questions about the content.";

const FOLLOW_UP_QUESTIONS = [
  "What are the main findings or conclusions of this document?",
  "Can you summarize the key data points presented?",
  "What methodology or framework does this document use?",
];

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function AIChatDrawer({
  onClose,
  isMobile,
}: {
  onClose: () => void;
  isMobile: boolean;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const send = (text?: string) => {
    const prompt = text ?? input;
    if (!prompt.trim()) return;
    setMessages((p) => [
      ...p,
      { id: Date.now().toString(), role: "user", content: prompt },
    ]);
    setInput("");
    if (inputRef.current) inputRef.current.textContent = "";
    setThinking(true);
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Based on the document, " +
            prompt.toLowerCase().replace(/\?$/, "") +
            ". The document provides detailed analysis with comprehensive methodology and supporting data.",
        },
      ]);
      setThinking(false);
    }, 1500);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
  const showWelcome = messages.length === 0;

  return (
    <>
      <DrawerHeader
        icon={
          <StarsIcon style={{ color: "var(--fv-brand-500)" }} />
        }
        title="Ask AI"
        onClose={onClose}
      />
      <div ref={scrollRef} className="fv-chat-body">
        {showWelcome && (
          <div className="fv-chat-welcome">
            <div className="fv-chat-robot">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                style={{ width: 40, height: 40 }}
              >
                <rect
                  x="8"
                  y="14"
                  width="32"
                  height="24"
                  rx="6"
                  fill="#878ba4"
                />
                <rect
                  x="16"
                  y="20"
                  width="6"
                  height="6"
                  rx="2"
                  fill="white"
                />
                <rect
                  x="26"
                  y="20"
                  width="6"
                  height="6"
                  rx="2"
                  fill="white"
                />
                <rect
                  x="20"
                  y="30"
                  width="8"
                  height="3"
                  rx="1.5"
                  fill="white"
                />
                <rect
                  x="20"
                  y="6"
                  width="8"
                  height="10"
                  rx="4"
                  fill="#878ba4"
                />
              </svg>
            </div>
            <div>
              <div className="fv-chat-welcome-title">Welcome!</div>
              <div className="fv-chat-welcome-desc">
                I&apos;ve read this document so you don&apos;t have to, so
                ask me anything! What do you want to know about it?
              </div>
              <div className="fv-chat-demo-note">
                Demo mode responses use sample text.
              </div>
            </div>
          </div>
        )}

        <div className="fv-summary-card">
          <span className="fv-gradient-ring" />
          <div className="fv-summary-title">
            <StarsIcon />
            <span>Document Summary</span>
          </div>
          <p className="fv-summary-text">{SUMMARY_TEXT}</p>
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={`fv-msg ${
              m.role === "user" ? "fv-msg-user" : "fv-msg-ai"
            }`}
          >
            <div
              className={`fv-bubble ${
                m.role === "user"
                  ? "fv-bubble-user"
                  : "fv-bubble-ai"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="fv-thinking">
            <span className="fv-dot" />
            <span className="fv-dot" />
            <span className="fv-dot" />
          </div>
        )}

        {!thinking && showWelcome && (
          <div className="fv-followups">
            {FOLLOW_UP_QUESTIONS.map((q, i) => (
              <button
                key={i}
                className="fv-followup-btn"
                aria-label={`Ask: ${q}`}
                onClick={() => send(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fv-chat-input-wrap">
        <form onSubmit={onSubmit}>
          <div className="fv-chat-input-box">
            {isMobile ? (
              <textarea
                className="fv-chat-editable fv-chat-textarea-mobile"
                placeholder="Ask me anything about this document"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
              />
            ) : (
              <span
                ref={inputRef}
                role="textbox"
                aria-multiline="true"
                contentEditable="plaintext-only"
                suppressContentEditableWarning
                onInput={(e) =>
                  setInput(
                    (e.target as HTMLSpanElement).textContent ?? ""
                  )
                }
                onKeyDown={onKey}
                data-placeholder="Ask me anything about this document"
                className="fv-chat-editable"
              />
            )}
            <button
              type="submit"
              disabled={!input.trim()}
              className="fv-chat-send"
              aria-label="Send message"
            >
              <ArrowUpIcon />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ======================== COMMENTS DRAWER (ENHANCED) ========================

function fmtTime(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

function CommentsDrawer({
  onClose,
  userName,
  userInitials,
  appThreads,
  onAddReply,
}: {
  onClose: () => void;
  userName: string;
  userInitials: string;
  appThreads: ViewerCommentThread[];
  onAddReply?: (threadId: string, text: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [localComments, setLocalComments] = useState<
    {
      id: string;
      author: string;
      initials: string;
      color: string;
      text: string;
      timestamp: Date;
    }[]
  >([]);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (drafting) taRef.current?.focus();
  }, [drafting]);

  const addComment = (e: FormEvent) => {
    e.preventDefault();
    if (!draftText.trim()) return;
    setLocalComments((p) => [
      {
        id: Date.now().toString(),
        author: userName,
        initials: userInitials,
        color: "#444aff",
        text: draftText.trim(),
        timestamp: new Date(),
      },
      ...p,
    ]);
    setDraftText("");
    setDrafting(false);
  };

  const hasAnyComments =
    appThreads.length > 0 || localComments.length > 0;

  const filteredAppThreads = search.trim()
    ? appThreads.filter(
        (t) =>
          t.quoteText.toLowerCase().includes(search.toLowerCase()) ||
          t.comments.some(
            (c) =>
              c.text
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              c.author.name
                .toLowerCase()
                .includes(search.toLowerCase())
          )
      )
    : appThreads;

  return (
    <>
      <DrawerHeader
        icon={
          <CommentIcon
            style={{ color: "var(--fv-neutral-500)" }}
          />
        }
        title="Comments"
        onClose={onClose}
      />

      {hasAnyComments && (
        <div className="fv-comments-search">
          <div className="fv-search-wrap">
            <SearchIcon />
            <input
              className="fv-search-input"
              placeholder="Search comments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="fv-comments-body">
        {drafting && (
          <div className="fv-comment-draft">
            <div className="fv-comment-header fv-comment-header-draft">
              <span className="fv-comment-avatar fv-comment-avatar-user">
                {userInitials}
              </span>
              <span className="fv-comment-author">{userName}</span>
            </div>
            <form onSubmit={addComment}>
              <textarea
                ref={taRef}
                className="fv-comment-textarea"
                placeholder="Write a comment..."
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
              />
              <div className="fv-draft-actions">
                <button
                  type="submit"
                  disabled={!draftText.trim()}
                  className="fv-btn fv-btn-primary"
                >
                  Comment
                </button>
                <button
                  type="button"
                  className="fv-btn fv-btn-outlined"
                  onClick={() => {
                    setDrafting(false);
                    setDraftText("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* App comment threads (from banker sharing) */}
        {filteredAppThreads.map((thread) => (
          <AppCommentThread
            key={thread.id}
            thread={thread}
            onAddReply={onAddReply}
          />
        ))}

        {/* Local viewer comments */}
        {localComments.map((c) => (
          <div key={c.id}>
            <div className="fv-comment-item">
              <div className="fv-comment-header">
                <span
                  className="fv-comment-avatar"
                  style={{ background: c.color }}
                >
                  {c.initials}
                </span>
                <div className="fv-comment-meta">
                  <span className="fv-comment-author">
                    {c.author}
                  </span>
                  <span className="fv-comment-time">
                    {fmtTime(c.timestamp)}
                  </span>
                </div>
              </div>
              <p className="fv-comment-text">{c.text}</p>
            </div>
            <hr className="fv-thread-sep" />
          </div>
        ))}

        {!hasAnyComments && !drafting && (
          <div className="fv-empty">
            <CommentIcon />
            <p>No comments yet. Start the conversation!</p>
            <button
              className="fv-btn fv-btn-outlined"
              onClick={() => setDrafting(true)}
            >
              <CommentAddIcon style={{ width: 16, height: 16 }} />{" "}
              Add Comment
            </button>
          </div>
        )}
      </div>

      {(hasAnyComments || drafting) && (
        <div className="fv-comments-footer">
          <button
            className="fv-btn fv-btn-outlined fv-btn-full"
            onClick={() => setDrafting(true)}
          >
            <CommentAddIcon style={{ width: 16, height: 16 }} /> Add
            Comment
          </button>
        </div>
      )}
    </>
  );
}

function AppCommentThread({
  thread,
  onAddReply,
}: {
  thread: ViewerCommentThread;
  onAddReply?: (threadId: string, text: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleReply = () => {
    if (!replyText.trim()) return;
    if (onAddReply) {
      onAddReply(thread.id, replyText.trim());
    }
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div>
      {/* Quote highlight */}
      <div className="fv-thread-quote">
        <p className="fv-thread-quote-text">
          &ldquo;{thread.quoteText}&rdquo;
        </p>
        {thread.pageReference && (
          <p className="fv-thread-quote-ref">
            {thread.pageReference}
          </p>
        )}
      </div>

      {/* Comment messages */}
      {thread.comments.map((comment, idx) => {
        const hasMore = idx < thread.comments.length - 1;
        return (
          <div key={comment.id} className="fv-comment-item">
            {hasMore && (
              <div className="fv-thread-line" />
            )}
            <div className="fv-comment-header">
              <span
                className="fv-comment-avatar"
                style={{ background: comment.author.color }}
              >
                {comment.author.initials}
              </span>
              <div className="fv-comment-meta">
                <span className="fv-comment-author">
                  {comment.author.name}
                  {comment.author.role === "banker" && (
                    <span className="fv-banker-badge">
                      Banker
                    </span>
                  )}
                </span>
                <span className="fv-comment-time">
                  {fmtTime(comment.timestamp)}
                </span>
              </div>
            </div>
            <p className="fv-comment-text">{comment.text}</p>
          </div>
        );
      })}

      {/* Reply input */}
      <div className="fv-reply-footer">
        {showReply ? (
          <div className="fv-reply-row">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleReply();
              }}
              className="fv-reply-input"
              autoFocus
            />
            <button
              className="fv-btn fv-btn-primary fv-reply-action-btn"
              onClick={handleReply}
              disabled={!replyText.trim()}
            >
              Reply
            </button>
            <button
              className="fv-btn fv-btn-outlined fv-reply-action-btn"
              onClick={() => {
                setShowReply(false);
                setReplyText("");
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="fv-reply-link"
            onClick={() => setShowReply(true)}
          >
            Reply
          </button>
        )}
      </div>

      <hr className="fv-thread-sep" />
    </div>
  );
}

// ======================== SHARED UI ========================

function DrawerHeader({
  icon,
  title,
  onClose,
  children,
}: {
  icon: ReactNode;
  title: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="fv-drawer-header">
      <div className="fv-drawer-title">
        {icon}
        <span>{title}</span>
      </div>
      <div className="fv-drawer-actions">
        {children}
        <button
          className="fv-btn fv-btn-ghost fv-btn-icon-sm"
          onClick={onClose}
        >
          <CloseIcon style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}

function PlaceholderDrawer({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  return (
    <>
      <DrawerHeader
        icon={null}
        title={name.charAt(0).toUpperCase() + name.slice(1)}
        onClose={onClose}
      />
      <div className="fv-placeholder">
        {name} panel (coming soon)
      </div>
    </>
  );
}

// ======================== WALKTHROUGH ========================

function WalkthroughOverlay({ step }: { step: WalkthroughStep }) {
  const { highlightArea } = step;
  return (
    <div
      className="fv-walkthrough-highlight"
      aria-hidden
      style={{
        top: `${highlightArea.top}%`,
        left: `${highlightArea.left}%`,
        width: `${highlightArea.width}%`,
        height: `${highlightArea.height}%`,
      }}
    />
  );
}

function WalkthroughCard({
  steps,
  isActive,
  currentIndex,
  onStart,
  onNext,
  onPrev,
  onEnd,
  vipName,
  vipInterests = [],
  style = {},
}: {
  steps: WalkthroughStep[];
  isActive: boolean;
  currentIndex: number;
  onStart: () => void;
  onNext: () => void;
  onPrev: () => void;
  onEnd: () => void;
  vipName?: string;
  vipInterests?: string[];
  style?: CSSProperties;
}) {
  const step = steps[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  // Personalized idle text
  const idleText = vipName ? (
    <>
      Hi {vipName.split(" ")[0]}, based on your interest in{" "}
      <strong>{vipInterests.slice(0, 2).join(" and ")}</strong>, we&apos;ve
      highlighted the most relevant sections for you.
    </>
  ) : (
    "Discover the most relevant sections of this document based on your interests and reading history."
  );

  return (
    <div className="fv-walkthrough-card" style={style}>
      <div className="fv-walkthrough-header">
        <div className="fv-walkthrough-header-left">
          <span className="fv-walkthrough-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </span>
          <span className="fv-walkthrough-header-title">
            Document Walkthrough
          </span>
        </div>
        {isActive && (
          <button
            className="fv-btn fv-btn-ghost fv-btn-icon-sm"
            onClick={onEnd}
            title="End walkthrough"
          >
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>

      <div className="fv-walkthrough-body">
        {!isActive ? (
          <>
            <p className="fv-walkthrough-idle-text">
              {idleText}
            </p>
            <button
              className="fv-walkthrough-start-btn"
              onClick={onStart}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
              Start Walkthrough
            </button>
          </>
        ) : step ? (
          <>
            <div className="fv-walkthrough-step-counter">
              Step {currentIndex + 1} of {steps.length}
            </div>
            <div className="fv-walkthrough-step-title">
              {step.title}
            </div>
            <p className="fv-walkthrough-step-message">
              {step.message}
            </p>

            <div className="fv-walkthrough-dots">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`fv-walkthrough-dot${
                    i === currentIndex
                      ? " fv-walkthrough-dot-active"
                      : ""
                  }`}
                />
              ))}
            </div>

            <div className="fv-walkthrough-nav">
              <button
                className="fv-walkthrough-nav-btn"
                onClick={onPrev}
                disabled={isFirst}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
                Previous
              </button>
              {isLast ? (
                <button
                  className="fv-walkthrough-nav-btn fv-walkthrough-nav-btn-primary"
                  onClick={onEnd}
                >
                  Finish
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </button>
              ) : (
                <button
                  className="fv-walkthrough-nav-btn fv-walkthrough-nav-btn-primary"
                  onClick={onNext}
                >
                  Next
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

