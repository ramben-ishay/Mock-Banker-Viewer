# Factify 5-Minute Product Demo Video Prompt (Screen-Recording Style)

Use this Markdown as the **single source prompt** for a video-generation AI to create a ~**5 minute** product demo of **Factify**. The final result should feel like a **real screen recording** of a modern web app (cursor, clicks, hover states, scrolling, real UI micro-animations) with **continuous voiceover narration**.

**Instruction to the video AI**: Follow the storyboard below **exactly**. Output only the finished video (no behind-the-scenes explanation).

---

## Output Requirements

- **Length**: ~5:00 (±15s)
- **Format**: 16:9, 1920×1080, 30fps, crisp UI text
- **Style**: Realistic screen recording of a web app (not motion graphics)
- **On-screen cursor**: visible; natural mouse movement; click ripples optional
- **Transitions**: quick cuts + subtle zooms to focus; no flashy wipes
- **Data**: Use **fictional** VIPs/documents and **do not** use real bank names/logos
- **Voiceover**: confident, executive, ~130–150 wpm; **match the timestamps** (pause naturally when needed); clean studio sound; light UI click/typing SFX optional
- **No sensitive claims**: Avoid guarantees or compliance claims; keep it credible and enterprise-safe.

---

## Product Positioning (for Bank Leadership / Buyers)

Factify enables wealth teams to:

- **Personalize research distribution** using each VIP’s preferences and reading history
- **Improve engagement** with smart annotations, guided walkthroughs, and AI chat
- **Operationalize the workflow** (approve/reject AI annotations, distribute updates, track analytics)
- **Measure ROI** with engagement metrics at VIP + document + coverage levels

### Buyer takeaway (end-state message)

By the end of the video, the viewer should clearly believe:

- **Relevance at scale**: teams can distribute the *right* research to the *right* VIP reliably
- **Better client experience**: research becomes interactive, two-way, and mobile-ready
- **Measurable impact**: leadership gets a clear engagement feedback loop across VIPs and content

---

## Visual Design Constraints (Match This UI)

### Banker Portal (web app)

- Left sidebar with **Factify** logo + navigation:
  - **My VIPs**
  - **Research Library**
  - **Coverage Dashboard**
- Main content uses:
  - white cards, subtle shadows, modern typography
  - Factify accent color: **blue/purple (#444AFF)** for highlights/CTAs

### Interactive Document Viewer (web + mobile)

- Header bar with document title + status dot + user avatar
- Right icon strip with drawers:
  - **Ask AI**
  - **Comments**
  - (Timeline / Versions / Analytics / Settings can appear as icons)
- **Ask AI drawer** shows:
  - “Document Summary” card
  - 3 pre-defined question buttons
  - chat input
- **Comments drawer** shows:
  - banker left margin note(s)
  - VIP can “Reply” and use an **AI suggested reply**
- **Document Walkthrough** card overlays the viewer:
  - “Start Walkthrough” → steps highlight relevant sections
- **Mobile view**: emulate iPhone-ish viewport (e.g., 390×844) and show “Customer View”

---

## Characters / Perspectives

- **On-screen banker persona**: Private Banker / Wealth Advisor (narrator refers to “I” as the banker user)
  - In-comment author name shown in the viewer appears as **Your Banker** (generic advisor identity in demo UI).
- **VIP clients shown**:
  - **Fatima Al Rashid** (existing VIP; disengagement example)
  - **Alexandra Petrov** (new VIP added via CRM match + AI synthesis)
- **Client POV**: Switch to Alexandra on mobile viewing the shared interactive document

---

## Scene-by-Scene Storyboard + Voiceover (timestamped)

### 0:00–0:25 — Open Factify → “My VIPs” overview (hook with outcomes)

- **Visual**
  - Land on the **My VIPs** page (VIP cards show name, interests, docs sent, completion %, last engaged).
  - Do a quick, natural scroll to reveal more VIPs.
  - Cursor hovers a few VIP cards; show subtle hover glow/animation.
- **On-screen text callout (small, optional)**
  - “Personalized research distribution + measurable engagement”
- **Voiceover**
  - **Verbatim script**: “This is Factify — personalized research distribution with measurable engagement. I start on My VIPs, where I can see every relationship at a glance: what I’ve sent, completion rates, and who needs follow-up. In the next five minutes, you’ll see how Factify turns research into a repeatable workflow — and then into analytics leadership can act on.”

---

### 0:25–0:55 — Explain Factify’s personalization (Factify understands the document + the reader)

- **Visual**
  - Zoom slightly into a VIP card to show the **interest tags** and **completion** stat.
  - Briefly hover the “Add VIP” button but do not click yet.
- **Voiceover**
  - **Verbatim script**: “Factify’s advantage is that it understands both sides of the equation: the document and the reader. Using Factify’s document pipeline and APIs, each report is analyzed and structured — topics, key sections, and what matters — then matched to each VIP based on preferences and reading history. That means fewer generic blasts and more high-confidence shares, with a clear reason behind every recommendation. And as engagement signals come back, matching improves over time.”

---

### 0:55–1:35 — Open VIP: Fatima → engagement overview + observations + recommended action

- **Visual**
  - Click VIP **Fatima Al Rashid**.
  - On her profile:
    - show **Engagement Overview** stats (docs shared, completion, last active)
    - show an **AI Insight** card (disengagement alert)
    - show **Recommended Actions** pills/buttons
    - show **Document Engagement History** timeline/list
- **On-screen text callouts (short)**
  - “Disengagement detected”
  - “Next-best action suggested”
- **Voiceover**
  - **Verbatim script**: “Let’s open a real relationship. Fatima is a key client — and Factify immediately flags a change: engagement is dropping. Her completion has fallen, and she hasn’t opened research recently. Instead of guessing, I get an insight plus recommended actions that align to what she actually reads — ESG, clean energy, and carbon themes. For leadership, this is the shift: engagement becomes visible and actionable, and teams can intervene early with the right content and the right outreach.”

---

### 1:35–2:15 — Add a new VIP from the VIP list (CRM match + Tab) → AI synthesis animation

- **Visual**
  - Use the “Back to My VIPs” link.
  - Click **Add VIP**.
  - Modal opens with a large name input.
  - Banker types “Al” then presses **Tab** to accept the CRM match suggestion for **Alexandra Petrov**.
  - Click **Next**.
  - Show the “AI coverage synthesis” animation steps:
    - Importing CRM Intelligence
    - Mapping Investment Preferences
    - Scoring Research Library
    - Ranking Recommendations
    - Finalizing Coverage Profile
  - Modal closes and navigates into Alexandra’s profile automatically.
- **On-screen text callout (short)**
  - “New VIP → recommendations in seconds”
- **Voiceover**
  - **Verbatim script**: “Now I’ll add a new VIP. I type Alexandra’s name, press Tab, and Factify matches her from CRM records. Then it synthesizes a coverage profile in seconds — importing context, mapping investment preferences, scoring the research library, and ranking recommendations. This is how teams scale personalization: every banker gets the same fast, consistent starting point, and every VIP gets research that’s matched to what they actually care about.”

---

### 2:15–3:05 — Alexandra profile → recommended research → distribute → approve/reject annotations → send

- **Visual**
  - On Alexandra’s profile, scroll to **Recommended Research**.
  - Click **Distribute to VIP** on the top recommendation.
  - In the “Distribute Research” modal:
    - show the **Coverage Note** text area
    - expand **AI-Generated Annotations**
    - **Approve** 2 annotations and **Reject** 1 (clearly show the Approve/Reject buttons)
  - Click **Send**.
  - Show a brief “shared” confirmation state.
- **On-screen text callouts (short)**
  - “Human-in-the-loop workflow”
  - “Approve / Reject AI annotations”
- **Voiceover**
  - **Verbatim script**: “Here’s where Factify becomes operational. On Alexandra’s profile, I see recommended research ranked by relevance to her mandate. When I click Distribute to VIP, Factify prepares the entire workflow: a ready-to-send coverage note, plus AI-generated annotations drafted as margin comments tied to specific passages. I quickly approve the strongest annotations, reject what I don’t want included, and send. In seconds, I’ve turned a long report into a tailored client package — with my judgment in the loop and a consistent workflow my team can repeat.”

---

### 3:05–4:05 — Switch to Alexandra (client POV) on mobile → interactive document → comments → walkthrough → Ask AI

- **Visual**
  - Cut to a **mobile viewport** of the Factify viewer (simulate device / responsive mode; show “Customer View”).
  - Show the document loaded with the right-side icons.
  - Open **Comments** drawer:
    - show banker’s comment(s) attached to a highlighted quote
    - tap **Reply**
    - insert an **AI suggested reply** (show the suggestion being applied) and **send**
  - Start **Document Walkthrough**:
    - click “Start Walkthrough”
    - step through 2–3 steps (highlighted sections)
  - Open **Ask AI** drawer:
    - show **Document Summary**
    - click one predefined question (e.g., “What are the key investment conclusions?”)
    - then ask a custom question in the chat input and send
- **On-screen text callouts (short)**
  - “Client-ready, mobile-first”
  - “Interactive comments + AI chat”
- **Voiceover**
  - **Verbatim script**: “Now we switch to the client experience. On mobile, Alexandra opens a smart, interactive document — not a static attachment. She sees the highlights and the margin notes her advisor included, right where they matter. She can reply inline, and even use an AI-suggested response to respond quickly. Next, the guided walkthrough brings her through the most relevant sections step-by-step, so she doesn’t have to hunt. And with Ask AI, she gets an instant summary, can tap a predefined question, and then ask something specific to her portfolio — turning reading into a fast, informed conversation.”

---

### 4:05–4:55 — Back to banker portal → Research Library analytics + version alert → share update → Coverage Dashboard

- **Visual**
  - Cut back to desktop banker portal.
  - Click **Research Library**.
  - Show:
    - an AI summary/briefing banner
    - a prominent **New Version Available** alert for a report that was previously read by **three VIPs**
  - Click **Share updated version with them**:
    - modal shows the 3 VIP recipients selected
    - click **Share with 3 VIPs**
  - Navigate to **Coverage Dashboard**:
    - show aggregate stats tiles (VIPs, library size, total shared, avg completion)
    - show “Requires Follow-Up” section and/or VIP engagement table
- **On-screen text callouts (short)**
  - “Version updates → instant re-distribution”
  - “Engagement analytics for leadership”
- **Voiceover**
  - **Verbatim script**: “Now we’re back in the banker portal, and this is where Factify becomes measurable for leadership. In the research library, I can see performance at the document level — what’s trending, what’s high-match, and what needs attention. When a new version is published, Factify alerts me who read the prior version, so I can share the update instantly with the right VIPs — no manual list-building, no missed clients. Finally, the coverage dashboard rolls everything up: engagement across relationships, who needs follow-up, and what research is performing. This creates a closed-loop system: distribute, engage, learn, and improve.”

---

## End Screen (4:55–5:00)

- **Visual**: simple end card over the Factify UI (slight blur background).
- **On-screen text**:
  - “Factify”
  - “Personalize distribution • Activate engagement • Measure impact”
  - “For wealth & private banking teams”

---

## Editing Notes (Important)

- Keep pacing tight: spend **~5–10 seconds** on each click/scroll unless it’s a key feature moment.
- When switching to mobile POV, make it obvious via viewport change + “Customer View” badge.
- Use zoom-ins sparingly to highlight: **AI Insight**, **Approve/Reject**, **Document Walkthrough**, **Ask AI summary**, **New Version alert**.
- Keep on-screen text minimal; prefer **voiceover** for explanation.

