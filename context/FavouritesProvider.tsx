"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { getDestinationBySlug } from "@/lib/destinations";

// Client Component: favourites are personal state kept in localStorage.
// localStorage is an external store, so we read it with
// useSyncExternalStore: the server renders "no favourites", the browser
// then shows the saved ones without a hydration mismatch.

const STORAGE_KEY = "shimal:favourites:v1";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedValue: string[] = EMPTY;

function read(): string[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw ?? "[]");
    cachedValue = Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string" && Boolean(getDestinationBySlug(s)))
      : EMPTY;
  } catch {
    cachedValue = EMPTY; // Corrupted data: start with no favourites.
  }
  return cachedValue;
}

function write(next: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener); // other tabs
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

interface FavouritesContextValue {
  favourites: string[];
  isFavourite: (slug: string) => boolean;
  /** Returns true when the place was added, false when removed. */
  toggle: (slug: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const favourites = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const adding = !current.includes(slug);
    write(adding ? [...current, slug] : current.filter((s) => s !== slug));
    return adding;
  }, []);

  const value = useMemo<FavouritesContextValue>(
    () => ({ favourites, isFavourite: (slug) => favourites.includes(slug), toggle }),
    [favourites, toggle],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error("useFavourites must be used inside FavouritesProvider");
  return context;
}
