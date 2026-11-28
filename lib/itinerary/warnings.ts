import { LIMITS } from "@/data/pricing";
import { MONTHS_LONG, formatHours, monthOf, monthRanges } from "@/lib/utils";
import type { Itinerary, TripWarning } from "@/types";
import type { TripPlan } from "./days";
import { findRoute, getNode, getPass } from "./roads";

/** Whole days from `today` to the trip start (both ISO dates). */
export function daysUntil(startDate: string, today: string) {
  return Math.round((Date.parse(startDate) - Date.parse(today)) / 86_400_000);
}

export function checkTrip(itinerary: Itinerary, plan: TripPlan, today?: string): TripWarning[] {
  const warnings: TripWarning[] = [];
  const month = monthOf(itinerary.startDate);
  const monthName = MONTHS_LONG[month - 1];

  if (plan.stops.length === 0) {
    return [{ id: "empty", severity: "info", message: "Add a destination to start your plan." }];
  }

  // 1. Destinations closed in the trip month.
  for (const { destination } of plan.stops) {
    if (!destination.openMonths.includes(month as never)) {
      warnings.push({
        id: `closed-${destination.slug}`,
        severity: "error",
        message: `${destination.name} is not reachable in ${monthName}. ${destination.closureNote ?? ""}`.trim(),
        fix: `Go between ${monthRanges(destination.openMonths)}.`,
      });
    }
  }

  // 2. Closed passes: rerouted, or no road at all.
  let from = itinerary.startCity as string;
  const targets = [...plan.stops.map((s) => s.destination.nodeId), itinerary.startCity];
  for (const to of targets) {
    const open = findRoute(from, to, month);
    const any = findRoute(from, to);
    if (any && !open) {
      const pass = any.passes.map((p) => getPass(p).name).join(", ");
      warnings.push({
        id: `no-road-${from}-${to}`,
        severity: "error",
        message: `No open road from ${getNode(from)?.name} to ${getNode(to)?.name} in ${monthName}: ${pass} is closed.`,
        fix: "Choose summer dates or remove this stop.",
      });
    } else if (any && open && open.hours > any.hours + 0.01) {
      const closed = any.passes.filter((p) => !open.passes.includes(p)).map((p) => getPass(p).name);
      warnings.push({
        id: `reroute-${from}-${to}`,
        severity: "info",
        message: `${closed.join(", ")} is closed in ${monthName}, so we route you the long way (+${formatHours(open.hours - any.hours)}).`,
      });
    }
    from = to;
  }

  // 3. Altitude: sleeping more than 1,000 m higher in a day, above 3,000 m.
  let previous = getNode(itinerary.startCity)?.altitudeM ?? 0;
  for (const day of plan.days) {
    if (day.sleepAltitudeM === null) continue;
    const gain = day.sleepAltitudeM - previous;
    if (day.sleepAltitudeM > LIMITS.altitudeThresholdM && gain > LIMITS.altitudeJumpM) {
      warnings.push({
        id: `altitude-${day.n}`,
        severity: "warning",
        day: day.n,
        message: `Day ${day.n}: you sleep ${gain.toLocaleString("en-PK")} m higher than the night before, at ${day.sleepAltitudeM.toLocaleString("en-PK")} m. Altitude sickness is likely.`,
        fix: "Add a night at a lower stop first.",
      });
    }
    previous = day.sleepAltitudeM;
  }

  // 4. Long road days.
  for (const day of plan.days) {
    if (day.driveHours > LIMITS.longDriveDayHours) {
      warnings.push({
        id: `long-${day.n}`,
        severity: "info",
        day: day.n,
        message: `Day ${day.n} has about ${formatHours(day.driveHours)} on the road. Start early.`,
      });
    }
  }

  // 5. Rushed: three or more day-visits in a row.
  let streak = 0;
  for (const stop of plan.stops) {
    streak = stop.nights === 0 ? streak + 1 : 0;
    if (streak === 3) {
      warnings.push({
        id: "rushed",
        severity: "info",
        message: "Three stops in a row with no night. Consider staying somewhere to enjoy it.",
      });
    }
  }

  // 6. Short notice.
  if (today && daysUntil(itinerary.startDate, today) < LIMITS.minNoticeDays) {
    warnings.push({
      id: "notice",
      severity: "info",
      message: `Operators need at least ${LIMITS.minNoticeDays} days' notice to arrange a trip.`,
    });
  }

  return warnings;
}
