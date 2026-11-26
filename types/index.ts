import type { StaticImageData } from "next/image";

export type RegionId = "gilgit-baltistan" | "khyber-pakhtunkhwa" | "azad-kashmir" | "galiyat";
export type Difficulty = "easy" | "moderate" | "challenging";
export type Tier = "economy" | "standard" | "premium";
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type StartCity = "islamabad" | "lahore";

export interface Photo {
  src: StaticImageData;
  alt: string;
  author: string;
  licence: string;
  sourceUrl: string;
}

export interface Region {
  id: RegionId;
  name: string;
  blurb: string;
}

export interface Destination {
  slug: string;
  name: string;
  /** Other spellings people search for. */
  aliases: string[];
  region: RegionId;
  /** Town in the road graph this destination is reached from. */
  nodeId: string;
  coordinates: { lat: number; lng: number };
  /** Approximate altitude where you sleep, in metres. */
  altitudeM: number;
  difficulty: Difficulty;
  familyFriendly: boolean;
  tags: string[];
  bestMonths: Month[];
  /** Months the destination can be reached at all. */
  openMonths: Month[];
  closureNote?: string;
  recommendedNights: number;
  /** Estimated price of one room per night, by comfort tier. */
  costPerNightPkr: Record<Tier, number>;
  network: string;
  /** At most 160 characters; also used as the meta description. */
  summary: string;
  description: string;
  highlights: string[];
  thingsToDo: string[];
  tips: string[];
  permitNote?: string;
  photo?: Photo;
  sources: string[];
}

export interface RoadNode {
  id: string;
  name: string;
  altitudeM: number;
}

export interface RoadEdge {
  from: string;
  to: string;
  km: number;
  hours: number;
  road: string;
  pass?: PassId;
}

export type PassId = "babusar" | "khunjerab" | "deosai";

export interface Pass {
  id: PassId;
  name: string;
  altitudeM: number;
  openMonths: Month[];
}

export interface ItineraryStop {
  slug: string;
  nights: number;
}

export interface Itinerary {
  /** ISO date, YYYY-MM-DD. */
  startDate: string;
  startCity: StartCity;
  travellers: number;
  tier: Tier;
  stops: ItineraryStop[];
}

export interface Leg {
  from: string;
  to: string;
  km: number;
  hours: number;
  roads: string[];
  passes: PassId[];
}

export interface Day {
  n: number;
  date: string;
  kind: "travel" | "explore" | "return";
  title: string;
  driveHours: number;
  km: number;
  /** Where you sleep that night; null on the last day. */
  sleepAt: string | null;
  sleepAltitudeM: number | null;
  notes: string[];
}

export type WarningSeverity = "error" | "warning" | "info";

export interface TripWarning {
  id: string;
  severity: WarningSeverity;
  message: string;
  day?: number;
  fix?: string;
}

export interface CostBreakdown {
  stay: number;
  transport: number;
  food: number;
  buffer: number;
  total: number;
  perPerson: number;
  vehicle: string;
}

export interface Template {
  id: string;
  name: string;
  tagline: string;
  days: number;
  stops: ItineraryStop[];
  bestMonth: Month;
}

export interface TripRequest {
  fullName: string;
  mobile: string;
  email: string;
  startDate: string;
  travellers: string;
  tier: Tier | "";
  pickupCity: string;
  pickupOther: string;
  contactBy: "whatsapp" | "call" | "email";
  requests: string;
  agree: boolean;
}

export type TripRequestErrors = Partial<Record<keyof TripRequest, string>>;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  built: string;
}
