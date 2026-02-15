# Factify Document Viewer Design Reference

Captured from: https://d.factify.com/documents/019c48ca-86c4-7985-b83b-fb0de9abaa71
Date: 2026-02-11
Viewport: 1440x900 @2x (Retina)

---

## Overall Layout

The Factify document viewer uses a **three zone layout**:

1. **Top Header Bar** (full width, 40px height, white background)
2. **Main Content Area** (below header, 1400x860px)
   - **Document Viewer** (center, takes remaining space)
   - **Right Icon Sidebar** (40px wide, fixed right edge)
   - **Expandable Side Panel** (420px wide, overlays from right when a sidebar icon is clicked)
3. **Floating Elements** (support chat button bottom left, document summary popup)

```
+-------------------------------------------------------------------+
| [Logo] Document_Name                  [Preflight] [Share] [Avatar]|  <- Header (40px)
+-------------------------------------------------------------------+
| [Thumbnails] |                                    |  [AI icon]    |
|    nav       |     PDF Document Viewer            |  [Comments]   |
|   (hidden    |     (centered, with shadow)        |  [Timeline]   |
|    by        |                                    |  [Versions]   |
|    default)  |  +--Page Navigation Bar--+         |  [Analytics]  |
|              |  | Page 1/4  - 101% +    |  DL P Q |  [Settings]   |
|              |  +------------------------+        |               |
|              |                                    |  <- 40px wide |
|  [?] help   |                                    |               |
+-------------------------------------------------------------------+
```

---

## Color Palette

| Element | Background | Text Color | Notes |
|---------|-----------|------------|-------|
| Header | `#FFFFFF` (white) | `rgb(17, 18, 20)` dark | Clean white header |
| Document area (main) | `rgb(242, 245, 250)` = `#F2F5FA` | `rgb(0, 0, 0)` | Light blue gray bg |
| Right sidebar panel bg | `rgb(249, 250, 252)` = `#F9FAFC` | | Slightly lighter |
| Chat panel (Ask AI aside) | `#FFFFFF` (white) | `rgb(0, 0, 0)` | White panel |
| Buttons (icon) | `rgba(196, 203, 220, 0)` transparent | `rgb(17, 18, 20)` | Transparent bg with dark icons |
| Links | | `rgb(68, 74, 255)` = `#444AFF` | Factify brand blue/purple |
| Body text | | `rgb(17, 18, 20)` = `#111214` | Near black |
| Document page bg | `#FFFFFF` | | White page with shadow |
| Factify logo bg | `rgb(242, 245, 250)` = `#F2F5FA` | | Matches main bg |

### Full Color Token Reference (extracted from inline styles)
- **Primary accent**: `#444AFF` (blue/purple, used for links, active AI icon, star icons)
- **Dark text**: `#111214` (near black, primary text)
- **Secondary icon color**: `#545666` (used for close icons, inactive UI)
- **Disabled text**: `#878BA4` (muted gray purple)
- **Border color**: `#DADFEB` (light gray border on outlined buttons)
- **Border color (focus/active)**: `#E6EAF2` (slightly lighter)
- **Button hover bg**: `#C4CBDC26` (very transparent gray blue)
- **Button active/press bg**: `#C4CBDC40` (slightly more opaque)
- **Document Summary card bg**: `rgba(255, 255, 255, 0.5)` (semi transparent white)
- **Share button border**: `rgb(218, 223, 235)` = `#DADFEB`
- Active sidebar icon: has `.gtnfe40.g55kzq.acvjrk6` classes (indicates active/selected state with a light purple highlight bg)

---

## Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|------------|
| Body / Default | `Inter, "Inter Fallback", sans-serif` | 16px | 400 | normal |
| Document title in header | `inter, sans-serif` | 16px | 400 | 24px |
| H3 (protection dialog) | `inter` | 18px | 600 | 24px |
| Body paragraphs | `inter` | 16px | 400 | normal |
| Input fields | `inter, sans-serif` | 14px | 400 | 18px |
| Small links | `inter, sans-serif` | 12px | 400 | 16px |
| Chat "Welcome!" title | bold/600 | | | |
| Chat subtitle text | regular weight | | | |

**Secondary font**: `Satoshi` is loaded (class `satoshifont_...`) but Inter appears primary.

---

## Header / Toolbar (40px tall)

**Layout**: `display: flex; gap: 8px; padding: 4px 8px;`

**Left section** (flex):
- **Factify logo** (24x24px) in a rounded square with `#F2F5FA` bg
- **Document name** as editable text span: "JP_Research_ESG_Clean_Energy_2026_Sector_Review"

**Right section** (flex):
- **Preflight button** (32x32, icon only, transparent bg, 8px border radius)
- **Share button** (84x32, text + globe icon, outlined style)
  - Green dot indicator next to it
- **User avatar** (24x24, circular, with guest avatar for anonymous users)

### Sub toolbar (Page Navigation Bar, below header)
Inside the main content area, just below the header, there's a secondary toolbar:

**Left**: Thumbnail toggle button (24x24)

**Center**:
- "Page" label + page number input (editable, 30x22) + " / 4" text
- Zoom out button (24x24)
- Zoom level input (shows "101%", 50x22)
- Zoom in button (24x24)

**Right** (end of nav):
- Download button (24x24)
- Print button (24x24)  
- Search button (24x24)

All icon buttons: `border-radius: 8px`, no border, transparent bg, 32x32 or 24x24

---

## Document Viewer Area

- Background: `#F2F5FA` (light blue gray)
- Document pages rendered as white rectangles centered in the viewer
- Pages have a subtle **drop shadow** effect
- The document content appears to be rendered as a protected PDF (canvas based)
- **Page break behavior**: pages appear as separate white cards with gray space between them
- The current page has a slightly folded corner effect (decorative)
- Border radius on main area: `16px 0px 0px 0px` (top left rounded)

### Document Page Rendering
- White page sitting on the light blue gray background
- Visible shadow around the page edges
- Page occupies approximately 710px width in the 1400px main area
- Slight margin/padding around the page from the background

---

## Right Icon Sidebar ("Workspace side panel")

- **Position**: Fixed right edge, 40px wide, full height (860px)
- **Element**: `<aside role="toolbar" aria-label="Workspace side panel">`
- **Icons** (top to bottom, each 32x32 with 8px border radius):

1. **Ask AI** (sparkle icon) — `aria-label="Ask AI sidebar"` — ENABLED, active state has purple/blue highlight
2. **Comments** (speech bubble icon) — `aria-label="Comments sidebar"` — disabled for guests
3. **Timeline** (clock icon) — `aria-label="Timeline sidebar"` — disabled for guests
4. **Document Versions** (copy/stack icon) — `aria-label="Document Versions sidebar"` — disabled
5. **Document Analytics** (bar chart icon) — `aria-label="Document Analytics sidebar"` — disabled
6. **Document Settings** (gear icon) — `aria-label="Document Settings sidebar"` — disabled

**Active icon styling**: The active icon (Ask AI when selected) uses classes `.gtnfe40.g55kzq.acvjrk6` which applies a purple/blue tint background

---

## AI Chat Panel (the "Ask AI" Sidebar)

### Panel Layout
- **Position**: absolute, overlays from right side
- **Width**: 420px
- **Height**: 860px (full height of main area)
- **Background**: white (`#FFFFFF`)
- **Element**: `<aside class="s4u2ggh">`

### Panel Structure (top to bottom)

#### 1. Header (48px tall)
```
[Sparkle Icon] Ask AI              [...menu] [X close]
```
- Title: "Ask AI" with sparkle/stars icon (20x20 SVG)
- Three dot menu button (32x32) — "Toggle AI assistant menu"
- Close X button (32x32) — "Close Ask AI drawer"

#### 2. Chat Conversation Area (scrollable, ~740px)
- `<div role="log" aria-label="Chat conversation">`

**Welcome Message** (centered):
- Large chat bubble SVG icon (80x80, gray/dark)
- "Welcome!" — bold, centered
- "I've read this document so you don't have to, so ask me anything! What do you want to know about it?" — regular weight, centered

**Document Summary Card** (below welcome):
- Card with subtle border/shadow
- Header: sparkle icon + "Document Summary" (bold)
- Body: AI generated summary paragraph
- The card has a "show more" chevron to expand truncated text

**Follow up Suggestions** (below summary):
- 3 suggestion buttons, each ~69px tall
- Full width (388px within padding)
- Text wraps within the button
- Examples:
  - "What are the key policy drivers and regulatory developments shaping clean energy investment in the U.S. and Europe according to this report?"
  - "How does the report expect renewable energy capacity to be distributed across solar, wind, storage, and other technologies in 2026?"
  - "What is J.P. Morgan's investment stance on utilities and renewable developers, and what criteria do they emphasize for selection?"

**Scroll to bottom button**: Small circular button with down arrow at the bottom of the scroll area

#### 3. Input Area (72px tall)
- `<section>` containing a `<form>`
- Text input: `<span role="textbox" aria-label="Ask a question about this document">`
- Placeholder: "Ask me anything about this document"
- Send button (32x32, circular, with up arrow icon): `aria-label="Send message"`
- The input has a border with rounded corners
- Send button appears to use the accent color

---

## Document Summary Popup (floating)

When the page first loads, a floating popup appears over the document:

- **Position**: floating card, approximately 447x452px
- **Position on screen**: right side, vertically centered (around x=977, y=432)
- **Background**: white with shadow
- **Border radius**: rounded corners (8px)
- **Content**:
  - Sparkle icon + "Document Summary" header
  - AI generated summary text
  - "Chat With AI" button at the bottom (full width, accent colored)
- **Close button**: X in top right corner

---

## Support Chat Button

- **Position**: Bottom left corner (16px from left, 844px from top)
- **Size**: 40x40px
- **Icon**: Question mark (?) in a circle
- **Purpose**: Opens Intercom support chat
- **Element**: `<button aria-label="Toggle support chat">`

---

## Page Thumbnails Sidebar

When the "Show thumbnails" button (list icon, top left of the page nav bar) is clicked, a left sidebar opens showing page thumbnails:

- Each thumbnail is approximately 86x111px
- Active page thumbnail has a **blue/purple border** highlight
- Page number displayed below each thumbnail
- Thumbnails show actual miniature renderings of each page
- The sidebar pushes the document viewer slightly to the right
- From the thumbnails, you can see the 4 page document contains:
  - Page 1: Title/cover page (JP Morgan logo, title, date)
  - Page 2: Content page with small dark chart elements
  - Page 3: Bar chart page (data visualization)
  - Page 4: Text heavy page with smaller text

---

## Search Bar

When the search (magnifying glass) icon is clicked:

- A search input appears in the top right area of the page nav bar
- Placeholder: "Search in document..."
- Up/down arrow buttons for navigating between results
- Close (X) button to dismiss
- The search bar appears as a floating input with rounded corners and subtle shadow

---

## Key Screenshots Reference

| Screenshot | What It Shows |
|-----------|--------------|
| `01_full_page_view.png` | Full viewer with Document Summary popup visible |
| `11_clean_document_view.png` | Clean viewer after closing the summary popup |
| `13_ai_chat_sidebar_open.png` | Full view with AI Chat panel open (doc compresses left) |
| `14_ai_chat_panel_detail.png` | Close up of the AI Chat panel contents |
| `02_toolbar.png` | Close up of the header toolbar |
| `21_thumbnails_sidebar.png` | Left sidebar with page thumbnails visible |
| `23_search_open.png` | Search bar open in the page navigation area |
| `24_right_sidebar_icons.png` | Close up of all right sidebar icons |

---

## Interactive Element Inventory

### Header Row
- Factify logo link (24x24, navigates home)
- Document name (editable span)
- Preflight button (32x32)
- Share button (84x32, with green dot and globe icon)
- User avatar (24x24)

### Page Navigation Row
- Show thumbnails toggle (24x24)
- Page indicator "Page [input] / 4"
- Zoom out (24x24)
- Zoom level input (50x22, shows "101%")
- Zoom in (24x24)
- Download (24x24)
- Print (24x24)
- Search in document (24x24)

### Right Sidebar (6 icon buttons, each 32x32)
- Ask AI (enabled)
- Comments (disabled for guests)
- Timeline (disabled for guests)
- Document Versions (disabled for guests)
- Document Analytics (disabled for guests)
- Document Settings (disabled for guests)

### Chat Panel
- Menu button (three dots)
- Close button (X)
- 3 suggestion buttons
- Text input with send button

### Floating
- Support chat button (bottom left, 40x40)
- Document Summary popup (can be dismissed)

---

## Notes for Prototype Implementation

1. **The document viewer renders PDFs as white pages on a light blue gray background** — for the prototype, render mock content as white cards with shadow on `#F2F5FA` background.

2. **The AI Chat panel slides in from the right at 420px width**, compressing the document viewer. It uses white background and the same Inter font family.

3. **The chat has a welcoming empty state** with a large icon, welcome text, document summary, and 3 suggested questions. This is the initial state before any conversation.

4. **The input field** at the bottom says "Ask me anything about this document" with a circular send button.

5. **The right icon sidebar is always visible** (40px wide) and serves as the primary navigation for switching between AI, Comments, Timeline, Versions, Analytics, and Settings panels.

6. **The header is minimal** (40px) with document name, share, and user avatar. Page navigation is in a secondary bar below the header but within the main content area.

7. **Font is Inter** throughout, with sizes ranging from 12px (small links) to 18px (headings), primarily 16px for body text.

8. **Button styling**: 8px border radius, transparent backgrounds for icon buttons, no visible borders. 32x32 for icon buttons, 24x24 for toolbar icons.

9. **The document has screen capture protection** ("Content protection active") but this should not be implemented in the prototype.

10. **Color scheme is very neutral**: white, light blue grays (`#F2F5FA`, `#F9FAFC`), with `#444AFF` as the only accent color for links and active states.
