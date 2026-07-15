export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "stable":
    case "Resolved":
      return "text-green-400";
    case "warning":
    case "In Progress":
      return "text-yellow-400";
    case "critical":
    case "Approved & Routed":
      return "text-orange-400";
    case "blackout":
    case "Rejected":
      return "text-red-400";
    case "Submitted":
      return "text-blue-400";
    case "Under Admin Review":
      return "text-purple-400";
    default:
      return "text-cyan-400";
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case "stable":
    case "Resolved":
      return "bg-green-400/10 border-green-400/30 text-green-400";
    case "warning":
    case "In Progress":
      return "bg-yellow-400/10 border-yellow-400/30 text-yellow-400";
    case "critical":
    case "Approved & Routed":
      return "bg-orange-400/10 border-orange-400/30 text-orange-400";
    case "blackout":
    case "Rejected":
      return "bg-red-400/10 border-red-400/30 text-red-400";
    case "Submitted":
      return "bg-blue-400/10 border-blue-400/30 text-blue-400";
    case "Under Admin Review":
      return "bg-purple-400/10 border-purple-400/30 text-purple-400";
    default:
      return "bg-cyan-400/10 border-cyan-400/30 text-cyan-400";
  }
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-green-400";
  if (confidence >= 60) return "text-yellow-400";
  return "text-red-400";
}

export function getConfidenceBg(confidence: number): string {
  if (confidence >= 80) return "bg-green-400/10 border-green-400/30 text-green-400";
  if (confidence >= 60) return "bg-yellow-400/10 border-yellow-400/30 text-yellow-400";
  return "bg-red-400/10 border-red-400/30 text-red-400";
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
