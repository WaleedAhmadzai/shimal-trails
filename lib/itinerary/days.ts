import { LIMITS } from "@/data/pricing";
import { getDestinationBySlug } from "@/lib/destinations";
import { addDays, monthOf } from "@/lib/utils";
import type { Day, Destination, Itinerary, Leg } from "@/types";
import { findRoute, getNode, getPass, routeToLeg, type Route } from "./roads";

export interface ResolvedStop {
  destination: Destination;
  nights: number;
}

export interface TripPlan {
  stops: ResolvedStop[];
  legs: Leg[];
  days: Day[];
  totalKm: number;
  totalDriveHours: number;
}

export function resolveStops(itinerary: Itinerary): ResolvedStop[] {
  return itinerary.stops.flatMap((s) => {
    const destination = getDestinationBySlug(s.slug);
    return destination ? [{ destination, nights: s.nights }] : [];
  });
}

/** The route for a trip month, falling back to any route if passes are shut. */
export function routeFor(from: string, to: string, month: number): Route | null {
  return findRoute(from, to, month) ?? findRoute(from, to);
}

const nodeName = (id: string) => getNode(id)?.name ?? id;

/**
 * Turn stops into a day-by-day plan:
 * each leg is driven in days of at most 9 hours (longer legs get an overnight
 * in a transit town), each stop adds its nights, and the trip ends back home.
 */
export function buildTripPlan(itinerary: Itinerary): TripPlan {
  const stops = resolveStops(itinerary);
  const month = monthOf(itinerary.startDate);
  const days: Day[] = [];
  const legs: Leg[] = [];
  if (stops.length === 0) return { stops, legs, days, totalKm: 0, totalDriveHours: 0 };

  let current = itinerary.startCity as string;
  let dayStart = nodeName(current);
  let hours = 0;
  let km = 0;
  let notes: string[] = [];

  const push = (
    kind: Day["kind"],
    title: string,
    sleepAt: string | null,
    sleepAltitudeM: number | null,
  ) => {
    days.push({
      n: days.length + 1,
      date: addDays(itinerary.startDate, days.length),
      kind,
      title,
      driveHours: Math.round(hours * 10) / 10,
      km,
      sleepAt,
      sleepAltitudeM,
      notes,
    });
    hours = 0;
    km = 0;
    notes = [];
  };

  const drive = (route: Route) => {
    route.edges.forEach((edge, i) => {
      const from = route.path[i];
      if (hours > 0 && hours + edge.hours > LIMITS.maxDriveHoursPerDay) {
        const transit = getNode(from)!;
        notes.push(`Overnight in ${transit.name} to break the drive`);
        push("travel", `${dayStart} → ${transit.name}`, transit.name, transit.altitudeM);
        dayStart = transit.name;
      }
      hours += edge.hours;
      km += edge.km;
      if (edge.pass) {
        const pass = getPass(edge.pass);
        notes.push(`Crosses ${pass.name} (${pass.altitudeM.toLocaleString("en-PK")} m)`);
      }
    });
  };

  for (const stop of stops) {
    const { destination } = stop;
    const route = routeFor(current, destination.nodeId, month);
    if (route) {
      legs.push(routeToLeg(route));
      drive(route);
    }
    if (stop.nights > 0) {
      push("travel", `${dayStart} → ${destination.name}`, destination.name, destination.altitudeM);
      for (let k = 1; k < stop.nights; k++) {
        notes = [`Free day in ${destination.name}`];
        push("explore", `Explore ${destination.name}`, destination.name, destination.altitudeM);
      }
      dayStart = destination.name;
    } else {
      hours += LIMITS.visitHoursForDayStop;
      notes.push(`Visit ${destination.name} (about ${LIMITS.visitHoursForDayStop} h)`);
    }
    current = destination.nodeId;
  }

  const home = routeFor(current, itinerary.startCity, month);
  if (home) {
    legs.push(routeToLeg(home));
    drive(home);
  }
  push("return", `${dayStart} → ${nodeName(itinerary.startCity)}`, null, null);

  return {
    stops,
    legs,
    days,
    totalKm: legs.reduce((sum, l) => sum + l.km, 0),
    totalDriveHours: legs.reduce((sum, l) => sum + l.hours, 0),
  };
}
