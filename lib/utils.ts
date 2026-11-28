import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, letting later classes win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export function formatPkr(value: number) {
  return `PKR ${pkr.format(Math.round(value))}`;
}

export function formatNumber(value: number) {
  return pkr.format(value);
}

export function formatAltitude(m: number) {
  return `${pkr.format(m)} m`;
}

export function formatHours(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** "Sat, 12 Jun 2027" from an ISO date, without timezone surprises. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Add whole days to an ISO date string. */
export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

export function monthOf(iso: string) {
  return Number(iso.slice(5, 7));
}

/** Join month numbers into readable ranges: [5,6,7,9] → "May–Jul, Sep". */
export function monthRanges(months: number[]) {
  if (months.length === 12) return "All year";
  const sorted = [...months].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) {
      prev = cur;
      continue;
    }
    ranges.push(
      start === prev ? MONTHS_SHORT[start - 1] : `${MONTHS_SHORT[start - 1]}–${MONTHS_SHORT[prev - 1]}`,
    );
    start = cur;
    prev = cur;
  }
  return ranges.join(", ");
}
