# Pages & Routes — Detailed Spec

## Root Layout (`src/app/layout.tsx`)

- Sets HTML lang="en"
- Loads Inter font via `next/font/google`
- Loads Satoshi Variable via `<link>` to Fontshare CDN
- Imports `globals.css`
- Wraps children in `<AppShell>` component
- AppShell conditionally hides sidebar for `/viewer` and `/` routes

---

## Page 1: Landing Page (`/`)

**File**: `src/app/page.tsx`

**Purpose**: Entry point — banker uploads research documents.

**Layout**:
- Full-screen centered layout (no sidebar)
- Factify logo at top
- Large heading: "Upload Your Research"
- Subheading: "Drag and drop your research documents to get started"

**Features**:
- Drag & drop zone for PDFs
- File validation: PDF only, max 25MB per file
- On successful upload, triggers **Factification Animation**:
  - A `FactificationAnimation` component covers the screen
  - Shows a gradient border card with scanning overlay effect
  - Floating sparkle particles
  - Progress text: "Analyzing document..." → "Extracting key insights..." → "Generating recommendations..."
  - Duration: ~3.5 seconds
  - On completion, navigates to `/vips`

**Click Upload**: Also has a "Browse files" button as alternative to drag & drop.

---

## Page 2: Dashboard (`/dashboard`)

**File**: `src/app/dashboard/page.tsx`

**Purpose**: Overview of the banker's research distribution activity.

**Layout**: Sidebar visible. Main content area with stat cards and tables.

**Sections**:

1. **Stats Row** (4 cards):
   - Total VIPs (count)
   - Research Library (document count)
   - Total Shared (sum of all docs shared to all VIPs)
   - Avg Completion (average across all VIPs)

2. **Attention Needed** card:
   - Shows VIPs with negative AI insights
   - VIP name, insight title, and link to VIP detail

3. **Most Engaged VIP** card:
   - Shows VIP with highest avg completion
   - Name, completion %, last active date

4. **Engagement Overview** table:
   - All VIPs listed with: name, docs shared, avg completion, last active, status badge

---

## Page 3: VIP List (`/vips`)

**File**: `src/app/vips/page.tsx` (delegates to `VipListPage` component)

**Purpose**: View and manage VIP clients.

**Empty State** (when `!isConnected`):
- Heading: "Connect Your CRM"
- Subheading: "Import your VIP clients to get started"
- Two CTA buttons with logos:
  - "Connect to Salesforce" (Salesforce cloud icon)
  - "Connect to HubSpot" (HubSpot sprocket icon)
- On click: 2-second loading spinner → `CONNECT_CRM` action → populates VIPs
- Also shows: "+ Add VIP Manually" button

**Populated State** (when `isConnected`):
- Search bar at top (filters by name, company, interests)
- Grid of `VipCard` components (responsive: 1-3 columns)
- "+ Add VIP" button in header
- Each card links to `/vips/[id]`

**VipCard** shows:
- Avatar (initials with color)
- Name and role
- Company
- Interest tags (first 3, truncated)
- Stats row: docs shared, avg completion %, last active

---

## Page 4: VIP Detail (`/vips/[id]`)

**File**: `src/app/vips/[id]/page.tsx`

**Purpose**: Deep dive into a specific VIP — engagement data, recommendations, and comments.

**Layout**: Single scrollable page (no tabs).

**Header**:
- Back button to `/vips`
- VIP name, role, company
- Avatar
- Quick info: AUM, last meeting date

**Profile Section**:
- Reading profile description
- Communication notes
- Interest tags
- Past communications list (date, type badge, summary)

**Engagement Section**:
- **EngagementStats**: 3 stat cards (Docs Shared, Avg Completion, Last Active)
- **AiInsightBanner**: Positive (green) or negative (orange) AI insight
- **Suggested Actions**: List of action buttons (call, email, share)
- **EngagementTimeline**: Vertical timeline with gradient line
  - Each entry: date, document title, action badge, progress bar
  - Click opens viewer for that document

**Recommendations Section**:
- Heading: "Recommended Research"
- List of `RecommendationCard` components
- Each shows: document title, relevance score badge, AI explanation
- Actions per card: "Share with [VIP Name]", "View in Factify", "Dismiss"
- "Share" opens `ShareModal`
- "Dismiss" triggers `DISMISS_RECOMMENDATION`

**Comments Panel** (slide-over from right):
- Toggle button: "View Comments"
- Shows all comment threads for this VIP
- Each thread: quote text, list of comments (banker + VIP), reply input
- Threads link to the document viewer at the relevant page

---

## Page 5: Documents Library (`/documents`)

**File**: `src/app/documents/page.tsx`

**Purpose**: Browse all uploaded research documents.

**Layout**: Grid of document cards with search.

**Each Document Card** shows:
- Document title
- Version badge (if applicable, e.g., "v2" in orange)
- Topics as tags
- Publication date
- Actions: "Open in Factify" (link), "View Analytics" (link to `/document/[id]`)

**Version Alert**: Documents with version updates show a banner suggesting to share the updated version with relevant VIPs. This opens `DocumentShareModal`.

---

## Page 6: Document Analytics (`/document/[id]`)

**File**: `src/app/document/[id]/page.tsx`

**Purpose**: See who engaged with a specific document and how.

**Stats Row** (5 cards):
- Total Recipients
- Read (count and %)
- Opened (count and %)
- Not Opened (count and %)
- Avg Completion Rate

**VIP Engagement Table**:
- Lists all VIPs who received this document
- Columns: VIP name, status (Read/Opened/Not Opened), completion %, date shared
- Click VIP name → navigate to VIP detail
- Click "Open Viewer" → navigate to viewer

**Pending Recommendations**:
- VIPs who haven't received this document yet but are recommended
- Shows recommendation card with share action

---

## Page 7: PDF Viewer (`/viewer/[docId]`)

**File**: `src/app/viewer/[docId]/page.tsx`

**Purpose**: Full-screen PDF viewer simulating the VIP's reading experience.

**URL Parameters**:
- `[docId]` — which document to display
- `?vipId=xxx` — (optional) which VIP is viewing, for personalization
- `?parity=0` — (optional) disables parity mode header

**This page**:
- Hides the sidebar (full screen)
- Finds the document and VIP from context/mock data
- Personalizes walkthrough steps using `personalizeWalkthroughSteps()`
- Converts comment threads to viewer format
- Renders the `FactifyViewer` component

(See `09-VIEWER.md` for the full FactifyViewer specification.)
