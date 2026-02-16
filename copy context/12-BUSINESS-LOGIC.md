# Business Logic & Algorithms

## AI Recommendations

### How Recommendations Are Generated

Each VIP has `interests` (an array of topics). Each document has `topics`. The recommendation system matches VIP interests to document topics.

**Relevance Scoring**:
- Score is 0-100
- Higher score = more topic overlap between VIP interests and document topics
- Scores in mock data are pre-calculated (not dynamically computed)

**AI Explanation**:
Each recommendation has a 1-2 sentence explanation that combines:
1. Why the document matches the VIP's interests
2. The VIP's historical engagement with similar documents

Example: "Sarah has a strong interest in semiconductors and read 92% of the last TSMC report you shared. This updated outlook covers the latest 3nm capacity expansion."

**Color Coding**:
```typescript
function getRelevanceColor(score: number) {
  if (score >= 70) return "green";   // High relevance
  if (score >= 40) return "orange";  // Medium relevance
  return "red";                       // Low relevance
}
```

### Recommendation Lifecycle
1. VIP added → recommendations auto-generated from mock data
2. Banker sees recommendations on VIP detail page
3. Banker can "Share" (opens ShareModal) or "Dismiss"
4. Shared recommendations: `shared = true`, removed from active list
5. Dismissed recommendations: `dismissed = true`, removed from active list

## Document Sharing Flow

When a banker shares a document with a VIP:

1. **ShareModal opens** with:
   - Pre-filled personalized message
   - Quote suggestions for this document

2. **Quote suggestions** are pre-extracted passages from the document:
   - Each has: quote text, page reference, pre-suggested banker comment
   - Banker can Approve or Reject each quote
   - Approved quotes become comment threads

3. **On Send**:
   - `SHARE_DOCUMENT` action dispatched
   - Recommendation marked as `shared = true`
   - New timeline entry created: `{ actionType: "shared", completionPercent: 0 }`
   - For each approved quote: a `CommentThread` is created with the banker's comment as the first entry
   - Success toast shown

## Engagement Tracking

### Timeline Entries

Each VIP has a timeline showing their document interactions:
- **Shared**: Document was sent to VIP (completionPercent: 0)
- **Opened**: VIP opened the document (completionPercent: ~5-10)
- **Read**: VIP read the document (completionPercent: 15-100)
- **Not Opened**: Document was shared but never opened

### Engagement Classification

VIPs are implicitly classified by engagement:
- **Hot** (green): High avg completion (>60%), recently active
- **Warm** (orange): Moderate engagement, some inactivity
- **Cold** (red): Low completion (<30%), inactive for >2 weeks

### AI Insights

Each VIP has one AI insight banner:

**Negative insights** (shown for cold/declining VIPs):
- Declining completion rates
- Long periods of inactivity
- Includes actionable suggestion

**Positive insights** (shown for engaged VIPs):
- New interest detected
- Deep engagement on specific topics
- Consistent reading patterns

## Walkthrough Personalization

### Template System

Walkthrough steps are stored as **templates** with placeholders:
```
"Based on your interest in {interest}, this section covers {context}."
```

### Personalization Function: `personalizeWalkthroughSteps()`

1. Takes: walkthrough templates for a document + VIP's interests
2. For each template:
   - Matches `relevantTopics` against VIP's `interests`
   - Finds the best matching interest
   - Replaces `{interest}` with the matched interest
   - Replaces `{name}` with VIP's name
   - Replaces `{context}` with relevant context
3. Returns: array of personalized `WalkthroughStep` objects

### Step Structure
Each walkthrough step specifies:
- Which page to navigate to
- Where to highlight on that page (coordinates as % of page)
- What personalized message to show

## Scripted Chat System

### File: `src/lib/scripted-chat.ts`

Two main functions:

### `getChatSuggestions(documentTopics: string[])`
Returns 3-4 suggested prompts based on document topics.

Example for a semiconductor document:
- "Give me 3 bullets on the key takeaways"
- "What are the main risks to TSMC's expansion?"
- "How does this compare to the previous quarter?"
- "What's the 30-90 day outlook?"

### `getChatResponse(message: string, documentId: string)`
Pattern-matches the user's message and returns a scripted response.

**Patterns**:
| Input contains | Response type |
|---------------|---------------|
| "3 bullets" or "summary" | 3 bullet point summary |
| "risk" | Risk analysis |
| "passage" or "quote" | Relevant passage from quote suggestions |
| "30-90 days" or "outlook" | Short-term outlook |
| (default) | Generic helpful response |

**Response includes**:
- Text content
- Optional citations: `{ text: string, page: number }`
- Follow-up suggestions (2-3 suggested next questions)

## Tab Autocomplete (Ghost Text)

Used in three places:
1. **Add VIP Modal**: Progressive field completion
2. **Comments Reply**: Suggested reply text
3. **AI Chat Input**: Suggested question text

### Implementation Pattern
1. User starts typing in an input field
2. A suggestion is computed (from predefined data or pattern matching)
3. Ghost text (gray, semi-transparent) appears after the cursor showing the suggestion
4. If user presses **Tab**: the ghost text is accepted and becomes real text
5. If user continues typing: ghost text updates or disappears
6. Ghost text is rendered as a `<span>` with reduced opacity overlaying the input

### Add VIP Autocomplete (Special)
This is the most complex autocomplete:
1. User types partial name (e.g., "Alex")
2. System matches against `PREDEFINED_VIP_SUGGESTIONS`
3. On Tab: name autocompletes
4. Focus moves to next field, which animates with typewriter effect
5. Each subsequent Tab advances to the next field with animation
6. A "CRM" badge appears to indicate data source

## Utility Functions (`src/lib/utils.ts`)

```typescript
// Relevance score → color variant
getRelevanceColor(score: number): "green" | "orange" | "red"

// Date → relative string
formatRelativeDate(dateString: string): "Today" | "Yesterday" | "X days ago" | "X weeks ago"

// Date → formatted string
formatDate(dateString: string): string  // e.g., "Jan 15, 2026"

// Class name utility (combines class strings)
cn(...classes: (string | undefined | false)[]): string
```

## State Persistence

### localStorage Key: `"vip-research-state"`

On every state change, the reducer saves to localStorage:
```typescript
localStorage.setItem("vip-research-state", JSON.stringify(state));
```

On initialization, state is loaded from localStorage if available.

### Cross-Tab Sync

The context listens for `storage` events:
```typescript
window.addEventListener("storage", (e) => {
  if (e.key === "vip-research-state") {
    // Reload state from localStorage
  }
});
```

This allows the demo to work across multiple browser tabs (e.g., banker view in one tab, VIP viewer in another) with synchronized state.

### Reset Demo

The sidebar has a "Reset Demo" button that:
1. Clears `localStorage.removeItem("vip-research-state")`
2. Reloads the page
3. App starts fresh with default (empty) state
