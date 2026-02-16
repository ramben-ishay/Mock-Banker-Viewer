import type { CommentThread } from "@/lib/types";

function firstNameFromFullName(fullName?: string | null): string {
  const safe = (fullName || "").trim();
  if (!safe) return "User";
  return safe.split(/\s+/)[0] || "User";
}

function snippetFromText(text: string, maxLen: number): string {
  const t = (text || "").trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen).trim() + "...";
}

export function generatePersonalizedComment(vipName: string, quoteText: string): string {
  const firstName = firstNameFromFullName(vipName);
  const snippet = snippetFromText(quoteText, 60);
  const templates = [
    `${firstName}, following our recent discussion, this finding -- "${snippet}" -- is directly relevant to your current positioning.`,
    `${firstName}, given your stated allocation priorities, the data on "${snippet}" warrants review ahead of your next rebalancing decision.`,
    `${firstName}, flagging this for your attention: "${snippet}". This connects directly to the thesis we discussed in our last meeting.`,
  ];
  const index = Math.abs(quoteText.length % templates.length);
  return templates[index];
}

export function getVipSuggestedReply(params: {
  threadId: string;
  quoteText: string;
  vipName?: string | null;
}): string {
  const { threadId, quoteText, vipName } = params;
  const firstName = firstNameFromFullName(vipName);
  const snippet = snippetFromText(quoteText, 90);
  const templates = [
    `Appreciate the note. The point on "${snippet}" is useful. What is the team's conviction level, and what would change the outlook?`,
    `Appreciate the highlight. On "${snippet}", how should we frame the near-term risk-reward against the base case?`,
    `Useful context. For "${snippet}", can you point me to the underlying data and the key modeling assumptions?`,
    `${firstName} here -- this is helpful. For "${snippet}", what are the key catalysts to watch over the next quarter?`,
  ];
  const idx = Math.abs(threadId.length + snippet.length) % templates.length;
  return templates[idx];
}

export function getBankerSuggestedReply(params: {
  thread: CommentThread;
  vipName?: string | null;
  bankerName?: string | null;
}): string {
  const { thread, vipName } = params;
  const firstName = firstNameFromFullName(vipName);
  const snippet = snippetFromText(thread.quoteText || "", 80);

  const lastVipComment = [...(thread.comments || [])]
    .reverse()
    .find((c) => c.author.role === "vip");
  const vipSnippet = lastVipComment ? snippetFromText(lastVipComment.text, 70) : "";

  const templates = [
    `Thanks, ${firstName}. On "${snippet}", this is a critical data point. I will send the supporting analysis and base-case assumptions for your review.`,
    `Good question, ${firstName}. For "${snippet}", the near-term risk is concentrated in timing and valuation. I will outline the key sensitivities with scenario bounds.`,
    `Understood, ${firstName}. On "${snippet}", I will send page references with the supporting exhibits so you can stress-test the assumptions.`,
    vipSnippet
      ? `Thanks, ${firstName}. Re: "${vipSnippet}" - I will share a concise view of what could change the outlook and how we are framing the downside.`
      : `Thanks, ${firstName}. I will send a crisp summary of the key drivers and the main watch items tied to "${snippet}".`,
  ];

  const seed = (thread.id || "").length + snippet.length + vipSnippet.length;
  return templates[Math.abs(seed) % templates.length];
}

