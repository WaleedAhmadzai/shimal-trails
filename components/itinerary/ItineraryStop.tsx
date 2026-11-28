import Link from "next/link";
import { ArrowDown, ArrowUp, Minus, Plus, Trash2 } from "lucide-react";
import { DestinationImage } from "@/components/destinations/DestinationImage";
import { LIMITS } from "@/data/pricing";
import { cn, formatAltitude } from "@/lib/utils";
import type { Destination } from "@/types";

export interface ItineraryStopProps {
  destination: Destination;
  nights: number;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  closed: boolean;
  onNightsChange: (nights: number) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}

/** One stop in the builder. All changes go back up through callback props. */
export function ItineraryStop({
  destination,
  nights,
  index,
  isFirst,
  isLast,
  closed,
  onNightsChange,
  onMove,
  onRemove,
}: ItineraryStopProps) {
  const iconButton =
    "grid size-9 place-items-center rounded-full text-ink-2 transition hover:bg-paper-2 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <li
      className={cn(
        "flex animate-rise items-center gap-3 rounded-2xl border bg-snow p-3 shadow-soft sm:gap-4",
        closed ? "border-danger/40" : "border-line",
      )}
    >
      <span className="hidden w-6 text-center font-mono text-xs text-muted sm:block">{String(index + 1).padStart(2, "0")}</span>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-ink sm:size-20">
        <DestinationImage destination={destination} sizes="80px" />
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/destinations/${destination.slug}`} className="block truncate font-medium hover:underline">
          {destination.name}
        </Link>
        <p className="mt-0.5 text-xs text-muted">
          {formatAltitude(destination.altitudeM)}
          {closed && <span className="ml-2 font-medium text-danger">Closed that month</span>}
        </p>
        <div className="mt-2 inline-flex items-center rounded-full border border-line-strong">
          <button
            type="button"
            onClick={() => onNightsChange(nights - 1)}
            disabled={nights <= 0}
            className={cn(iconButton, "size-8")}
            aria-label={`One night fewer in ${destination.name}`}
          >
            <Minus className="size-3.5" aria-hidden />
          </button>
          <span className="tabular min-w-20 text-center text-sm" aria-live="polite">
            {nights === 0 ? "Day visit" : `${nights} ${nights === 1 ? "night" : "nights"}`}
          </span>
          <button
            type="button"
            onClick={() => onNightsChange(nights + 1)}
            disabled={nights >= LIMITS.maxNightsPerStop}
            className={cn(iconButton, "size-8")}
            aria-label={`One more night in ${destination.name}`}
          >
            <Plus className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row">
        <button type="button" onClick={() => onMove(-1)} disabled={isFirst} className={iconButton} aria-label={`Move ${destination.name} earlier`}>
          <ArrowUp className="size-4" aria-hidden />
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={isLast} className={iconButton} aria-label={`Move ${destination.name} later`}>
          <ArrowDown className="size-4" aria-hidden />
        </button>
      </div>
      <button type="button" onClick={onRemove} className={cn(iconButton, "hover:bg-danger-soft hover:text-danger")} aria-label={`Remove ${destination.name}`}>
        <Trash2 className="size-4" aria-hidden />
      </button>
    </li>
  );
}
