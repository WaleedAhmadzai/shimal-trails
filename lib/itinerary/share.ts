import { LIMITS } from "@/data/pricing";
import { getDestinationBySlug } from "@/lib/destinations";
import type { Itinerary, StartCity, Tier } from "@/types";

const TIERS: Tier[] = ["economy", "standard", "premium"];
const CITIES: StartCity[] = ["islamabad", "lahore"];

/** A short, readable query string that fits in a WhatsApp message. */
export function serializeItinerary(it: Itinerary) {
  const params = new URLSearchParams({
    plan: it.stops.map((s) => `${s.slug}:${s.nights}`).join(","),
    start: it.startDate,
    n: String(it.travellers),
    tier: it.tier,
    from: it.startCity,
  });
  return params.toString().replace(/%3A/g, ":").replace(/%2C/g, ",");
}

export interface ParsedShare {
  itinerary: Partial<Itinerary> & { stops: Itinerary["stops"] };
  skipped: string[];
}

/** Parse a shared link. Unknown places are skipped and reported. */
export function parseSharedItinerary(search: URLSearchParams): ParsedShare | null {
  const raw = search.get("plan");
  if (!raw) return null;
  const skipped: string[] = [];
  const stops = raw
    .split(",")
    .slice(0, LIMITS.maxStops)
    .flatMap((part) => {
      const [slug, nightsText] = part.split(":");
      const nights = Number(nightsText);
      if (!slug || !getDestinationBySlug(slug)) {
        if (slug) skipped.push(slug);
        return [];
      }
      return [
        {
          slug,
          nights: Number.isInteger(nights)
            ? Math.min(Math.max(nights, 0), LIMITS.maxNightsPerStop)
            : 1,
        },
      ];
    });

  const itinerary: ParsedShare["itinerary"] = { stops };
  const start = search.get("start");
  if (start && /^\d{4}-\d{2}-\d{2}$/.test(start)) itinerary.startDate = start;
  const n = Number(search.get("n"));
  if (Number.isInteger(n) && n >= 1 && n <= LIMITS.maxTravellers) itinerary.travellers = n;
  const tier = search.get("tier") as Tier;
  if (TIERS.includes(tier)) itinerary.tier = tier;
  const from = search.get("from") as StartCity;
  if (CITIES.includes(from)) itinerary.startCity = from;

  return { itinerary, skipped };
}
