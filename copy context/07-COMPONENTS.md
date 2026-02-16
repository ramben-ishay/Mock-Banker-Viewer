# Components — Detailed Spec

## Layout Components

### AppShell (`src/components/layout/AppShell.tsx`)

Wraps the entire app. Contains:
- `AppProvider` (React Context)
- `Sidebar` (conditionally hidden for `/viewer` and `/` routes)
- Main content area
- Toast container (positioned bottom-right)

**Behavior**:
- Uses `usePathname()` to detect current route
- Hides sidebar when pathname starts with `/viewer` or is exactly `/`
- Toast container renders active toasts from context

### Sidebar (`src/components/layout/Sidebar.tsx`)

Left sidebar navigation. Fixed width (~240px).

**Sections**:
1. **Logo/Brand**: "VIP Research" text logo at top
2. **Navigation Links**:
   - My VIPs (`/vips`) — Users icon
   - Documents (`/documents`) — FileText icon
   - Dashboard (`/dashboard`) — BarChart3 icon
   - Active link has brand-colored background
3. **User Profile Footer**:
   - Avatar with initials "JD" (the banker)
   - Name: "John Doe"
   - Role: "Senior Banker"
4. **Reset Demo Button**: Clears localStorage and reloads — resets all state

---

## UI Components (`src/components/ui/`)

### Button
**Props**: `variant`, `size`, `disabled`, `onClick`, `children`, `className`, `icon`

**Variants**:
- `primary`: Brand 500 bg, white text
- `secondary`: White bg, neutral-300 border, dark text
- `tertiary`: Transparent bg, dark text, hover gray bg
- `destructive`: Red-700 bg, white text

**Sizes**: `xsm` (24px), `sm` (32px), `md` (40px), `lg` (48px)

### Modal
**Props**: `isOpen`, `onClose`, `title`, `children`, `maxWidth`

- Overlay: semi-transparent dark backdrop
- Centered dialog with rounded corners (16px)
- Close button (X) in top right
- ESC key closes
- Framer Motion enter/exit animation (fade + scale)

### Avatar
**Props**: `initials`, `color`, `size`

- Circle with background color
- White text initials centered
- Sizes: sm (32px), md (40px), lg (48px)

### Badge / Tag
**Props**: `variant`, `children`, `size`

**Variants**: `green`, `orange`, `red`, `blue`, `neutral`
- Each uses the corresponding status color (light bg, medium text)

### Input
**Props**: `label`, `error`, `success`, `placeholder`, `value`, `onChange`, etc.

- Standard text input with label above
- Border changes color on hover/focus/error/success
- Focus: Brand 300 border

### Textarea
Same as Input but multi-line. Used for communication notes, personalized messages.

### Toast
**Props**: `type`, `message`, `onDismiss`

**Types**: `success` (green), `info` (blue), `warning` (orange), `danger` (red)
- Fixed position bottom-right
- Auto-dismisses after 4 seconds
- Slide-in animation from right

### Spinner
Simple SVG spinner with brand color. Sizes: sm, md, lg.

### Skeleton
Pulsing gray rectangle for loading states. Accepts `width`, `height`, `borderRadius`.

---

## VIP Components (`src/components/vips/`)

### VipListPage
The main component rendered on the `/vips` page.

**States**:
1. **Not Connected**: Shows CRM connection UI with Salesforce/HubSpot buttons
2. **Connected, No VIPs**: Shows empty state with "Add VIP" CTA
3. **Connected, Has VIPs**: Shows search bar + grid of VipCards

**Search**: Filters VIPs by name, company, or interests (case-insensitive).

### VipCard
Displays a single VIP in the grid.

**Layout**:
- Avatar (left)
- Name, role, company (center)
- Interest tags (first 3, overflow hidden)
- Stats row at bottom: docs shared, completion %, last active (relative date)
- Entire card is clickable → navigates to `/vips/[id]`
- Hover: subtle shadow elevation

### AddVipModal
Modal form for adding a new VIP manually.

**Key Feature — Progressive Tab Autocomplete**:
This is a showpiece interaction for the demo. When the user types a name and presses Tab:
1. First Tab: autocompletes the **name** from predefined suggestions
2. Second Tab: fills in **email** with typewriter animation
3. Third Tab: fills in **interests** with typewriter animation
4. Fourth Tab: fills in **communication notes** with typewriter animation

**Implementation**:
- Listens for `Tab` keydown on each field
- Matches partially typed name against `PREDEFINED_VIP_SUGGESTIONS`
- When a suggestion matches, fills subsequent fields with animated typing
- Shows a "CRM" badge when autocomplete activates (indicating data from CRM)
- Each field animates independently with slight delays

**Fields**: Name (required), Email (required), Company, Role, Interests (textarea), Communication Notes (textarea)

**On Submit**: Dispatches `ADD_VIP` action → generates default recommendations.

---

## Recommendation Components (`src/components/recommendations/`)

### RecommendationCard
Displays a single AI recommendation.

**Layout**:
- Document title (bold)
- Relevance score badge (color-coded: green >70, orange 40-70, red <40)
- AI explanation text (1-2 sentences)
- Action buttons: "Share with [VIP]", "View in Factify", "Dismiss"

**Relevance Score Colors**:
- 70-100: Green badge
- 40-69: Orange badge
- 0-39: Red badge

### ShareModal
Opened when banker clicks "Share with VIP" on a recommendation.

**Layout**:
1. Header: "Share [Document Title] with [VIP Name]"
2. Personalized message textarea (pre-filled with AI suggestion)
3. **Quote Suggestions Section**:
   - Heading: "Suggested Highlights"
   - List of quote suggestions from `QUOTE_SUGGESTIONS` for this document
   - Each quote shows: quoted text, page reference, comment input
   - "Approve" and "Reject" buttons per quote
   - Approved quotes become comment threads on the shared document
4. Send button

**On Send**:
- Dispatches `SHARE_DOCUMENT` action
- Creates comment threads from approved quotes
- Adds timeline entry (actionType: "shared")
- Shows success toast

### DocumentShareModal
For sharing a document update with multiple VIPs at once.

**Layout**:
- Document title + version badge
- Checkbox list of VIPs
- Personalized message textarea
- Send button

Used when a document has a version update and the banker wants to re-share with previous recipients.

---

## Engagement Components (`src/components/engagement/`)

### EngagementStats
Row of 3 stat cards for a VIP:
- **Docs Shared**: Total count with FileText icon
- **Avg Completion**: Percentage with BarChart3 icon
- **Last Active**: Relative date with Clock icon

### EngagementTimeline
Vertical timeline showing a VIP's document interactions.

**Layout**:
- Vertical gradient line (brand colors) on the left
- Each entry: date, document title, action badge, optional progress bar
- Action badges: "Shared" (blue), "Opened" (green), "Read XX%" (green with bar), "Not Opened" (red)
- Progress bar shows completion percentage for "read" entries
- Click on a "read" entry → link to viewer with that document + VIP

**Sorting**: Newest first.

### AiInsightBanner
Colored banner showing an AI insight about a VIP.

**Positive** (green background):
- TrendingUp icon
- Title: e.g., "Deep Engagement Detected"
- Body: descriptive text

**Negative** (orange background):
- TrendingDown icon
- Title: e.g., "Engagement Declining"
- Body: descriptive text with actionable suggestion

---

## Comments Components (`src/components/comments/`)

### CommentsPanel
Slide-over panel showing all comment threads for a VIP.

**Layout**:
- Slide-in from right side (drawer style)
- Header with "Comments" title and close button
- Search bar to filter threads
- List of comment threads

**Each Thread**:
- Document title link
- Quoted text (highlighted background)
- Page reference
- List of comments (author avatar, name, role badge, text, timestamp)
- Reply input at bottom of each thread
- Ghost text suggestion in reply input (Tab to accept)

**Empty State**: "No comments yet" with explanation.

**On Reply**: Dispatches `ADD_THREAD_REPLY` action.
