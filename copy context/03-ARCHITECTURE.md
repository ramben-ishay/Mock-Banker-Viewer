# Architecture & File Structure

## Project Structure

The source code lives inside the `vip-research/` subfolder. The root of the Next.js app is `vip-research/`.

```
vip-research/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout (HTML, fonts, AppShell wrapper)
│   │   ├── page.tsx                  # Landing page — document upload
│   │   ├── globals.css               # Global styles + Tailwind v4 theme
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard with stats overview
│   │   ├── vips/
│   │   │   ├── page.tsx              # VIP list (empty state → populated)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # VIP detail (engagement + recommendations)
│   │   ├── documents/
│   │   │   └── page.tsx              # Documents library grid
│   │   ├── document/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Document analytics page
│   │   └── viewer/
│   │       └── [docId]/
│   │           └── page.tsx          # PDF viewer page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx          # Main app wrapper (sidebar + content)
│   │   │   └── Sidebar.tsx           # Left sidebar navigation
│   │   ├── ui/
│   │   │   ├── Button.tsx            # Button component (4 variants, 4 sizes)
│   │   │   ├── Modal.tsx             # Modal/dialog overlay
│   │   │   ├── Avatar.tsx            # Initials avatar with color
│   │   │   ├── Badge.tsx             # Status badges
│   │   │   ├── Tag.tsx               # Colored tags
│   │   │   ├── Input.tsx             # Text input
│   │   │   ├── Textarea.tsx          # Textarea
│   │   │   ├── Toast.tsx             # Toast notification
│   │   │   ├── Spinner.tsx           # Loading spinner
│   │   │   └── Skeleton.tsx          # Skeleton loading placeholder
│   │   ├── vips/
│   │   │   ├── VipListPage.tsx       # VIP list page component
│   │   │   ├── VipCard.tsx           # VIP card in grid
│   │   │   └── AddVipModal.tsx       # Add VIP form with Tab autocomplete
│   │   ├── recommendations/
│   │   │   ├── RecommendationCard.tsx  # AI recommendation card
│   │   │   ├── ShareModal.tsx          # Share with quotes/comments
│   │   │   └── DocumentShareModal.tsx  # Multi-VIP document share
│   │   ├── engagement/
│   │   │   ├── EngagementStats.tsx     # Stats cards row
│   │   │   ├── EngagementTimeline.tsx  # Vertical engagement timeline
│   │   │   └── AiInsightBanner.tsx     # AI insight banner (positive/negative)
│   │   ├── comments/
│   │   │   └── CommentsPanel.tsx       # Threaded comments panel
│   │   └── viewer/
│   │       ├── FactifyViewer.tsx       # Main PDF viewer component
│   │       ├── FactifyViewer.css       # Viewer-specific styles (fv- prefix)
│   │       ├── FactificationAnimation.tsx  # Upload animation
│   │       └── types.ts               # Viewer-specific types
│   └── lib/
│       ├── types.ts                  # All TypeScript interfaces
│       ├── mock-data.ts              # All mock data (~2200 lines)
│       ├── vip-context.tsx           # React Context + useReducer state
│       ├── utils.ts                  # Utility functions
│       └── scripted-chat.ts          # AI chat scripted responses
├── public/
│   ├── pdfs/                         # 15 JP Morgan research PDFs
│   ├── fonts/                        # Satoshi Variable font
│   └── pdf.worker.min.mjs           # PDF.js worker
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## Routing

| Route | Page File | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Landing page — drag & drop upload, Factification animation |
| `/dashboard` | `app/dashboard/page.tsx` | Stats overview, attention needed, most engaged |
| `/vips` | `app/vips/page.tsx` | VIP grid with CRM connection + manual add |
| `/vips/[id]` | `app/vips/[id]/page.tsx` | VIP detail — engagement + recommendations + comments |
| `/documents` | `app/documents/page.tsx` | Document library grid with search |
| `/document/[id]` | `app/document/[id]/page.tsx` | Document analytics — recipients, engagement |
| `/viewer/[docId]` | `app/viewer/[docId]/page.tsx` | PDF viewer (supports `?vipId=` and `?parity=0` query params) |

## State Management

### React Context + useReducer

The app uses a single `AppProvider` context that wraps the entire application.

**File**: `src/lib/vip-context.tsx`

**State shape**:
```typescript
interface AppState {
  vips: VIP[]                                    // All VIP clients
  isConnected: boolean                           // CRM connected?
  recommendations: Record<string, Recommendation[]>  // VIP ID → recommendations
  commentThreads: Record<string, CommentThread[]>    // VIP ID → comment threads
  engagementTimelines: Record<string, TimelineEntry[]> // VIP ID → timeline
  toasts: Toast[]                                // Active toast notifications
}
```

**Actions (reducer)**:
| Action | What It Does |
|--------|-------------|
| `CONNECT_CRM` | Sets `isConnected=true`, populates VIPs with mock data |
| `ADD_VIP` | Adds a new VIP to the list, generates recommendations |
| `SHARE_DOCUMENT` | Marks recommendation as shared, adds timeline entry, creates comment threads |
| `DISMISS_RECOMMENDATION` | Marks a recommendation as dismissed |
| `ADD_REPLY` | Adds a reply to a comment thread |
| `ADD_THREAD_REPLY` | Adds a reply to a specific thread by ID |
| `ADD_TOAST` | Shows a toast notification |
| `REMOVE_TOAST` | Removes a toast |

**Persistence**: State is saved to `localStorage` under key `"vip-research-state"`. On init, it loads from localStorage if available. Cross-tab sync via `window.addEventListener("storage", ...)`.

### Data Flow

1. **App loads** → Context reads from localStorage (or uses defaults)
2. **CRM Connect** → `CONNECT_CRM` populates VIPs from mock data
3. **Add VIP** → `ADD_VIP` creates VIP + auto-generates recommendations
4. **View VIP** → Page reads context for VIP data, recommendations, comments, timeline
5. **Share Document** → `SHARE_DOCUMENT` updates recommendation, creates timeline entry, creates comment threads from approved quotes
6. **Toast** → `ADD_TOAST` with auto-dismiss timer (4s)

### No External State Libraries
No Redux, Zustand, or Jotai. Pure React Context + useReducer. This is intentional — the app is a prototype with relatively simple state.
