"use client";

import Link from "next/link";
import { Route } from "lucide-react";
import { useItinerary } from "@/context/ItineraryProvider";
import { cn } from "@/lib/utils";

export interface ItineraryCountProps {
  tone?: "dark" | "light";
  className?: string;
}

/** Client Component: shows the live number of stops from the itinerary store. */
export function ItineraryCount({ tone = "dark", className }: ItineraryCountProps) {
  const { count, hydrated } = useItinerary();
  const label = count === 1 ? "1 stop" : `${count} stops`;
  return (
    <Link
      href="/itinerary"
      className={cn(
        "relative inline-flex h-10 items-center gap-2 rounded-full pl-3 pr-4 text-sm font-medium transition",
        tone === "light" ? "bg-snow/15 text-snow ring-1 ring-snow/25 hover:bg-snow/25" : "bg-ink text-snow hover:bg-ink-2",
        className,
      )}
      aria-label={`My trip, ${hydrated ? label : "loading"}`}
    >
      <Route className="size-4" aria-hidden />
      <span>My trip</span>
      <span
        className={cn(
          "tabular grid min-w-5 place-items-center rounded-full px-1.5 text-xs leading-5 transition",
          count > 0 ? "bg-apricot-bright text-snow" : "bg-snow/20",
        )}
      >
        {hydrated ? count : "·"}
      </span>
    </Link>
  );
}
