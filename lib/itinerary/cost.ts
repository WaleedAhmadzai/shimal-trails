import { BUFFER_RATE, foodPerPersonPerDay, transitRoomPerNight, vehicles } from "@/data/pricing";
import type { CostBreakdown, Itinerary } from "@/types";
import type { TripPlan } from "./days";

export function vehicleFor(travellers: number) {
  return vehicles.find((v) => travellers <= v.maxTravellers) ?? vehicles[vehicles.length - 1];
}

/** Estimated trip cost in PKR. Clearly an estimate, never a quote. */
export function estimateCost(itinerary: Itinerary, plan: TripPlan): CostBreakdown {
  const travellers = Math.max(1, itinerary.travellers);
  const rooms = Math.ceil(travellers / 2);
  const byName = new Map(plan.stops.map((s) => [s.destination.name, s.destination]));

  const stay = plan.days.reduce((sum, day) => {
    if (!day.sleepAt) return sum;
    const destination = byName.get(day.sleepAt);
    const perRoom = destination
      ? destination.costPerNightPkr[itinerary.tier]
      : transitRoomPerNight[itinerary.tier];
    return sum + perRoom * rooms;
  }, 0);

  const vehicle = vehicleFor(travellers);
  const transport = plan.totalKm * vehicle.ratePerKm;
  const food = plan.days.length * travellers * foodPerPersonPerDay[itinerary.tier];
  const subtotal = stay + transport + food;
  const buffer = Math.round(subtotal * BUFFER_RATE);
  const total = subtotal + buffer;

  return {
    stay,
    transport,
    food,
    buffer,
    total,
    perPerson: Math.round(total / travellers),
    vehicle: vehicle.label,
  };
}
