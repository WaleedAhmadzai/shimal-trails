import { destinations } from "@/data/destinations";
import { regions } from "@/data/regions";
import type { Destination, Difficulty, RegionId } from "@/types";
import { LIMITS } from "@/data/pricing";
import { hoursFromIslamabad } from "./itinerary/roads";

// The only way pages read destination data. In Track B these functions
// query a database instead, and no page has to change.

export type SortKey = "recommended" | "name" | "drive" | "altitude" | "budget";

export interface DestinationFilters {
  q: string;
  region: RegionId | "";
  month: number | 0;
  difficulty: Difficulty | "";
  days: number | 0;
  family: boolean;
  sort: SortKey;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "name", label: "Name A–Z" },
  { value: "drive", label: "Closest to Islamabad" },
  { value: "altitude", label: "Highest first" },
  { value: "budget", label: "Lowest budget" },
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  challenging: "Challenging",
};

export const DAY_OPTIONS = [3, 5, 7, 10] as const;

export const EMPTY_FILTERS: DestinationFilters = {
  q: "",
  region: "",
  month: 0,
  difficulty: "",
  days: 0,
  family: false,
  sort: "recommended",
};

export function getAllDestinations(): Destination[] {
  return destinations;
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getDestinationsBySlugs(slugs: string[]) {
  return slugs.map(getDestinationBySlug).filter((d): d is Destination => Boolean(d));
}

/** Shortest sensible trip length: there, the recommended nights, and back. */
export function minTripDays(destination: Destination) {
  const driveDays = Math.ceil(hoursFromIslamabad(destination.nodeId) / LIMITS.maxDriveHoursPerDay);
  return Math.max(1, driveDays * 2 + destination.recommendedNights - (destination.recommendedNights > 0 ? 1 : 0));
}

function normalise(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchesQuery(destination: Destination, q: string) {
  if (!q) return true;
  const region = regions.find((r) => r.id === destination.region)?.name ?? "";
  const haystack = normalise(
    [destination.name, region, ...destination.aliases, ...destination.tags].join(" "),
  );
  const compact = haystack.replace(/ /g, "");
  return normalise(q)
    .split(" ")
    .every((word) => haystack.includes(word) || compact.includes(word));
}

export function filterDestinations(list: Destination[], f: DestinationFilters) {
  return list.filter(
    (d) =>
      matchesQuery(d, f.q) &&
      (!f.region || d.region === f.region) &&
      (!f.month || d.bestMonths.includes(f.month as never)) &&
      (!f.difficulty || d.difficulty === f.difficulty) &&
      (!f.days || minTripDays(d) <= f.days) &&
      (!f.family || d.familyFriendly),
  );
}

export function sortDestinations(list: Destination[], sort: SortKey) {
  const copy = [...list];
  switch (sort) {
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "drive":
      return copy.sort((a, b) => hoursFromIslamabad(a.nodeId) - hoursFromIslamabad(b.nodeId));
    case "altitude":
      return copy.sort((a, b) => b.altitudeM - a.altitudeM);
    case "budget":
      return copy.sort((a, b) => a.costPerNightPkr.standard - b.costPerNightPkr.standard);
    default:
      return copy;
  }
}

export function queryDestinations(f: DestinationFilters) {
  return sortDestinations(filterDestinations(destinations, f), f.sort);
}

/** For an empty result: how many results each filter would give if removed. */
export function suggestRelaxations(f: DestinationFilters) {
  const keys = ["q", "region", "month", "difficulty", "days", "family"] as const;
  return keys
    .filter((key) => Boolean(f[key]))
    .map((key) => ({
      key,
      count: filterDestinations(destinations, { ...f, [key]: EMPTY_FILTERS[key] }).length,
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
}

/** Read filters from URL search params, ignoring anything invalid. */
export function parseFilters(params: Record<string, string | string[] | undefined>): DestinationFilters {
  const get = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };
  const region = get("region");
  const difficulty = get("difficulty");
  const sort = get("sort");
  const month = Number(get("month"));
  const days = Number(get("days"));
  return {
    q: get("q").slice(0, 60),
    region: regions.some((r) => r.id === region) ? (region as RegionId) : "",
    month: Number.isInteger(month) && month >= 1 && month <= 12 ? month : 0,
    difficulty: difficulty in DIFFICULTY_LABELS ? (difficulty as Difficulty) : "",
    days: (DAY_OPTIONS as readonly number[]).includes(days) ? days : 0,
    family: get("family") === "1",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "recommended",
  };
}

/** Turn filters back into a query string, leaving out defaults. */
export function filtersToQuery(f: DestinationFilters) {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.region) params.set("region", f.region);
  if (f.month) params.set("month", String(f.month));
  if (f.difficulty) params.set("difficulty", f.difficulty);
  if (f.days) params.set("days", String(f.days));
  if (f.family) params.set("family", "1");
  if (f.sort !== "recommended") params.set("sort", f.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function nearbyDestinations(destination: Destination, count = 3) {
  return destinations
    .filter((d) => d.slug !== destination.slug)
    .map((d) => ({
      d,
      distance: Math.hypot(
        d.coordinates.lat - destination.coordinates.lat,
        d.coordinates.lng - destination.coordinates.lng,
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map((x) => x.d);
}
