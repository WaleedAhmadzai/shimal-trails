import type { Tier } from "@/types";

/** Planning estimates set in November 2026. Not quotes. */
export const PRICING_SET = "Nov 2026";

export const vehicles = [
  { id: "car", label: "Car with driver", maxTravellers: 4, ratePerKm: 55 },
  { id: "hiace", label: "Hiace van with driver", maxTravellers: 12, ratePerKm: 85 },
  { id: "coaster", label: "Coaster bus with driver", maxTravellers: 20, ratePerKm: 130 },
] as const;

export const foodPerPersonPerDay: Record<Tier, number> = {
  economy: 2000,
  standard: 3500,
  premium: 6000,
};

/** Room price for a night spent in a transit town (Chilas, Besham...). */
export const transitRoomPerNight: Record<Tier, number> = {
  economy: 4000,
  standard: 8000,
  premium: 15000,
};

export const BUFFER_RATE = 0.1;

export const TIER_LABELS: Record<Tier, string> = {
  economy: "Economy",
  standard: "Standard",
  premium: "Premium",
};

export const TIER_NOTES: Record<Tier, string> = {
  economy: "Guesthouses and camps",
  standard: "Good mid-range hotels",
  premium: "Best resorts and heritage stays",
};

export const LIMITS = {
  maxTravellers: 20,
  maxNightsPerStop: 7,
  maxStops: 10,
  maxDriveHoursPerDay: 9,
  longDriveDayHours: 8,
  visitHoursForDayStop: 2,
  minNoticeDays: 3,
  altitudeJumpM: 1000,
  altitudeThresholdM: 3000,
} as const;
