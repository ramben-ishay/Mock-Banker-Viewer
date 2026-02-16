# PDF Viewer (FactifyViewer) — Complete Specification

The FactifyViewer is the most complex and important component in the application. It simulates the VIP's reading experience when they receive a shared document.

## File Location

- Component: `src/components/viewer/FactifyViewer.tsx`
- Styles: `src/components/viewer/FactifyViewer.css` (~786 lines)
- Types: `src/components/viewer/types.ts`
- Animation: `src/components/viewer/FactificationAnimation.tsx`

## Props

```typescript
interface FactifyViewerProps {
  documentUrl: string;          // Path to PDF file
  documentTitle: string;
  onClose?: () => void;         // Back button handler
  vipName?: string;             // For personalized experience
  vipInterests?: string[];      // For walkthrough personalization
  walkthroughSteps?: WalkthroughStep[];
  commentThreads?: ViewerCommentThread[];
  parityMode?: boolean;         // Factify-style header
}
```

## Layout Structure

```
┌─────────────────────────────────────────────────┐
│ Header (toolbar)                                 │
├────────┬──────────────────────┬─────────────────┤
│        │                      │                 │
│ Thumb- │   PDF Content Area   │  Side Panel     │
│ nails  │   (scrollable)       │  (drawer)       │
│ Panel  │                      │                 │
│        │                      │                 │
├────────┴──────────────────────┴─────────────────┤
│ Footer (page navigation)                         │
└─────────────────────────────────────────────────┘
```

## Header / Toolbar

**Left section**:
- Back button (ArrowLeft icon) → calls `onClose`
- Document title (truncated)

**Center section**:
- Page navigation: "Page X of Y" with prev/next buttons
- Zoom controls: zoom out, percentage display, zoom in
- Fit-to-width toggle

**Right section**:
- Search button (opens search overlay)
- Thumbnails toggle button
- Side panel buttons (icons that open different drawers):
  - AI Chat (MessageSquare icon)
  - Comments (MessageCircle icon)
  - Timeline (Clock icon)
  - Versions (GitBranch icon)
  - Analytics (BarChart3 icon)
  - Settings (Settings icon)

**Parity Mode** (when `parityMode=true`):
- Shows a Factify-style header with "Preflight" button
- Matches the real Factify viewer header appearance

## PDF Content Area

- Uses `react-pdf` with `<Document>` and `<Page>` components
- PDF.js worker loaded from `/public/pdf.worker.min.mjs`
- Renders one page at a time (single-page view)
- Scroll to navigate between pages
- Supports zoom (50% to 200%)
- Fit-to-width mode auto-calculates zoom

### Inline Annotations

When `commentThreads` are provided with `pageNumber` and `highlightArea`:
- Colored overlay rectangles appear on the PDF page at the specified coordinates
- Coordinates are percentages of page dimensions (0-100 for top, left, width, height)
- Clicking an annotation opens the Comments drawer scrolled to that thread
- Annotations have a semi-transparent brand-colored background
- Hover shows a tooltip with the quote text

## Thumbnails Panel

- Left side panel, toggleable
- Shows small previews of all pages
- Current page highlighted with brand border
- Click a thumbnail to jump to that page
- Responsive: on mobile, overlays as a bottom sheet

## Side Panel (Drawer System)

The right side panel is a **drawer system** — only one drawer is open at a time. Width: ~360px (desktop), full-width overlay on mobile.

### 1. AI Chat Drawer

**Layout**:
- Chat header with "AI Assistant" title
- Message list (scrollable)
- Input area at bottom with send button

**Features**:
- **Scripted responses** (not real AI) — pattern-matched from `scripted-chat.ts`
- **Chat suggestions**: 3-4 suggested prompts shown initially, based on document topics
- **Tab autocomplete**: While typing, ghost text appears suggesting completion. Press Tab to accept.
- **Citations**: AI responses can include citations that reference specific pages/sections
- **Follow-up suggestions**: After each AI response, 2-3 follow-up questions appear as clickable chips

**Scripted Chat Patterns** (from `scripted-chat.ts`):
- "3 bullets" or "summary" → Returns 3 bullet point summary
- "risk" → Returns risk analysis
- "passage" or "quote" → Returns relevant passage from quote suggestions
- "30-90 days" or "outlook" → Returns short-term outlook
- Default → Generic helpful response

**Message format**:
```typescript
{
  role: "user" | "assistant",
  content: string,
  citations?: { text: string; page: number }[]
}
```

### 2. Comments Drawer

**Layout**:
- Header: "Comments" with count badge
- List of comment threads
- Each thread: quote text, comment list, reply input

**Features**:
- Shows both "app threads" (from banker app) and "local threads" (created in viewer)
- Each thread displays the quoted text with a highlight background
- Comments show: author avatar, name, role badge (banker/vip), text, timestamp
- Reply input with ghost text suggestion (Tab to accept)
- On reply: adds comment to thread locally

**Ghost Text for Replies**:
When VIP starts typing a reply, AI suggests completion text shown in gray. Press Tab to accept the suggestion.

### 3. Timeline Drawer

Shows engagement timeline for the current document:
- When it was shared
- When it was opened
- Reading progress over time
- Time spent on different sections

### 4. Versions Drawer

Shows document version history:
- Version number, date, description
- Link to view previous versions
- Highlight differences (conceptual)

### 5. Analytics Drawer

Shows document analytics:
- Total views
- Average time per page
- Most viewed sections
- Completion rate

### 6. Settings Drawer

Viewer settings:
- Theme (light/dark concept)
- Font size adjustment
- Page layout options

## Walkthrough System

**The "Start Walkthrough" button** appears in the bottom-right corner when `walkthroughSteps` are provided.

**On click**, a guided walkthrough begins:

### Walkthrough Card
- Floating card positioned near the highlighted area
- Shows: step number (e.g., "Step 2 of 5"), title, personalized message
- Navigation: "Previous" / "Next" buttons, "Exit" button
- Progress dots at bottom

### Walkthrough Behavior
1. Card appears with step 1
2. PDF auto-scrolls to the page specified in the step
3. A highlight overlay appears on the `highlightArea` coordinates
4. Personalized message explains why this section matters to the VIP
5. "Next" moves to the next step (auto-scrolls if different page)
6. "Previous" goes back
7. "Exit" or completing all steps ends the walkthrough

### Personalization
Messages use the VIP's name and interests:
- "Based on your interest in {interest}, this section covers..."
- "Hi {name}, given your focus on {interest}..."
- The `personalizeWalkthroughSteps()` function replaces template placeholders

## Mobile Responsive Behavior

At viewport < 480px:
- Header condenses (document title hidden)
- Thumbnails become a bottom sheet overlay instead of side panel
- Side panel (drawers) become full-screen overlays
- PDF auto-fits to viewport width
- Walkthrough card positions at bottom of screen
- Bottom navigation bar replaces some toolbar actions

## CSS Architecture

All viewer styles are prefixed with `.fv-` to avoid collisions with the main app styles:
- `.fv-container` — main wrapper
- `.fv-header` — toolbar
- `.fv-pdf-area` — PDF content zone
- `.fv-side-panel` — drawer container
- `.fv-drawer` — individual drawer
- `.fv-chat-*` — chat-specific styles
- `.fv-comments-*` — comments-specific styles
- `.fv-walkthrough-*` — walkthrough card styles
- `.fv-annotation-*` — inline annotation styles

## FactificationAnimation Component

Used on the landing page after document upload.

**Visual Effect**:
1. Full-screen overlay with dark semi-transparent background
2. Centered card with animated gradient border (rotating colors)
3. Scanning line animation moving top to bottom
4. Floating sparkle particles (small circles with random positions)
5. Progress text cycling through stages:
   - "Analyzing document..."
   - "Extracting key insights..."
   - "Identifying relevant sections..."
   - "Generating recommendations..."
6. Duration: ~3.5 seconds total
7. On completion: calls `onComplete` callback (navigates to `/vips`)
