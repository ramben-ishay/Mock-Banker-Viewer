# Demo Flow (JP Morgan Chase)

This is the end-to-end walkthrough demonstrating the platform — from document ingestion through AI-powered client engagement.

## Step 1: Landing — User Enters the Web App

- The banker opens the web app.
- Clean landing screen with "Upload Your Research" heading.
- Large drag-and-drop zone in the center.

## Step 2: Document Upload

- The banker **drags and drops** a batch of PDF documents into the web app.
- Files land in the upload zone.
- Validation: PDF only, max 25MB.

## Step 3: Document Analysis (Factification Animation)

- The app shows an **analysis animation** — a polished transition showing documents being processed.
- Gradient border card with scanning overlay.
- Progress text: "Analyzing document..." → "Extracting key insights..." → "Generating recommendations..."
- Duration: ~3.5 seconds.
- On completion, auto-navigates to the VIPs page.

## Step 4: Connect the CRM

- The banker sees the empty VIP list.
- Two CTA buttons: "Connect to Salesforce" and "Connect to HubSpot" (with respective logos).
- On click: 2-second loading spinner → VIPs populate from mock data.
- This simulates CRM integration syncing client data.

## Step 5: Add a New VIP — Alexandra

- The banker clicks "+ Add VIP Manually".
- Modal form opens.
- **Tab Autocomplete Demo**:
  - Types "Alex" in the name field
  - Presses `Tab` → name autocompletes to "Alexandra Petrova"
  - Presses `Tab` → email fills in with typewriter animation
  - Presses `Tab` → interests fill in with typewriter animation
  - Presses `Tab` → communication notes fill in with typewriter animation
- Each Tab press shows a "CRM" badge indicating data came from CRM.
- Submit creates the VIP.

## Step 6: Alexandra's Profile — Document Recommendations

- Banker clicks on Alexandra's card → navigates to her detail page.
- **Engagement section**: Shows initial empty state or first-time stats.
- **Recommendations section**: AI-generated document recommendations appear:
  - "Quantum Computing Commercialization Roadmap" — 95% relevance
  - "AI Infrastructure: The $500B Capex Cycle" — 88% relevance
  - Each with an explanation linking Alexandra's interests to the document.

## Step 7: Add Comments & Send Documents

- Banker clicks "Share with Alexandra" on the Quantum Computing recommendation.
- **ShareModal** opens:
  - Pre-filled personalized message.
  - 3-4 quote suggestions from the document with page references.
  - Banker reviews quotes, approves 2-3, rejects 1.
  - Adds a personal comment to each approved quote.
- Banker clicks "Send".
- Success toast: "Research shared with Alexandra Petrova".
- Comment threads are now visible in the Comments panel.

## Step 8: Alexandra's View — Mobile Document Experience

- Banker opens the viewer to preview what Alexandra sees: `/viewer/doc-13?vipId=alexandra-petrova`
- The PDF viewer loads in full screen.
- **Banker's comments** appear as inline annotations on the PDF.
  - These are the EXACT same comments from Step 7 — the two views are synchronized.
- Alexandra enters the **guided walkthrough**:
  - Clicks "Start Walkthrough" button.
  - Step-by-step tour of key sections.
  - Each step: auto-scroll to page, highlight area, personalized message.
  - "Based on your interest in quantum computing, this section covers IBM's latest roadmap..."
- After walkthrough, opens **Comments drawer**.
  - Sees banker's comments on the quoted passages.
  - Replies using **Tab autocomplete**:
    - Starts typing → ghost text appears suggesting a response.
    - Presses Tab → reply auto-completes with contextually relevant text.
  - Sends replies.

## Step 9: Alexandra Chats with the AI

- Alexandra opens the **AI Chat drawer**.
- Chat suggestions appear based on the document topics.
- She asks questions about the document:
  - "Give me 3 bullets on the key takeaways"
  - "What are the main risks?"
- Uses **Tab autocomplete** for questions:
  - Starts typing → ghost text suggests the full question.
  - Presses Tab to accept.
- AI provides intelligent, document-aware answers (scripted).
- Responses include citations referencing specific pages.
- Follow-up suggestions appear after each response.

---

## Flow Summary

| Step | Actor | Action | Key Feature |
|------|-------|--------|-------------|
| 1 | Banker | Opens web app | Landing screen |
| 2 | Banker | Drops documents | Drag & drop upload |
| 3 | System | Analyzes documents | Factification animation |
| 4 | Banker | Connects CRM | CRM integration simulation |
| 5 | Banker | Adds VIP Alexandra | Tab autocomplete |
| 6 | Banker | Views Alexandra's profile | AI recommendations |
| 7 | Banker | Comments & sends documents | Quote annotations + share |
| 8 | Alexandra | Opens on mobile, walks through, replies | Mobile viewer + walkthrough + Tab autocomplete |
| 9 | Alexandra | Chats with AI | AI chat + Tab autocomplete + citations |
