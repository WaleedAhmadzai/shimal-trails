import { PRICING_SET, TIER_LABELS } from "@/data/pricing";
import { cn, formatDate, formatHours, formatPkr } from "@/lib/utils";
import type { CostBreakdown, Itinerary } from "@/types";
import type { TripPlan } from "@/lib/itinerary";

export interface TripSummaryProps {
  itinerary: Itinerary;
  plan: TripPlan;
  cost: CostBreakdown;
  /** "full" on the builder with the cost breakdown; "compact" beside the form. */
  variant?: "full" | "compact";
  children?: React.ReactNode;
  className?: string;
}

/** Totals for a trip. Reused on /itinerary and /plan-trip with different props. */
export function TripSummary({ itinerary, plan, cost, variant = "full", children, className }: TripSummaryProps) {
  const last = plan.days.at(-1);
  const rows: [string, number][] = [
    ["Stays", cost.stay],
    [cost.vehicle, cost.transport],
    ["Food", cost.food],
    ["Buffer (10%)", cost.buffer],
  ];

  return (
    <div className={cn("rounded-3xl bg-gradient-to-br from-pine-deep to-ink p-6 text-snow shadow-lift", className)}>
      <p className="eyebrow text-snow/55">Your trip</p>
      <p className="mt-2 font-display text-2xl leading-tight">
        {plan.stops.length > 0 ? plan.stops.map((s) => s.destination.name).join(" · ") : "No stops yet"}
      </p>
      {last && (
        <p className="mt-1 text-sm text-snow/60">
          {formatDate(itinerary.startDate)} – {formatDate(last.date)}
        </p>
      )}

      <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-snow/10 py-4">
        {[
          ["Days", String(plan.days.length)],
          ["Driving", formatHours(plan.totalDriveHours)],
          ["Distance", `${plan.totalKm.toLocaleString("en-PK")} km`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="eyebrow text-[0.62rem] text-snow/50">{label}</dt>
            <dd className="tabular mt-1 font-mono text-base">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-snow/60">Estimated per person</p>
          <p className="tabular font-display text-4xl text-apricot-soft" aria-live="polite">{formatPkr(cost.perPerson)}</p>
        </div>
        <p className="tabular text-right text-sm text-snow/60">
          Group of {itinerary.travellers}
          <span className="block text-snow">{formatPkr(cost.total)}</span>
        </p>
      </div>

      {variant === "full" && (
        <dl className="mt-5 space-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-snow/70">
              <dt>{label}</dt>
              <dd className="tabular text-snow">{formatPkr(value)}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="mt-4 text-xs text-snow/45">
        {TIER_LABELS[itinerary.tier]} comfort · estimate set {PRICING_SET}, not a quote.
      </p>
      {children && <div className="mt-6 space-y-2">{children}</div>}
    </div>
  );
}
