import Link from "next/link";
import { ArrowUpRight, Clock, Mountain } from "lucide-react";
import { DifficultyBadge } from "@/components/common/Badge";
import { getRegion } from "@/data/regions";
import { hoursFromIslamabad } from "@/lib/itinerary/roads";
import { cn, formatAltitude, formatHours, formatPkr, monthRanges } from "@/lib/utils";
import type { Destination } from "@/types";
import { DestinationImage } from "./DestinationImage";
import { FavouriteButton } from "./FavouriteButton";

export interface DestinationCardProps {
  destination: Destination;
  /** "default" is the tall listing card; "compact" is the smaller card on Home and detail pages. */
  variant?: "default" | "compact";
  index?: number;
  priority?: boolean;
}

/**
 * Reused on Home, the listing and detail pages with different props.
 * A Server Component; only the heart inside it is a Client Component.
 */
export function DestinationCard({ destination, variant = "default", index, priority }: DestinationCardProps) {
  const region = getRegion(destination.region);
  const hours = hoursFromIslamabad(destination.nodeId);
  const compact = variant === "compact";

  return (
    <article className="group relative">
      <Link
        href={`/destinations/${destination.slug}`}
        className="block rounded-3xl focus-visible:outline-offset-4"
        aria-label={`${destination.name}, ${region?.name}`}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl bg-ink shadow-soft transition duration-500 ease-out group-hover:shadow-lift",
            compact ? "aspect-[4/3]" : "aspect-[4/5]",
          )}
        >
          <div className="absolute inset-0 transition duration-700 ease-out group-hover:scale-[1.04]">
            <DestinationImage
              destination={destination}
              priority={priority}
              sizes={compact ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" : "(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/90 via-ink/15 to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            {typeof index === "number" && (
              <span className="font-mono text-[0.68rem] tracking-[0.2em] text-snow/70">{String(index + 1).padStart(2, "0")}</span>
            )}
            {!compact && <DifficultyBadge level={destination.difficulty} glass />}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="eyebrow text-snow/65">{region?.name}</p>
            <h3 className={cn("mt-1.5 leading-[1.02] text-snow", compact ? "text-[1.7rem]" : "text-[2.1rem]")}>
              {destination.name}
            </h3>
            {!compact && <p className="mt-2 line-clamp-2 text-sm leading-snug text-snow/75">{destination.summary}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.7rem] tracking-wide text-snow/80">
              <span className="inline-flex items-center gap-1.5">
                <Mountain className="size-3.5" aria-hidden />
                {formatAltitude(destination.altitudeM)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden />
                {formatHours(hours)} from ISB
              </span>
            </div>
          </div>

          <span className="absolute bottom-5 right-5 grid size-10 translate-y-2 place-items-center rounded-full bg-apricot text-snow opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-5" aria-hidden />
          </span>
        </div>
      </Link>

      <FavouriteButton slug={destination.slug} name={destination.name} className="absolute right-4 top-4" />

      {!compact && (
        <div className="mt-3 flex items-center justify-between px-1 text-sm">
          <span className="text-muted">
            Best <span className="text-ink">{monthRanges(destination.bestMonths)}</span>
          </span>
          <span className="tabular text-muted">
            from <span className="font-medium text-ink">{formatPkr(destination.costPerNightPkr.economy)}</span>/night
          </span>
        </div>
      )}
    </article>
  );
}
