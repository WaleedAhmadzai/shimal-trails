"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Copy, Minus, Plus, Printer, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { SelectField } from "@/components/common/SelectField";
import { useFavourites } from "@/context/FavouritesProvider";
import { todayIso, useItinerary } from "@/context/ItineraryProvider";
import { useToast } from "@/context/ToastProvider";
import { LIMITS, TIER_LABELS, TIER_NOTES } from "@/data/pricing";
import { templates } from "@/data/templates";
import { getNode, parseSharedItinerary, planTrip, serializeItinerary } from "@/lib/itinerary";
import { MONTHS_LONG, addDays, cn, formatPkr, monthOf } from "@/lib/utils";
import type { Tier } from "@/types";
import { DayTimeline } from "./DayTimeline";
import { DestinationPicker } from "./DestinationPicker";
import { ElevationProfile } from "./ElevationProfile";
import { ItineraryStop } from "./ItineraryStop";
import { TripSummary } from "./TripSummary";
import { WarningList } from "./WarningList";

// Client Component: the whole builder reacts to clicks and typing (nights
// steppers, reorder, settings, share) and reads the shared itinerary store.
// The route, days, cost and warnings are recomputed from that state by the
// pure functions in lib/itinerary on every change.

export function ItineraryBuilder() {
  const store = useItinerary();
  const { favourites } = useFavourites();
  const { notify } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dismissedShare, setDismissedShare] = useState(false);
  const { itinerary, hydrated } = store;

  const shared = useMemo(() => parseSharedItinerary(new URLSearchParams(searchParams.toString())), [searchParams]);
  const today = hydrated ? todayIso() : itinerary.startDate;
  const { plan, cost, warnings } = useMemo(() => planTrip(itinerary, today), [itinerary, today]);
  const month = monthOf(itinerary.startDate);

  if (!hydrated) return <BuilderSkeleton />;

  const copyLink = async () => {
    const url = `${window.location.origin}/itinerary?${serializeItinerary(itinerary)}`;
    try {
      await navigator.clipboard.writeText(url);
      notify("Share link copied. Paste it in WhatsApp.");
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const flagged = warnings.flatMap((w) => (w.day && w.severity !== "info" ? [w.day] : []));
  const closedSlugs = warnings.flatMap((w) => (w.id.startsWith("closed-") ? [w.id.slice(7)] : []));

  return (
    <div className="space-y-8">
      {shared && !dismissedShare && shared.itinerary.stops.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-glacier/30 bg-glacier-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-glacier">
            <Share2 className="mr-2 inline size-4" aria-hidden />
            Someone shared a plan with {shared.itinerary.stops.length} stops.
            {shared.skipped.length > 0 && ` ${shared.skipped.length} unknown place(s) were skipped.`}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                store.replace(shared.itinerary);
                setDismissedShare(true);
                router.replace("/itinerary", { scroll: false });
                notify("Shared plan opened");
              }}
            >
              Open shared plan
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDismissedShare(true)}>
              Keep mine
            </Button>
          </div>
        </div>
      )}

      {/* Trip settings */}
      <section aria-label="Trip settings" className="grid gap-4 rounded-3xl border border-line bg-snow p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="start-date" className="text-xs font-medium text-ink-2">Start date</label>
          <input
            id="start-date"
            type="date"
            value={itinerary.startDate}
            min={addDays(today, 1)}
            onChange={(e) => e.target.value && store.updateSettings({ startDate: e.target.value })}
            className="h-11 rounded-full border border-line-strong bg-snow px-4 text-sm outline-none focus:border-ink"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span id="travellers-label" className="text-xs font-medium text-ink-2">Travellers</span>
          <div className="flex h-11 items-center justify-between rounded-full border border-line-strong px-1.5" role="group" aria-labelledby="travellers-label">
            <button
              type="button"
              onClick={() => store.updateSettings({ travellers: Math.max(1, itinerary.travellers - 1) })}
              disabled={itinerary.travellers <= 1}
              className="grid size-8 place-items-center rounded-full hover:bg-paper-2 disabled:opacity-30"
              aria-label="One traveller fewer"
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="tabular text-sm" aria-live="polite">{itinerary.travellers} {itinerary.travellers === 1 ? "person" : "people"}</span>
            <button
              type="button"
              onClick={() => store.updateSettings({ travellers: Math.min(LIMITS.maxTravellers, itinerary.travellers + 1) })}
              disabled={itinerary.travellers >= LIMITS.maxTravellers}
              className="grid size-8 place-items-center rounded-full hover:bg-paper-2 disabled:opacity-30"
              aria-label="One more traveller"
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
        </div>
        <SelectField
          label="Comfort"
          value={itinerary.tier}
          onChange={(e) => store.updateSettings({ tier: e.target.value as Tier })}
          options={(Object.keys(TIER_LABELS) as Tier[]).map((t) => ({ value: t, label: `${TIER_LABELS[t]} · ${TIER_NOTES[t]}` }))}
        />
        <SelectField
          label="Starting from"
          value={itinerary.startCity}
          onChange={(e) => store.updateSettings({ startCity: e.target.value as "islamabad" | "lahore" })}
          options={[
            { value: "islamabad", label: "Islamabad / Rawalpindi" },
            { value: "lahore", label: "Lahore" },
          ]}
        />
      </section>

      {plan.stops.length === 0 ? (
        <EmptyBuilder onTemplate={store.loadTemplate} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div className="space-y-8">
            <section aria-labelledby="stops-heading">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 id="stops-heading" className="text-3xl">Stops</h2>
                <p className="text-sm text-muted">
                  From {getNode(itinerary.startCity)?.name}, back to {getNode(itinerary.startCity)?.name}
                </p>
              </div>
              <ol className="space-y-3">
                {itinerary.stops.map((stop, i) => {
                  const resolved = plan.stops.find((s) => s.destination.slug === stop.slug);
                  if (!resolved) return null;
                  return (
                    <ItineraryStop
                      key={stop.slug}
                      destination={resolved.destination}
                      nights={stop.nights}
                      index={i}
                      isFirst={i === 0}
                      isLast={i === itinerary.stops.length - 1}
                      closed={closedSlugs.includes(stop.slug)}
                      onNightsChange={(n) => store.setNights(stop.slug, n)}
                      onMove={(d) => store.move(stop.slug, d)}
                      onRemove={() => {
                        store.remove(stop.slug);
                        notify(`Removed ${resolved.destination.name}`);
                      }}
                    />
                  );
                })}
              </ol>
            </section>

            {itinerary.stops.length < LIMITS.maxStops && (
              <DestinationPicker
                exclude={itinerary.stops.map((s) => s.slug)}
                favourites={favourites}
                startDate={itinerary.startDate}
                onPick={(slug) => store.add(slug)}
              />
            )}

            <section aria-labelledby="altitude-heading" className="rounded-3xl border border-line bg-snow p-5">
              <h2 id="altitude-heading" className="font-sans text-base font-medium">Where you sleep, night by night</h2>
              <p className="text-sm text-muted">Above the dashed line, add rest nights to acclimatise.</p>
              <ElevationProfile className="mt-4" days={plan.days} startAltitudeM={getNode(itinerary.startCity)?.altitudeM ?? 540} />
            </section>

            <section aria-labelledby="days-heading">
              <h2 id="days-heading" className="mb-6 text-3xl">Day by day</h2>
              <DayTimeline days={plan.days} flaggedDays={flagged} />
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <TripSummary itinerary={itinerary} plan={plan} cost={cost}>
              <Button href="/plan-trip" variant="accent" className="w-full">
                Request a quote <ArrowRight className="size-4" aria-hidden />
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={copyLink} className="flex flex-col items-center gap-1 rounded-xl bg-snow/10 py-2.5 text-xs hover:bg-snow/15">
                  <Copy className="size-4" aria-hidden /> Share
                </button>
                <button type="button" onClick={() => window.print()} className="flex flex-col items-center gap-1 rounded-xl bg-snow/10 py-2.5 text-xs hover:bg-snow/15">
                  <Printer className="size-4" aria-hidden /> Print
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Remove every stop from this plan?")) store.clear();
                  }}
                  className="flex flex-col items-center gap-1 rounded-xl bg-snow/10 py-2.5 text-xs hover:bg-snow/15"
                >
                  <RotateCcw className="size-4" aria-hidden /> Clear
                </button>
              </div>
            </TripSummary>
            <section aria-label="Checks" className="rounded-3xl border border-line bg-snow p-5">
              <h2 className="mb-3 font-sans text-base font-medium">Checks for {MONTHS_LONG[month - 1]}</h2>
              <WarningList warnings={warnings} />
            </section>
          </aside>

          {/* Mobile bottom bar */}
          <div className="no-print fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur-xl lg:hidden">
            <p className="text-sm">
              <span className="tabular block font-display text-2xl leading-none">{formatPkr(cost.perPerson)}</span>
              <span className="text-muted">per person · {plan.days.length} days</span>
            </p>
            <Button href="/plan-trip" variant="accent" size="sm">Get a quote</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyBuilder({ onTemplate }: { onTemplate: (id: string) => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong bg-snow/60 p-6 sm:p-10">
      <h2 className="text-4xl">Start with a ready-made plan</h2>
      <p className="mt-2 max-w-lg text-muted">Or browse destinations and add the places you like.</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {templates.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onTemplate(t.id)}
              className="group flex h-full w-full flex-col rounded-2xl border border-line bg-snow p-5 text-left transition hover:-translate-y-0.5 hover:border-ink hover:shadow-soft"
            >
              <span className="font-mono text-xs text-muted">{t.days} days</span>
              <span className="mt-3 font-display text-2xl">{t.name}</span>
              <span className="mt-1 text-sm text-muted">{t.tagline}</span>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium">
                Use this plan <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Link href="/destinations" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-apricot underline-offset-4 hover:underline">
        Browse all destinations <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

export function BuilderSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading your itinerary">
      <div className="h-24 animate-pulse rounded-3xl bg-paper-2" />
      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("h-24 animate-pulse rounded-2xl bg-paper-2")} />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-paper-2" />
      </div>
    </div>
  );
}
