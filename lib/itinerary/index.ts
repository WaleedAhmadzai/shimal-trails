import type { Itinerary } from "@/types";
import { estimateCost } from "./cost";
import { buildTripPlan } from "./days";
import { checkTrip } from "./warnings";

export * from "./cost";
export * from "./days";
export * from "./roads";
export * from "./share";
export * from "./warnings";

/** Everything the builder shows, computed from the itinerary in one call. */
export function planTrip(itinerary: Itinerary, today?: string) {
  const plan = buildTripPlan(itinerary);
  return {
    plan,
    cost: estimateCost(itinerary, plan),
    warnings: checkTrip(itinerary, plan, today),
  };
}
