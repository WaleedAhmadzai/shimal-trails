import type { Metadata } from "next";
import { Suspense } from "react";
import { BuilderSkeleton, ItineraryBuilder } from "@/components/itinerary/ItineraryBuilder";

export const metadata: Metadata = {
  title: "Itinerary builder",
  description:
    "Build a day-by-day northern Pakistan itinerary with real drive times, pass closures, altitude checks and a live PKR budget. Share it in one link.",
};

/** Server Component shell; the interactive builder inside is a Client Component. */
export default function ItineraryPage() {
  return (
    <div className="container-page pt-28 pb-32 lg:pb-24">
      <header className="mb-10 max-w-3xl">
        <p className="eyebrow mb-4 flex items-center gap-2 text-pine">
          <span aria-hidden className="h-0.5 w-6 rounded-full bg-pine" />
          Itinerary builder
        </p>
        <h1 className="text-5xl leading-[0.98] sm:text-7xl">
          Your trip, <em>day by day</em>
        </h1>
        <p className="mt-4 text-lg text-muted">
          Add places, set the nights, and the planner works out the roads, the days, the checks and the cost.
        </p>
      </header>
      {/* The builder reads the URL (shared links), so it sits inside Suspense. */}
      <Suspense fallback={<BuilderSkeleton />}>
        <ItineraryBuilder />
      </Suspense>
    </div>
  );
}
