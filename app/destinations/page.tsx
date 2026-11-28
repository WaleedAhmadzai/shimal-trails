import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Topography } from "@/components/common/Topography";
import { CardGridSkeleton } from "@/components/destinations/CardGridSkeleton";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationFilters } from "@/components/destinations/DestinationFilters";
import { regions } from "@/data/regions";
import {
  DIFFICULTY_LABELS,
  EMPTY_FILTERS,
  filtersToQuery,
  getAllDestinations,
  parseFilters,
  queryDestinations,
  suggestRelaxations,
} from "@/lib/destinations";
import { MONTHS_LONG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Search and filter 18 destinations in northern Pakistan by region, best month, difficulty and trip length. Hunza, Skardu, Naran, Swat, Neelum and more.",
};

const RELAX_LABELS = {
  q: "Clear the search",
  region: "Any region",
  month: "Any month",
  difficulty: "Any difficulty",
  days: "Any trip length",
  family: "Include all trips",
} as const;

/**
 * Server Component. The heading is static; the results depend on the URL's
 * search params, so they render inside <Suspense> and stream in.
 */
export default function DestinationsPage({ searchParams }: PageProps<"/destinations">) {
  const total = getAllDestinations().length;
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-pine-soft/70 to-snow pt-32 pb-12 sm:pb-16">
        <Topography seed={2} className="text-pine/[0.08]" />
        <div className="container-page relative">
          <p className="eyebrow mb-4 flex items-center gap-2 text-pine">
            <span aria-hidden className="h-0.5 w-6 rounded-full bg-pine" />
            {total} destinations · 4 regions
          </p>
          <h1 className="max-w-3xl text-5xl leading-[0.98] sm:text-7xl">
            Find your <em>north</em>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Filter by the month you can travel and how many days you have. We only show places that are open and
            realistic for your trip.
          </p>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <Suspense fallback={<ResultsFallback />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/destinations">["searchParams"] }) {
  const filters = parseFilters(await searchParams);
  const results = queryDestinations(filters);
  const suggestions = results.length === 0 ? suggestRelaxations(filters) : [];

  return (
    <>
      <DestinationFilters filters={filters} resultCount={results.length} />
      <div className="mt-10">
        {results.length > 0 ? (
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((destination, i) => (
              <li key={destination.slug} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <DestinationCard destination={destination} index={i} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No destinations match"
            description={describeFilters(filters)}
          >
            {suggestions.slice(0, 3).map((s) => (
              <Link
                key={s.key}
                href={`/destinations${filtersToQuery({ ...filters, [s.key]: EMPTY_FILTERS[s.key] })}`}
                className="rounded-full border border-line-strong bg-snow px-4 py-2 text-sm font-medium hover:border-ink"
              >
                {RELAX_LABELS[s.key]} · {s.count} {s.count === 1 ? "result" : "results"}
              </Link>
            ))}
            <Link href="/destinations" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-snow">
              Show everything
            </Link>
          </EmptyState>
        )}
      </div>
    </>
  );
}

function describeFilters(f: ReturnType<typeof parseFilters>) {
  const parts = [
    f.q && `matching “${f.q}”`,
    f.region && `in ${regions.find((r) => r.id === f.region)?.name}`,
    f.month && `best in ${MONTHS_LONG[f.month - 1]}`,
    f.difficulty && `rated ${DIFFICULTY_LABELS[f.difficulty].toLowerCase()}`,
    f.days && `that fit in ${f.days} days`,
    f.family && "that are family-friendly",
  ].filter(Boolean);
  return `Nothing ${parts.join(", ")}. Try removing a filter:`;
}

function ResultsFallback() {
  return (
    <div className="space-y-10">
      <div className="h-13 animate-pulse rounded-full bg-paper-2" />
      <CardGridSkeleton />
    </div>
  );
}
