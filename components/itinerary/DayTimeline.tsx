import { BedDouble, Car, Compass, Home } from "lucide-react";
import { cn, formatAltitude, formatDate, formatHours } from "@/lib/utils";
import type { Day } from "@/types";

export interface DayTimelineProps {
  days: Day[];
  /** Days that have a warning, highlighted in the list. */
  flaggedDays?: number[];
  compact?: boolean;
  tone?: "light" | "dark";
}

const ICONS = { travel: Car, explore: Compass, return: Home };

/** The day-by-day plan as a vertical timeline. Pure display, no state. */
export function DayTimeline({ days, flaggedDays = [], compact = false, tone = "light" }: DayTimelineProps) {
  const dark = tone === "dark";
  return (
    <ol className="relative">
      {days.map((day, i) => {
        const Icon = ICONS[day.kind];
        const flagged = flaggedDays.includes(day.n);
        return (
          <li key={day.n} className="relative flex gap-4 pb-6 last:pb-0">
            {i < days.length - 1 && (
              <span aria-hidden className={cn("absolute left-[1.15rem] top-10 bottom-0 w-px", dark ? "bg-snow/15" : "bg-line-strong")} />
            )}
            <span
              className={cn(
                "relative z-10 grid size-[2.3rem] shrink-0 place-items-center rounded-full ring-4",
                dark ? "ring-ink" : "ring-paper",
                day.kind === "explore"
                  ? "bg-glacier text-snow"
                  : flagged
                    ? "bg-warning text-snow"
                    : dark
                      ? "bg-snow text-ink"
                      : "bg-ink text-snow",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={cn("font-mono text-[0.68rem] uppercase tracking-[0.16em]", dark ? "text-snow/55" : "text-muted")}>
                Day {day.n}
                {!compact && ` · ${formatDate(day.date)}`}
              </p>
              <p className={cn("mt-0.5 font-medium leading-snug", dark ? "text-snow" : "text-ink")}>{day.title}</p>
              <div className={cn("mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs", dark ? "text-snow/65" : "text-muted")}>
                {day.driveHours > 0 && <span className="tabular">{formatHours(day.driveHours)} on the road · {day.km} km</span>}
                {day.sleepAt && (
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="size-3.5" aria-hidden />
                    {day.sleepAt}
                    {day.sleepAltitudeM !== null && ` · ${formatAltitude(day.sleepAltitudeM)}`}
                  </span>
                )}
              </div>
              {!compact && day.notes.length > 0 && (
                <ul className={cn("mt-2 space-y-0.5 text-xs", dark ? "text-snow/55" : "text-muted")}>
                  {day.notes.map((note) => (
                    <li key={note}>— {note}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
