/**
 * FactifyViewer — standalone PDF viewer component.
 *
 * Usage:
 *   import { FactifyViewer } from './FactifyViewer';
 *   <FactifyViewer pdfUrl="/path/to/file.pdf" />
 *
 * Props:
 *   pdfUrl        — URL or path to the PDF file to display.
 *   documentTitle — optional title shown in the header (extracted from filename if omitted).
 *   userName      — optional current user display name (defaults to "User").
 *   userInitials  — optional 1 or 2 letter initials for the avatar (defaults to first letter of userName).
 *
 * Peer dependencies: react, react-dom, react-pdf
 */

import { useState, useCallback, useRef, useEffect, type FormEvent, type ReactNode } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import {
  StarsIcon, CommentIcon, HistoryIcon, VersionsIcon, BarChartIcon,
  SettingsIcon, ArrowUpIcon, CloseIcon, DotsHorizontalIcon, SearchIcon,
  DownloadIcon, PrintIcon, ListIcon, MinusIcon, PlusIcon, ShareIcon,
  CommentAddIcon,
} from './Icons';
import './FactifyViewer.css';

// ——— PDF.js worker ———
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// ——— Types ———
type DrawerType = 'ai' | 'comments' | 'timeline' | 'versions' | 'analytics' | 'settings' | null;

export interface FactifyViewerProps {
  pdfUrl: string;
  documentTitle?: string;
  userName?: string;
  userInitials?: string;
}

// ——— Helpers ———
function titleFromUrl(url: string): string {
  const name = url.split('/').pop() ?? 'Document';
  return name.replace(/\.pdf$/i, '').replace(/[_\-]+/g, ' ');
}

// ======================== MAIN COMPONENT ========================

export function FactifyViewer({
  pdfUrl,
  documentTitle,
  userName = 'User',
  userInitials,
}: FactifyViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(0.97);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

  const title = documentTitle ?? titleFromUrl(pdfUrl);
  const initials = userInitials ?? userName.charAt(0).toUpperCase();

  const onLoadSuccess = useCallback((d: { numPages: number }) => setNumPages(d.numPages), []);
  const zoomIn = () => setScale((s) => Math.min(2, +(s + 0.1).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(0.3, +(s - 0.1).toFixed(2)));
  const closeDrawer = () => setActiveDrawer(null);

  return (
    <div className="fv-root">
      {/* Header */}
      <header className="fv-header">
        <div className="fv-header-left">
          <span className="fv-logo">
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
              <rect width="24" height="24" rx="4" fill="#333" />
              <text x="6" y="18" fill="white" fontSize="16" fontWeight="700" fontFamily="Inter,sans-serif">F</text>
            </svg>
          </span>
          <span className="fv-doc-title">{title}</span>
        </div>
        <div className="fv-header-right">
          <span className="fv-green-dot" />
          <button className="fv-btn fv-btn-ghost fv-btn-ghost-text">
            <ShareIcon style={{ width: 16, height: 16 }} />
            Share
          </button>
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
          />
          <div className="fv-pdf-area">
            <div className="fv-pdf-scroll">
              <Document
                file={pdfUrl}
                onLoadSuccess={onLoadSuccess}
                className="fv-pdf-doc"
                loading={<div className="fv-spinner" />}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <div key={i} className="fv-pdf-page">
                    <Page pageNumber={i + 1} scale={scale} renderTextLayer renderAnnotationLayer />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        </div>

        {/* Inline drawer */}
        <div className="fv-drawer" aria-hidden={activeDrawer === null}>
          <div className="fv-drawer-inner">
            {activeDrawer === 'ai' && <AIChatDrawer onClose={closeDrawer} />}
            {activeDrawer === 'comments' && <CommentsDrawer onClose={closeDrawer} userName={userName} userInitials={initials} />}
            {activeDrawer !== null && activeDrawer !== 'ai' && activeDrawer !== 'comments' && (
              <PlaceholderDrawer name={activeDrawer} onClose={closeDrawer} />
            )}
          </div>
        </div>

        {/* Side panel */}
        <SidePanelStrip activeDrawer={activeDrawer} onToggle={setActiveDrawer} />
      </div>
    </div>
  );
}

// ======================== TOOLBAR ========================

function ToolbarBar({ currentPage, totalPages, zoom, onPageChange, onZoomIn, onZoomOut }: {
  currentPage: number; totalPages: number; zoom: number;
  onPageChange: (p: number) => void; onZoomIn: () => void; onZoomOut: () => void;
}) {
  return (
    <div className="fv-toolbar-wrap">
      <div className="fv-toolbar">
        <button className="fv-btn fv-btn-ghost fv-btn-icon" title="Toggle sidebar">
          <ListIcon style={{ width: 20, height: 20 }} />
        </button>

        <div className="fv-toolbar-center">
          <span className="fv-page-label">Page</span>
          <input
            className="fv-page-input"
            type="text"
            value={currentPage}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 1 && v <= totalPages) onPageChange(v);
            }}
          />
          <span className="fv-page-label">/</span>
          <span className="fv-page-label">{totalPages}</span>

          <div className="fv-toolbar-sep" />

          <button className="fv-btn fv-btn-ghost fv-btn-icon-sm" onClick={onZoomOut} title="Zoom out">
            <MinusIcon style={{ width: 16, height: 16 }} />
          </button>
          <span className="fv-zoom-label">{Math.round(zoom * 100)}%</span>
          <button className="fv-btn fv-btn-ghost fv-btn-icon-sm" onClick={onZoomIn} title="Zoom in">
            <PlusIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div className="fv-toolbar-right">
          <button className="fv-btn fv-btn-ghost fv-btn-icon-sm" title="Download">
            <DownloadIcon style={{ width: 16, height: 16 }} />
          </button>
          <button className="fv-btn fv-btn-ghost fv-btn-icon-sm" title="Print">
            <PrintIcon style={{ width: 16, height: 16 }} />
          </button>
          <button className="fv-btn fv-btn-ghost fv-btn-icon-sm" title="Search">
            <SearchIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================== SIDE PANEL ========================

const SP_ITEMS: { id: DrawerType; icon: typeof StarsIcon; label: string; isAI?: boolean }[] = [
  { id: 'ai', icon: StarsIcon, label: 'Ask AI', isAI: true },
  { id: 'comments', icon: CommentIcon, label: 'Comments' },
  { id: 'timeline', icon: HistoryIcon, label: 'Timeline' },
  { id: 'versions', icon: VersionsIcon, label: 'Versions' },
  { id: 'analytics', icon: BarChartIcon, label: 'Analytics' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

function SidePanelStrip({ activeDrawer, onToggle }: { activeDrawer: DrawerType; onToggle: (d: DrawerType) => void }) {
  return (
    <aside className="fv-sidepanel" role="toolbar" aria-orientation="vertical">
      {SP_ITEMS.map((item) => {
        const active = activeDrawer === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className="fv-sp-btn"
            aria-pressed={active}
            title={item.label}
            onClick={() => onToggle(active ? null : item.id)}
          >
            {item.isAI && <span className="fv-gradient-ring" />}
            <Icon />
          </button>
        );
      })}
    </aside>
  );
}

// ======================== AI CHAT DRAWER ========================

const SUMMARY_TEXT =
  'This document provides a detailed analysis examining key themes, data, and conclusions. The AI has processed all pages and is ready to answer questions about the content.';

const FOLLOW_UP_QUESTIONS = [
  'What are the main findings or conclusions of this document?',
  'Can you summarize the key data points presented?',
  'What methodology or framework does this document use?',
];

interface Msg { id: string; role: 'user' | 'assistant'; content: string }

function AIChatDrawer({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const send = (text?: string) => {
    const prompt = text ?? input;
    if (!prompt.trim()) return;
    setMessages((p) => [...p, { id: Date.now().toString(), role: 'user', content: prompt }]);
    setInput(''); if (inputRef.current) inputRef.current.textContent = '';
    setThinking(true);
    setTimeout(() => {
      setMessages((p) => [...p, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: 'Based on the document, ' + prompt.toLowerCase().replace(/\?$/, '') + '. The document provides detailed analysis with comprehensive methodology and supporting data.',
      }]);
      setThinking(false);
    }, 1500);
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); send(); };
  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  const showWelcome = messages.length === 0;

  return (
    <>
      <DrawerHeader icon={<StarsIcon style={{ color: 'var(--fv-brand-500)' }} />} title="Ask AI" onClose={onClose} />
      <div ref={scrollRef} className="fv-chat-body">
        {showWelcome && (
          <div className="fv-chat-welcome">
            <div className="fv-chat-robot">
              <svg viewBox="0 0 48 48" fill="none" style={{ width: 40, height: 40 }}>
                <rect x="8" y="14" width="32" height="24" rx="6" fill="#878ba4" />
                <rect x="16" y="20" width="6" height="6" rx="2" fill="white" />
                <rect x="26" y="20" width="6" height="6" rx="2" fill="white" />
                <rect x="20" y="30" width="8" height="3" rx="1.5" fill="white" />
                <rect x="20" y="6" width="8" height="10" rx="4" fill="#878ba4" />
              </svg>
            </div>
            <div>
              <div className="fv-chat-welcome-title">Welcome!</div>
              <div className="fv-chat-welcome-desc">
                I've read this document so you don't have to, so ask me anything! What do you want to know about it?
              </div>
            </div>
          </div>
        )}

        <div className="fv-summary-card">
          <span className="fv-gradient-ring" />
          <div className="fv-summary-title"><StarsIcon /><span>Document Summary</span></div>
          <p className="fv-summary-text">{SUMMARY_TEXT}</p>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`fv-msg ${m.role === 'user' ? 'fv-msg-user' : 'fv-msg-ai'}`}>
            <div className={`fv-bubble ${m.role === 'user' ? 'fv-bubble-user' : 'fv-bubble-ai'}`}>{m.content}</div>
          </div>
        ))}

        {thinking && (
          <div className="fv-thinking">
            <span className="fv-dot" /><span className="fv-dot" /><span className="fv-dot" />
          </div>
        )}

        {!thinking && showWelcome && (
          <div className="fv-followups">
            {FOLLOW_UP_QUESTIONS.map((q, i) => (
              <button key={i} className="fv-followup-btn" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}
      </div>

      <div className="fv-chat-input-wrap">
        <form onSubmit={onSubmit}>
          <div className="fv-chat-input-box">
            <span
              ref={inputRef}
              role="textbox"
              aria-multiline="true"
              contentEditable="plaintext-only"
              suppressContentEditableWarning
              onInput={(e) => setInput((e.target as HTMLSpanElement).textContent ?? '')}
              onKeyDown={onKey}
              data-placeholder="Ask me anything about this document"
              className="fv-chat-editable"
            />
            <button type="submit" disabled={!input.trim()} className="fv-chat-send">
              <ArrowUpIcon />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ======================== COMMENTS DRAWER ========================

interface CommentData { id: string; author: string; initials: string; color: string; text: string; timestamp: Date; replies: CommentData[] }

const MOCK_COMMENTS: CommentData[] = [
  {
    id: '1', author: 'Sarah Chen', initials: 'SC', color: '#d04aff',
    text: 'The data in section 3 seems inconsistent with earlier figures. Can someone verify?',
    timestamp: new Date(2026, 1, 10, 9, 30),
    replies: [{
      id: '1r1', author: 'Michael Torres', initials: 'MT', color: '#ffa537',
      text: 'Verified. The discrepancy is due to different baseline assumptions in each section.',
      timestamp: new Date(2026, 1, 10, 10, 15), replies: [],
    }],
  },
  {
    id: '2', author: 'James Whitfield', initials: 'JW', color: '#5ad45a',
    text: 'Interesting methodology change compared to the previous edition of this report.',
    timestamp: new Date(2026, 1, 9, 14, 45), replies: [],
  },
];

function fmtTime(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function CommentsDrawer({ onClose, userName, userInitials }: { onClose: () => void; userName: string; userInitials: string }) {
  const [comments, setComments] = useState<CommentData[]>(MOCK_COMMENTS);
  const [search, setSearch] = useState('');
  const [drafting, setDrafting] = useState(false);
  const [draftText, setDraftText] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (drafting) taRef.current?.focus(); }, [drafting]);

  const addComment = (e: FormEvent) => {
    e.preventDefault();
    if (!draftText.trim()) return;
    setComments((p) => [{ id: Date.now().toString(), author: userName, initials: userInitials, color: '#444aff', text: draftText.trim(), timestamp: new Date(), replies: [] }, ...p]);
    setDraftText(''); setDrafting(false);
  };

  const filtered = search.trim()
    ? comments.filter((c) =>
        c.text.toLowerCase().includes(search.toLowerCase()) ||
        c.author.toLowerCase().includes(search.toLowerCase()) ||
        c.replies.some((r) => r.text.toLowerCase().includes(search.toLowerCase()))
      )
    : comments;

  return (
    <>
      <DrawerHeader icon={<CommentIcon style={{ color: 'var(--fv-neutral-500)' }} />} title="Comments & Markup" onClose={onClose} />

      {comments.length > 0 && (
        <div className="fv-comments-search">
          <div className="fv-search-wrap">
            <SearchIcon />
            <input className="fv-search-input" placeholder="Search comments" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      )}

      <div className="fv-comments-body">
        {drafting && (
          <div className="fv-comment-draft">
            <div className="fv-comment-header" style={{ marginBottom: 8 }}>
              <span className="fv-comment-avatar" style={{ background: '#444aff' }}>{userInitials}</span>
              <span className="fv-comment-author">{userName}</span>
            </div>
            <form onSubmit={addComment}>
              <textarea ref={taRef} className="fv-comment-textarea" placeholder="Write a comment..." value={draftText} onChange={(e) => setDraftText(e.target.value)} />
              <div className="fv-draft-actions">
                <button type="submit" disabled={!draftText.trim()} className="fv-btn fv-btn-primary">Comment</button>
                <button type="button" className="fv-btn fv-btn-outlined" onClick={() => { setDrafting(false); setDraftText(''); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {filtered.length === 0 && !drafting && (
          <div className="fv-empty">
            <CommentIcon />
            <p>No comments yet. Start the conversation!</p>
            <button className="fv-btn fv-btn-outlined" onClick={() => setDrafting(true)}>
              <CommentAddIcon style={{ width: 16, height: 16 }} /> Add Comment
            </button>
          </div>
        )}

        {filtered.map((c) => (
          <CommentThread key={c.id} comment={c} />
        ))}
      </div>

      {(comments.length > 0 || drafting) && (
        <div className="fv-comments-footer">
          <button className="fv-btn fv-btn-outlined" style={{ width: '100%' }} onClick={() => setDrafting(true)}>
            <CommentAddIcon style={{ width: 16, height: 16 }} /> Add Comment
          </button>
        </div>
      )}
    </>
  );
}

function CommentThread({ comment }: { comment: CommentData }) {
  const hasReplies = comment.replies.length > 0;
  return (
    <div>
      <div className="fv-comment-item">
        {hasReplies && <div className="fv-thread-line" style={{ top: 'calc(4px + 32px + 4px)', bottom: 2 }} />}
        <div className="fv-comment-header">
          <span className="fv-comment-avatar" style={{ background: comment.color }}>{comment.initials}</span>
          <div className="fv-comment-meta">
            <span className="fv-comment-author">{comment.author}</span>
            <span className="fv-comment-time">{fmtTime(comment.timestamp)}</span>
          </div>
        </div>
        <p className="fv-comment-text">{comment.text}</p>
      </div>
      {comment.replies.map((r) => (
        <div key={r.id} className="fv-comment-item">
          <div className="fv-comment-header">
            <span className="fv-comment-avatar" style={{ background: r.color }}>{r.initials}</span>
            <div className="fv-comment-meta">
              <span className="fv-comment-author">{r.author}</span>
              <span className="fv-comment-time">{fmtTime(r.timestamp)}</span>
            </div>
          </div>
          <p className="fv-comment-text">{r.text}</p>
        </div>
      ))}
      <hr className="fv-thread-sep" />
    </div>
  );
}

// ======================== SHARED UI ========================

function DrawerHeader({ icon, title, onClose, children }: { icon: ReactNode; title: string; onClose: () => void; children?: ReactNode }) {
  return (
    <div className="fv-drawer-header">
      <div className="fv-drawer-title">{icon}<span>{title}</span></div>
      <div className="fv-drawer-actions">
        {children}
        <button className="fv-btn fv-btn-ghost fv-btn-icon-sm" onClick={() => {}}>
          <DotsHorizontalIcon style={{ width: 16, height: 16 }} />
        </button>
        <button className="fv-btn fv-btn-ghost fv-btn-icon-sm" onClick={onClose}>
          <CloseIcon style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}

function PlaceholderDrawer({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <>
      <DrawerHeader icon={null} title={name.charAt(0).toUpperCase() + name.slice(1)} onClose={onClose} />
      <div className="fv-placeholder">{name} panel (coming soon)</div>
    </>
  );
}
