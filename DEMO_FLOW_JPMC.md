# JP Morgan Chase Demo Flow

## Overview

End-to-end walkthrough demonstrating the Banker Viewer platform — from document ingestion through AI-powered client engagement.

---

## Step 1: Landing — User Enters the Web App

- The banker opens the web app of JPMorgan.
- Clean landing screen is displayed, ready for action.

---

## Step 2: Document Upload

- The banker **drags and drops** a batch of documents into the web app.
- Multiple files land in the upload zone at once.

---

## Step 3: Document Analysis (Prototype Animation)

- The app kicks off an **analysis animation** — a polished prototype transition showing documents being processed and 'Factified' 
- Visual feedback as each document is parsed, categorized, and indexed.
- Once complete, the UI transitions smoothly to the next step.

---

## Step 4: Connect the CRM

- The banker is prompted to **connect the CRM** integration.
- CRM connection flow completes, syncing client data into the platform.

---

## Step 5: Add a New VIP — Alexandra

- The banker **adds a new VIP client**: **Alexandra**.
- Using **Tab autocomplete**:
  - `Tab` → fills in **name** (Alexandra)
  - `Tab` → fills in **interest/preferences**
  - `Tab` → fills in **email address**
  - `Tab` → fills in remaining profile fields
- Each tab press intelligently auto-completes the next field based on CRM data and AI inference.

---

## Step 6: Alexandra's Profile — Document Recommendations

- The banker navigates into **Alexandra's profile**.
- The platform displays **AI-generated document recommendations** — documents relevant to Alexandra based on her profile, interests, and history.

---

## Step 7: Add Comments & Send Documents

- The banker selects the documents to send to Alexandra.
- The banker **clicks on the comments section** and adds personalized notes/comments to the document.
- The banker **sends the document** out to Alexandra.

---

## Step 8: Alexandra's View — Mobile Document Experience

- Alexandra opens the document on **mobile**.
- She sees the **comments the banker left** — inline annotations and notes visible to the client.
  - **Note:** The comments shown here must be the exact same comments the banker wrote in Step 7 when sharing. These two views need to be synchronized.
- She enters a **guided walkthrough** of the document on her phone, navigating through the key sections step by step.
- After completing the walkthrough, she opens the **comments section** and leaves her replies.
- Using **Tab autocomplete**:
  - She starts typing a response and presses `Tab` to auto-complete her reply.
  - The AI suggests contextually relevant responses based on the document content and the banker's comments.
- She sends her replies.

---

## Step 9: Alexandra Chats with the AI

- Alexandra opens the **AI chat interface**.
- She asks questions about the document — clarifications, deeper dives, related topics.
- Using **Tab autocomplete** throughout the conversation:
  - `Tab` auto-completes her questions.
  - `Tab` suggests follow-up queries.
- The AI provides intelligent, document-aware answers.

---

## Flow Summary

| Step | Actor      | Action                                              | Key Feature                    |
|------|------------|-----------------------------------------------------|--------------------------------|
| 1    | Banker     | Opens web app                                       | Landing screen                 |
| 2    | Banker     | Drops documents                                     | Drag & drop upload             |
| 3    | System     | Analyzes documents                                  | Prototype animation            |
| 4    | Banker     | Connects CRM                                        | CRM integration                |
| 5    | Banker     | Adds VIP Alexandra                                  | Tab autocomplete               |
| 6    | Banker     | Views Alexandra's profile                           | AI recommendations             |
| 7    | Banker     | Comments & sends documents                          | Inline comments                |
| 8    | Alexandra  | Opens on mobile, walks through, replies with Tab    | Mobile + Tab autocomplete      |
| 9    | Alexandra  | Chats with AI about the document                    | AI chat + Tab autocomplete     |
