import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarRange, Mountain, Route as RouteIcon, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/common/Button";
import { RegionTile } from "@/components/common/RegionTile";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Topography } from "@/components/common/Topography";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DayTimeline } from "@/components/itinerary/DayTimeline";
import { ElevationProfile } from "@/components/itinerary/ElevationProfile";
import { LoadTemplateButton } from "@/components/itinerary/LoadTemplateButton";
import { photos } from "@/data/photos";
import { regions } from "@/data/regions";
import { templates } from "@/data/templates";
import { getAllDestinations, getDestinationsBySlugs } from "@/lib/destinations";
import { planTrip } from "@/lib/itinerary";
import { MONTHS_LONG, MONTHS_SHORT, formatHours, formatPkr } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: "Shimal Trails · Plan your trip to northern Pakistan" },
  description:
    "Plan Hunza, Skardu, Naran, Swat and more with real drive times, pass closures by month, altitude checks and a live budget in PKR.",
};

// Server Component: everything here is display. The only interactive parts
// (heart buttons, "Open in builder") are small Client Components inside it.

const FEATURED = ["hunza-valley", "fairy-meadows", "skardu", "saif-ul-malook", "neelum-arang-kel", "swat-kalam"];

const SEASONS = [
  { name: "Spring", months: "Mar–May", month: 4, line: "Apricot and cherry blossom in Hunza; quiet roads before the rush." },
  { name: "Summer", months: "Jun–Aug", month: 7, line: "Every pass open. Deosai in flower, Fairy Meadows and the high lakes." },
  { name: "Autumn", months: "Sep–Nov", month: 10, line: "Golden poplars, clear skies and the best light of the year." },
  { name: "Winter", months: "Dec–Feb", month: 1, line: "Snow in Nathiagali and Naltar. The Karakoram Highway stays open." },
];

export default function HomePage() {
  const all = getAllDestinations();
  const featured = getDestinationsBySlugs(FEATURED);
  const sample = templates[1];
  const { plan, cost } = planTrip({
    startDate: "2027-10-08",
    startCity: "islamabad",
    travellers: 4,
    tier: "standard",
    stops: sample.stops,
  });

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-snow">
        <Image
          src={photos.fairyMeadows.src}
          alt={photos.fairyMeadows.alt}
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-20 scale-105 object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/20 to-pine-deep/95" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/60 to-transparent" />

        <div className="container-page flex flex-1 flex-col justify-end pb-10 pt-32 sm:pb-14">
          <p className="eyebrow mb-6 flex animate-rise items-center gap-3 text-snow/75">
            <span className="h-0.5 w-8 rounded-full bg-apricot-bright" />
            Northern Pakistan trip planner
          </p>
          <h1 className="max-w-4xl animate-rise text-[3.4rem] leading-[0.92] [animation-delay:80ms] sm:text-7xl lg:text-[7.5rem]">
            The North, <em className="text-apricot-bright">planned</em> properly.
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-base leading-relaxed text-snow/80 [animation-delay:160ms] sm:text-lg">
            Real drive times on real roads, pass closures by month, altitude checks and a live budget in PKR. From
            Islamabad to the Khunjerab Pass in one plan.
          </p>

          <form
            action="/destinations"
            method="get"
            className="mt-9 flex max-w-2xl animate-rise flex-col gap-2 rounded-3xl bg-snow/10 p-2 ring-1 ring-snow/20 backdrop-blur-xl [animation-delay:240ms] sm:flex-row sm:rounded-full"
          >
            <label htmlFor="hero-q" className="sr-only">Where do you want to go?</label>
            <input
              id="hero-q"
              name="q"
              placeholder="Where to? Hunza, lakes, Skardu…"
              className="h-12 flex-1 rounded-full bg-snow px-5 text-ink outline-none placeholder:text-muted"
            />
            <label htmlFor="hero-month" className="sr-only">When?</label>
            <select
              id="hero-month"
              name="month"
              defaultValue=""
              className="h-12 rounded-full bg-snow px-5 text-ink outline-none sm:w-44"
            >
              <option value="">Any month</option>
              {MONTHS_LONG.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <button type="submit" className="h-12 rounded-full bg-apricot px-7 font-medium text-snow transition hover:bg-apricot-bright">
              Explore
            </button>
          </form>

          <div className="mt-12 flex flex-col gap-6 border-t border-snow/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <dl className="grid grid-cols-3 gap-6 sm:flex sm:gap-12">
              {[
                [String(all.length), "Destinations"],
                ["3", "Passes tracked"],
                ["PKR", "Live budgets"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="eyebrow text-snow/55">{label}</dt>
                  <dd className="mt-1 font-display text-3xl sm:text-4xl">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="font-mono text-[0.68rem] leading-relaxed tracking-[0.14em] text-snow/55 uppercase sm:text-right">
              Nanga Parbat · 8,126 m
              <br />
              from Fairy Meadows · 3,300 m
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-20 sm:py-28">
        <SectionHeading
          eyebrow="Where to go"
          title={<>Six places that <em>never</em> disappoint</>}
          description="Hand-picked for first-timers and returning travellers alike. Every one has real drive times, season data and a budget."
          action={
            <Button href="/destinations" variant="outline">
              All {all.length} destinations <ArrowRight className="size-4" aria-hidden />
            </Button>
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((destination, i) => (
            <DestinationCard key={destination.slug} destination={destination} variant="compact" index={i} />
          ))}
        </div>
      </section>

      {/* Seasons */}
      <section className="border-y border-line bg-snow">
        <div className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-[0.9fr_1.6fr]">
          <SectionHeading
            eyebrow="When to go"
            title="Every season has its north"
            description="Roads and passes open and close with the snow. Pick a season and we show only what is good then."
          />
          <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {SEASONS.map((season) => (
              <Link
                key={season.name}
                href={`/destinations?month=${season.month}`}
                className="group flex flex-col justify-between gap-8 bg-snow p-6 transition hover:bg-pine-soft/60"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-muted">{season.months}</span>
                  <CalendarRange className="size-4 text-pine transition group-hover:text-apricot" aria-hidden />
                </div>
                <div>
                  <h3 className="text-4xl">{season.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{season.line}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                    Best in {MONTHS_SHORT[season.month - 1]}
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Engine showcase */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pine-deep via-ink to-ink text-snow">
        <Topography seed={4} className="text-snow/[0.07]" />
        <div className="container-page relative grid gap-14 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              tone="light"
              eyebrow="The planner"
              title={<>Not a brochure. <em className="text-apricot-soft">A plan.</em></>}
              description="Add places and the planner works out the route, splits long drives, checks every pass and the altitude you sleep at, and prices the trip as you go."
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                { icon: RouteIcon, title: "Real roads", text: "Fastest route on the Karakoram Highway, N-15 and valley roads, with drives capped at 9 hours a day." },
                { icon: CalendarRange, title: "Season aware", text: "Babusar, Khunjerab and Deosai closures by month, with automatic reroutes." },
                { icon: Mountain, title: "Altitude safe", text: "Flags any night that climbs more than 1,000 m above 3,000 m." },
                { icon: Wallet, title: "Honest PKR budget", text: "Rooms, vehicle and food by comfort level, per person and for the group." },
              ].map((item) => (
                <li key={item.title} className="border-t border-snow/15 pt-4">
                  <item.icon className="size-5 text-pine-bright" aria-hidden />
                  <h3 className="mt-3 font-sans text-base font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-snow/65">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-snow/[0.04] p-6 ring-1 ring-snow/15 backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-snow/55">Sample plan · October</p>
                <h3 className="mt-2 text-4xl">{sample.name}</h3>
              </div>
              <div className="text-right">
                <p className="eyebrow text-snow/55">Per person</p>
                <p className="tabular mt-2 font-display text-3xl text-apricot-soft">{formatPkr(cost.perPerson)}</p>
              </div>
            </div>
            <div className="mt-6">
              <ElevationProfile days={plan.days} startAltitudeM={540} tone="dark" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 border-y border-snow/10 py-4 font-mono text-xs text-snow/70">
              <span><span className="block text-lg text-snow">{plan.days.length}</span>days</span>
              <span><span className="block text-lg text-snow">{plan.totalKm.toLocaleString("en-PK")}</span>km</span>
              <span><span className="block text-lg text-snow">{formatHours(plan.totalDriveHours)}</span>driving</span>
            </div>
            <div className="mt-6 max-h-72 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
              <DayTimeline days={plan.days} compact tone="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="container-page py-20 sm:py-28">
        <SectionHeading
          eyebrow="Start from a plan"
          title="Ready-made itineraries"
          description="Open one in the builder and make it yours: change nights, add stops, pick your dates."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {templates.map((template, i) => {
            const { cost: templateCost, plan: templatePlan } = planTrip({
              startDate: `2027-${String(template.bestMonth).padStart(2, "0")}-10`,
              startCity: "islamabad",
              travellers: 4,
              tier: "standard",
              stops: template.stops,
            });
            const stops = getDestinationsBySlugs(template.stops.map((s) => s.slug));
            return (
              <article key={template.id} className="relative flex flex-col overflow-hidden rounded-3xl border border-line bg-snow p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pine via-pine-bright to-apricot-bright" />
                <div className="relative flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.2em] text-muted">0{i + 1}</span>
                  <span className="rounded-full bg-pine-soft px-3 py-1 font-mono text-xs text-pine">{templatePlan.days.length} days</span>
                </div>
                <h3 className="relative mt-8 text-4xl">{template.name}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">{template.tagline}</p>
                <ol className="relative mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  {stops.map((s, k) => (
                    <li key={s.slug} className="inline-flex items-center gap-2">
                      {k > 0 && <span aria-hidden className="text-line-strong">→</span>}
                      {s.name}
                    </li>
                  ))}
                </ol>
                <div className="relative mt-auto flex items-end justify-between gap-4 pt-8">
                  <p className="text-sm text-muted">
                    from <span className="tabular block font-display text-2xl text-ink">{formatPkr(templateCost.perPerson)}</span>
                    per person, group of 4
                  </p>
                  <LoadTemplateButton templateId={template.id} templateName={template.name} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Regions */}
      <section className="container-page pb-20 sm:pb-28">
        <SectionHeading eyebrow="Explore by region" title="Four regions, one trip" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {regions.map((region, i) => (
            <RegionTile
              key={region.id}
              region={region}
              index={i}
              count={all.filter((d) => d.region === region.id).length}
              className={i === 0 ? "lg:col-span-2 lg:row-span-2 lg:min-h-[29rem]" : i === 3 ? "lg:col-span-2" : undefined}
            />
          ))}
        </div>
      </section>

      {/* Trust + CTA */}
      <section className="border-t border-line bg-pine-soft/60">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-2 text-muted">
              <ShieldCheck className="size-4 text-pine" aria-hidden />
              Plan it, then hand it over
            </p>
            <h2 className="text-5xl leading-[1.02] sm:text-6xl">Send your plan to a local operator for a real quote.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button href="/itinerary" size="lg" variant="pine">Build my itinerary</Button>
            <Button href="/plan-trip" size="lg" variant="outline">Request a quote</Button>
          </div>
        </div>
      </section>
    </>
  );
}
