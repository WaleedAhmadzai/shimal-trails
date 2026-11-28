import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  CalendarRange,
  ChevronRight,
  Clock,
  Info,
  Mountain,
  ShieldAlert,
  Signal,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge, DifficultyBadge } from "@/components/common/Badge";
import { SectionHeading } from "@/components/common/SectionHeading";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationImage } from "@/components/destinations/DestinationImage";
import { FactGrid } from "@/components/destinations/FactGrid";
import { FavouriteButton } from "@/components/destinations/FavouriteButton";
import { PhotoCredit } from "@/components/destinations/PhotoCredit";
import { SeasonBar } from "@/components/destinations/SeasonBar";
import { AddToItineraryButton } from "@/components/itinerary/AddToItineraryButton";
import { TIER_LABELS, TIER_NOTES } from "@/data/pricing";
import { getRegion } from "@/data/regions";
import { getAllDestinations, getDestinationBySlug, nearbyDestinations } from "@/lib/destinations";
import { findRoute, getNode, getPass } from "@/lib/itinerary/roads";
import { formatAltitude, formatHours, formatPkr, monthRanges } from "@/lib/utils";
import type { Tier } from "@/types";

/** Pre-build all 18 detail pages at build time. */
export function generateStaticParams() {
  return getAllDestinations().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) return { title: "Destination not found" };
  return {
    title: `${destination.name}: when to go, how to get there, costs`,
    description: destination.summary,
    openGraph: {
      title: destination.name,
      description: destination.summary,
      images: destination.photo ? [{ url: destination.photo.src.src, alt: destination.photo.alt }] : undefined,
    },
  };
}

export default async function DestinationPage({ params }: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();

  const region = getRegion(destination.region);
  const route = findRoute("islamabad", destination.nodeId, destination.bestMonths[0]);
  const nearby = nearbyDestinations(destination);
  const tiers: Tier[] = ["economy", "standard", "premium"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.summary,
    geo: { "@type": "GeoCoordinates", latitude: destination.coordinates.lat, longitude: destination.coordinates.lng },
    containedInPlace: { "@type": "AdministrativeArea", name: region?.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative isolate flex min-h-[78svh] flex-col overflow-hidden bg-ink text-snow">
        <div className="absolute inset-0 -z-20">
          <DestinationImage destination={destination} sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/95" />

        <div className="container-page flex flex-1 flex-col justify-end pb-10 pt-28">
          <nav aria-label="Breadcrumb" className="mb-auto">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-snow/70">
              <li><Link href="/" className="hover:text-snow">Home</Link></li>
              <ChevronRight className="size-3.5" aria-hidden />
              <li><Link href="/destinations" className="hover:text-snow">Destinations</Link></li>
              <ChevronRight className="size-3.5" aria-hidden />
              <li aria-current="page" className="text-snow">{destination.name}</li>
            </ol>
          </nav>

          <div className="mt-16 flex flex-wrap items-center gap-2">
            <Badge tone="glass">{region?.name}</Badge>
            <DifficultyBadge level={destination.difficulty} glass />
            {destination.familyFriendly && <Badge tone="glass">Family-friendly</Badge>}
          </div>
          <h1 className="mt-4 max-w-4xl animate-rise text-6xl leading-[0.92] sm:text-8xl">{destination.name}</h1>
          <p className="mt-5 max-w-2xl animate-rise text-lg leading-relaxed text-snow/80 [animation-delay:100ms]">
            {destination.summary}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <AddToItineraryButton slug={destination.slug} name={destination.name} className="hidden sm:inline-flex" />
            <FavouriteButton slug={destination.slug} name={destination.name} className="size-13" />
            <span className="ml-auto hidden font-mono text-xs tracking-[0.16em] text-snow/60 uppercase sm:block">
              {destination.coordinates.lat.toFixed(2)}° N · {destination.coordinates.lng.toFixed(2)}° E ·{" "}
              {formatAltitude(destination.altitudeM)}
            </span>
          </div>
          {destination.photo && <PhotoCredit photo={destination.photo} className="mt-6 text-xs text-snow/50" />}
        </div>
      </section>

      {/* Facts + season */}
      <section className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <FactGrid
            facts={[
              { icon: Mountain, label: "Altitude", value: formatAltitude(destination.altitudeM), note: "Where you sleep" },
              { icon: Clock, label: "From Islamabad", value: route ? formatHours(route.hours) : "—", note: route ? `${route.km} km by road` : undefined },
              { icon: BedDouble, label: "Stay", value: destination.recommendedNights === 0 ? "Day trip" : `${destination.recommendedNights} ${destination.recommendedNights === 1 ? "night" : "nights"}`, note: "Recommended" },
              { icon: CalendarRange, label: "Best time", value: monthRanges(destination.bestMonths) },
              { icon: Users, label: "Good for", value: destination.familyFriendly ? "Families" : "Fit adults", note: `${destination.difficulty[0].toUpperCase()}${destination.difficulty.slice(1)} difficulty` },
              { icon: Signal, label: "Network", value: destination.network.split(";")[0], note: destination.network.split(";")[1]?.trim() },
            ]}
          />
        </div>
        <div className="rounded-2xl border border-line bg-snow p-6">
          <h2 className="font-sans text-base font-medium">When to go</h2>
          <p className="mt-1 text-sm text-muted">
            Best {monthRanges(destination.bestMonths)} · reachable {monthRanges(destination.openMonths)}
          </p>
          <div className="mt-6">
            <SeasonBar bestMonths={destination.bestMonths} openMonths={destination.openMonths} />
          </div>
          {destination.closureNote && (
            <p className="mt-6 flex gap-2 rounded-xl bg-warning-soft p-3 text-sm text-warning">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              {destination.closureNote}
            </p>
          )}
        </div>
      </section>

      {/* Overview */}
      <section className="container-page grid gap-12 pb-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow mb-4 text-muted">Overview</p>
          <p className="font-display text-3xl leading-[1.2] text-ink sm:text-4xl">{destination.description}</p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 font-sans text-base font-medium">
              <Sparkles className="size-4 text-apricot" aria-hidden /> Highlights
            </h2>
            <ul className="mt-4 space-y-3">
              {destination.highlights.map((h) => (
                <li key={h} className="border-b border-line pb-3 text-sm">{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 font-sans text-base font-medium">
              <Mountain className="size-4 text-pine" aria-hidden /> Things to do
            </h2>
            <ul className="mt-4 space-y-3">
              {destination.thingsToDo.map((t) => (
                <li key={t} className="border-b border-line pb-3 text-sm">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Getting there + stays */}
      <section className="border-y border-line bg-snow">
        <div className="container-page grid gap-14 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Getting there" title="The road from Islamabad" />
            {route && (
              <ol className="mt-8">
                {route.edges.map((edge, i) => {
                  const from = getNode(route.path[i])!;
                  const to = getNode(route.path[i + 1])!;
                  return (
                    <li key={`${from.id}-${to.id}`} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-line py-3.5 text-sm">
                      <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="font-medium">{from.name} → {to.name}</span>
                        <span className="block text-xs text-muted">
                          {edge.road}
                          {edge.pass && ` · crosses ${getPass(edge.pass).name}, open ${monthRanges(getPass(edge.pass).openMonths)}`}
                        </span>
                      </span>
                      <span className="tabular text-right text-muted">{formatHours(edge.hours)}</span>
                    </li>
                  );
                })}
                <li className="flex justify-between pt-4 text-sm font-medium">
                  <span>Total, in good weather</span>
                  <span className="tabular">{formatHours(route.hours)} · {route.km} km</span>
                </li>
              </ol>
            )}
          </div>
          <div>
            <SectionHeading eyebrow="Where to stay" title="Per room, per night" />
            <ul className="mt-8 grid gap-3">
              {tiers.map((tier) => (
                <li key={tier} className="flex items-center justify-between rounded-2xl border border-line p-5">
                  <span>
                    <span className="font-medium">{TIER_LABELS[tier]}</span>
                    <span className="block text-sm text-muted">{TIER_NOTES[tier]}</span>
                  </span>
                  <span className="tabular font-display text-2xl">{formatPkr(destination.costPerNightPkr[tier])}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Estimates from Nov 2026. Peak-season weekends cost more.</p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl bg-ink p-7 text-snow">
            <h2 className="flex items-center gap-2 font-sans text-base font-medium">
              <ShieldAlert className="size-4 text-apricot-bright" aria-hidden /> Tips and safety
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-snow/80">
              {destination.tips.map((tip) => (
                <li key={tip} className="flex gap-3"><span className="text-apricot-bright">—</span>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line p-7">
            <h2 className="font-sans text-base font-medium">For foreign visitors</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {destination.permitNote ?? "No special permit is usually needed. Carry your ID and follow local guidance."}
            </p>
            <h2 className="mt-6 font-sans text-base font-medium">Sources</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {destination.sources.map((source) => (
                <li key={source}>
                  <a href={source} target="_blank" rel="noreferrer" className="text-pine underline-offset-4 hover:underline">
                    {source.replace("https://", "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="container-page pb-28 sm:pb-24">
        <SectionHeading eyebrow="Combine with" title="Nearby destinations" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nearby.map((d) => (
            <DestinationCard key={d.slug} destination={d} variant="compact" />
          ))}
        </div>
      </section>

      {/* Sticky mobile action bar */}
      <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur-xl sm:hidden">
        <AddToItineraryButton slug={destination.slug} name={destination.name} className="w-full" />
      </div>
    </>
  );
}
