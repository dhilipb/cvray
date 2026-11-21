/* --------- Job Status Pipeline --------- */

export const JOB_STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const STATUS_COLORS: Record<string, string> = {
  Saved: "#a1a1aa",
  Applied: "#3b82f6",
  Interviewing: "#f59e0b",
  Offer: "#10b981",
  Rejected: "#ef4444",
};

export interface Job {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedAt: string;
  updatedAt?: string;
  url?: string | null;
  jobDescription?: string | null;
  notes?: string | null;
  tweakedCvJson?: string | null;
}

/* --------- Helpers --------- */

// Only http(s) links are rendered as anchors; blocks javascript: and similar schemes.
export const isSafeUrl = (url?: string | null): url is string => !!url && /^https?:\/\//i.test(url);

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export function relativeTime(date: string | Date): string {
  const seconds = (new Date(date).getTime() - Date.now()) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
