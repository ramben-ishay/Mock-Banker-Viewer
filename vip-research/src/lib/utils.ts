export function getRelevanceColor(score: number): {
  bg: string;
  text: string;
  label: string;
} {
  if (score > 70) {
    return {
      bg: "bg-status-green-100",
      text: "text-status-green-700",
      label: "High",
    };
  }
  if (score >= 40) {
    return {
      bg: "bg-status-orange-100",
      text: "text-status-orange-700",
      label: "Medium",
    };
  }
  return {
    bg: "bg-status-red-100",
    text: "text-status-red-700",
    label: "Low",
  };
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
