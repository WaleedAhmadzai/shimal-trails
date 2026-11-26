"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { LIMITS } from "@/data/pricing";
import { getTemplate } from "@/data/templates";
import { getDestinationBySlug } from "@/lib/destinations";
import { addDays } from "@/lib/utils";
import type { Itinerary, ItineraryStop } from "@/types";

// Client Component: it holds state (useReducer), reads and writes
// localStorage, and is shared by the navbar badge, the add buttons, the
// builder and the form. Server pages passed in as children stay server.

const STORAGE_KEY = "shimal:itinerary:v1";

type State = Itinerary & { hydrated: boolean };

type Action =
  | { type: "HYDRATE"; itinerary: Itinerary }
  | { type: "ADD_STOP"; slug: string }
  | { type: "REMOVE_STOP"; slug: string }
  | { type: "MOVE_STOP"; slug: string; direction: -1 | 1 }
  | { type: "SET_NIGHTS"; slug: string; nights: number }
  | { type: "UPDATE_SETTINGS"; settings: Partial<Omit<Itinerary, "stops">> }
  | { type: "REPLACE"; itinerary: Partial<Itinerary> & { stops: ItineraryStop[] } }
  | { type: "CLEAR" };

const initialState: State = {
  hydrated: false,
  startDate: "2027-06-01",
  startCity: "islamabad",
  travellers: 2,
  tier: "standard",
  stops: [],
};

function clampNights(n: number) {
  return Math.min(Math.max(Math.round(n), 0), LIMITS.maxNightsPerStop);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.itinerary, hydrated: true };
    case "ADD_STOP": {
      if (state.stops.some((s) => s.slug === action.slug) || state.stops.length >= LIMITS.maxStops) return state;
      const destination = getDestinationBySlug(action.slug);
      if (!destination) return state;
      return { ...state, stops: [...state.stops, { slug: action.slug, nights: destination.recommendedNights }] };
    }
    case "REMOVE_STOP":
      return { ...state, stops: state.stops.filter((s) => s.slug !== action.slug) };
    case "MOVE_STOP": {
      const index = state.stops.findIndex((s) => s.slug === action.slug);
      const target = index + action.direction;
      if (index < 0 || target < 0 || target >= state.stops.length) return state;
      const stops = [...state.stops];
      [stops[index], stops[target]] = [stops[target], stops[index]];
      return { ...state, stops };
    }
    case "SET_NIGHTS":
      return {
        ...state,
        stops: state.stops.map((s) => (s.slug === action.slug ? { ...s, nights: clampNights(action.nights) } : s)),
      };
    case "UPDATE_SETTINGS":
      return { ...state, ...action.settings };
    case "REPLACE":
      return { ...state, ...action.itinerary };
    case "CLEAR":
      return { ...state, stops: [] };
  }
}

/** Accept only well-formed saved data; anything else falls back to defaults. */
function sanitise(raw: unknown, fallback: Itinerary): Itinerary {
  if (!raw || typeof raw !== "object") return fallback;
  const r = raw as Partial<Itinerary>;
  const stops = Array.isArray(r.stops)
    ? r.stops
        .filter((s): s is ItineraryStop => typeof s?.slug === "string" && Boolean(getDestinationBySlug(s.slug)))
        .map((s) => ({ slug: s.slug, nights: clampNights(Number(s.nights) || 0) }))
        .slice(0, LIMITS.maxStops)
    : [];
  return {
    startDate: typeof r.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.startDate) ? r.startDate : fallback.startDate,
    startCity: r.startCity === "lahore" ? "lahore" : "islamabad",
    travellers:
      Number.isInteger(r.travellers) && r.travellers! >= 1 && r.travellers! <= LIMITS.maxTravellers
        ? r.travellers!
        : fallback.travellers,
    tier: r.tier === "economy" || r.tier === "premium" ? r.tier : "standard",
    stops,
  };
}

export function todayIso() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

interface ItineraryContextValue {
  itinerary: Itinerary;
  hydrated: boolean;
  count: number;
  has: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  move: (slug: string, direction: -1 | 1) => void;
  setNights: (slug: string, nights: number) => void;
  updateSettings: (settings: Partial<Omit<Itinerary, "stops">>) => void;
  loadTemplate: (id: string) => void;
  replace: (itinerary: Partial<Itinerary> & { stops: ItineraryStop[] }) => void;
  clear: () => void;
}

const ItineraryContext = createContext<ItineraryContextValue | null>(null);

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Read saved data only after mount, so server and client HTML match.
  useEffect(() => {
    const fallback: Itinerary = { ...initialState, startDate: addDays(todayIso(), 21) };
    let saved: unknown = null;
    try {
      saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    } catch {
      saved = null;
    }
    dispatch({ type: "HYDRATE", itinerary: sanitise(saved, fallback) });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { startDate, startCity, travellers, tier, stops } = state;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ startDate, startCity, travellers, tier, stops }));
  }, [state]);

  const has = useCallback((slug: string) => state.stops.some((s) => s.slug === slug), [state.stops]);

  const value = useMemo<ItineraryContextValue>(() => {
    const { hydrated, ...itinerary } = state;
    return {
      itinerary,
      hydrated,
      count: state.stops.length,
      has,
      add: (slug) => dispatch({ type: "ADD_STOP", slug }),
      remove: (slug) => dispatch({ type: "REMOVE_STOP", slug }),
      move: (slug, direction) => dispatch({ type: "MOVE_STOP", slug, direction }),
      setNights: (slug, nights) => dispatch({ type: "SET_NIGHTS", slug, nights }),
      updateSettings: (settings) => dispatch({ type: "UPDATE_SETTINGS", settings }),
      loadTemplate: (id) => {
        const template = getTemplate(id);
        if (template) dispatch({ type: "REPLACE", itinerary: { stops: template.stops } });
      },
      replace: (next) => dispatch({ type: "REPLACE", itinerary: next }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state, has]);

  return <ItineraryContext.Provider value={value}>{children}</ItineraryContext.Provider>;
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) throw new Error("useItinerary must be used inside ItineraryProvider");
  return context;
}
