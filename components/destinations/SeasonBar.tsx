import { MONTHS_SHORT, cn } from "@/lib/utils";
import type { Month } from "@/types";

export interface SeasonBarProps {
  bestMonths: Month[];
  openMonths: Month[];
  /** Highlights one month, e.g. the month of the planned trip. */
  highlight?: number;
  size?: "sm" | "lg";
}

/** Twelve months coloured best / possible / closed, with a text legend. */
export function SeasonBar({ bestMonths, openMonths, highlight, size = "lg" }: SeasonBarProps) {
  return (
    <div>
      <ol className="grid grid-cols-12 gap-1" aria-label="Season by month">
        {MONTHS_SHORT.map((label, i) => {
          const m = (i + 1) as Month;
          const state = bestMonths.includes(m) ? "best" : openMonths.includes(m) ? "open" : "closed";
          const stateText = { best: "best time", open: "possible", closed: "closed" }[state];
          return (
            <li key={label} className="flex flex-col items-center gap-1.5">
              <span
                title={`${label}: ${stateText}`}
                className={cn(
                  "w-full rounded-full",
                  size === "lg" ? "h-2.5" : "h-1.5",
                  state === "best" && "bg-glacier",
                  state === "open" && "bg-glacier/30",
                  state === "closed" && "bg-[repeating-linear-gradient(135deg,var(--color-line-strong)_0_2px,transparent_2px_5px)]",
                  highlight === m && "ring-2 ring-apricot-bright ring-offset-2 ring-offset-paper",
                )}
              />
              {size === "lg" && (
                <span className={cn("font-mono text-[0.62rem] uppercase", highlight === m ? "text-apricot" : "text-muted")}>
                  {label[0]}
                  <span className="hidden sm:inline">{label.slice(1)}</span>
                </span>
              )}
              <span className="sr-only">{`${label}: ${stateText}`}</span>
            </li>
          );
        })}
      </ol>
      {size === "lg" && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded-full bg-glacier" />Best time</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded-full bg-glacier/30" />Possible</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded-full bg-[repeating-linear-gradient(135deg,var(--color-line-strong)_0_2px,transparent_2px_5px)]" />Closed or snowbound</span>
        </div>
      )}
    </div>
  );
}
