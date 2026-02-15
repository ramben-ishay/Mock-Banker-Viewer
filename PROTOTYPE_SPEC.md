# VIP Research Distribution Platform — Frontend Prototype Spec

Build a **frontend only** Next.js prototype (App Router, React, TypeScript, Tailwind CSS, Framer Motion). All data is mock/in memory. No backend, no API calls. Three flows, five to seven screens total.

### Sample Documents
1. "Q1 2026 Global Semiconductor Outlook" (v2, topics: Semiconductors, AI chips, TSMC)
2. "AI Infrastructure: The $500B Capex Cycle" (topics: Cloud, Data centers, Capex)
3. "URGENT: US China Export Controls Impact" (topics: Geopolitics, China tech, Export controls)
4. "ESG and Clean Energy: 2026 Sector Review" (topics: ESG, Renewables, Green bonds)
5. "Emerging Markets Fixed Income Outlook" (topics: Bonds, EM debt, India)

---

## Flow 1: Connect CRM → Add VIP → View Recommendations → Share → View Document

### Screen 1A: My VIPs (Empty State)
Banker lands on `/vips`. The list is empty. Two CTA buttons:
- **"Connect to Salesforce"** (with Salesforce logo)
- **"Connect to HubSpot"** (with HubSpot logo)

On click of either, simulate a loading spinner (2s) then populate the list with the 5 mock VIPs. Also show an **"+ Add VIP Manually"** button.

### Screen 1B: Add VIP Modal
Modal form with fields: **Name** (required), **Email** (required), **Interests** (textarea, free text), **Communication Notes** (optional). On submit, new VIP appears in the grid.

### Screen 1C: VIP Detail
Banker clicks on a VIP card → navigates to `/vips/[id]`. This is a single scrollable page (no tabs) that shows both engagement data and recommendations together.

**Top section: Engagement** (see Flow 2, Screen 2B for full detail on engagement summary cards, timeline, AI insight banner, and suggested actions).

**Below engagement: Recommendations section** with heading "Recommended Research". Shows a list of 2 to 3 AI generated recommendation cards, each containing:
- Document title
- Relevance score (0 to 100) with color coded badge (green > 70, orange 40 to 70, red < 40)
- AI explanation (1 to 2 sentences combining why this matches the VIP's interests **and** their historical engagement with similar documents, e.g., "Sarah has strong interest in semiconductors and read 92% of the last TSMC report you shared")
- **"Share with VIP"** button
- **"Dismiss"** button

### Screen 1D: Share Confirmation
On clicking "Share with VIP", a modal appears:
- Shows document title and VIP name
- Editable **personalized message** textarea (pre filled with AI suggestion)
- **"Add a Comment"** button that expands to show a list of AI suggested quotes pulled from the document text (3 to 4 key passages). Each quote has an input field for the banker's comment and **"Approve"** / **"Reject"** buttons. Approving attaches the quote + comment as an annotation on the shared document. Rejecting removes that suggestion.
- **"Send"** button

### Screen 1D2: Comments View (In App)
After sharing, the banker can view all comments directly inside the application without navigating to the actual document. This is an in app panel or page section showing:
- A list of **all annotated quotes** from the document, each displaying:
  - The highlighted quote text
  - The **banker's comment** (with banker avatar, name, timestamp)
  - The **VIP's reply/comment** if any (with VIP avatar, name, timestamp). Mock 1 to 2 VIP replies to show the conversation feel.
- Comments are threaded under each quote (banker comment → VIP reply → banker reply, etc.)
- A **"Reply"** input field under each thread for the banker to continue the conversation
- This view lives within the VIP detail page or as a slide over panel, so the banker never leaves the app to read or respond to comments

On send, show a success toast: "Research shared with [VIP Name]".

### Screen 1E: Document Viewer
This screen simulates **the VIP's reading experience** after receiving the shared research. It shows what the VIP would see when they open the document link. This is not the banker's view; it is a preview/demo of the end recipient experience.

> **Important**: This view should mock the Factify document viewer UI as closely as possible, replicating the look and feel of the real Factify reading experience. Reference screenshots will be provided in the `/reference_screenshots/` folder to guide the exact layout, typography, toolbar, and annotation styles. Use those as the source of truth for the visual design of this screen.

This is the **core differentiator screen**. It shows:
1. **Document content** rendered as a scrollable PDF viewer (mock a realistic multi page research PDF with page breaks, headers, footers, page numbers)
2. **Banker's annotation/comment** highlighted inline — a yellow highlighted section of text with a sidebar comment bubble showing the banker's note (e.g., "This section on TSMC's 3nm capacity is directly relevant to your portfolio positioning")
3. **Personalized Walkthrough**: A floating **"Start Walkthrough"** button sits in the bottom right corner of the screen. When the VIP clicks it, a guided step by step walkthrough begins, auto scrolling the PDF to the most important sections based on the VIP's interests. Each step shows a tooltip/callout explaining why this section matters to them (e.g., "Based on your interest in semiconductors, this section covers TSMC's 3nm capacity expansion"). The VIP can navigate between steps with "Next" / "Previous" buttons or exit the walkthrough at any time.
4. **Chat panel** on the right side (collapsible drawer, 320px wide). This should replicate the exact look and feel of the Factify chat UI. 

---

## Flow 2: Returning Banker → VIP Engagement → Decline Insight → Take Action

### Screen 2A: My VIPs (Populated)
Banker returns to `/vips`. Grid of VIP cards, each showing:
- Avatar (initials, color coded)
- Name
- Engagement badge: **Hot** (green), **Warm** (orange), **Cold** (red)
- Interest tags (truncated to 3)
- Quick stats: docs shared count, last active date

Search bar + filter by engagement level.

### Screen 2B: VIP Detail (same page as Flow 1, Screen 1C)
Banker clicks on an existing VIP (e.g., Fatima Al Rashid, who is "Cold"). The top section of the VIP detail page shows:

1. **Engagement Summary Cards** (row of 3 stat cards):
   - Total Docs Shared: e.g., 4
   - Avg Completion Rate: e.g., 15%
   - Last Active: e.g., "23 days ago"

2. **Engagement Timeline** (vertical timeline, newest first):
   Each entry shows date, document title, action type (Shared / Opened / Read 45% / Not Opened), and a mini progress bar for completion.

3. **AI Insight Banners** (show one per VIP, contextually chosen):

   **Negative insight example** (amber/orange background, for cold VIPs like Fatima):
   - Icon: TrendingDown
   - Title: "Engagement Declining"
   - Body: "Fatima hasn't opened any research in the last 3 weeks. Her completion rates have dropped from 65% to 15% over the past month. Consider reaching out or adjusting research topics to better match her current interests."

   **Positive insight example** (green background, for VIPs showing new engagement):
   - Icon: TrendingUp
   - Title: "New Interest Detected"
   - Body: "For the first time, Fatima read a full document end to end and spent an average of 2 minutes per page on the ESG and Clean Energy report. This could signal a new interest in clean energy. Consider sharing more research in this space."
