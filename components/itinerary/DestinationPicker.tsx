"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { getAllDestinations } from "@/lib/destinations";
import { cn, formatAltitude, monthOf } from "@/lib/utils";

export interface DestinationPickerProps {
  /** Slugs already in the plan; they are hidden from the list. */
  exclude: string[];
  favourites: string[];
  startDate: string;
  onPick: (slug: string) => void;
}

/** Client Component: a searchable list of places to add (typed query in useState). */
export function DestinationPicker({ exclude, favourites, startDate, onPick }: DestinationPickerProps) {
  const [query, setQuery] = useState("");
  const month = monthOf(startDate);
  const q = query.trim().toLowerCase();
  const options = getAllDestinations()
    .filter((d) => !exclude.includes(d.slug))
    .filter((d) => !q || [d.name, ...d.aliases].some((text) => text.toLowerCase().includes(q)))
    .sort((a, b) => Number(favourites.includes(b.slug)) - Number(favourites.includes(a.slug)));

  return (
    <div className="rounded-2xl border border-line bg-snow p-4">
      <label htmlFor="picker" className="text-sm font-medium">Add a destination</label>
      <div className="relative mt-2">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          id="picker"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a place…"
          className="h-11 w-full rounded-full border border-line-strong bg-paper pl-10 pr-4 text-sm outline-none focus:border-ink"
        />
      </div>
      <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
        {options.map((d) => {
          const open = d.openMonths.includes(month as never);
          return (
            <li key={d.slug}>
              <button
                type="button"
                onClick={() => {
                  onPick(d.slug);
                  setQuery("");
                }}
                className="group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-paper"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {favourites.includes(d.slug) && <span className="mr-1 text-apricot" aria-label="Favourite">♥</span>}
                    {d.name}
                  </span>
                  <span className={cn("text-xs", open ? "text-muted" : "text-danger")}>
                    {formatAltitude(d.altitudeM)} · {open ? "open in your month" : "closed in your month"}
                  </span>
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-paper-2 transition group-hover:bg-ink group-hover:text-snow">
                  <Plus className="size-4" aria-hidden />
                  <span className="sr-only">Add {d.name}</span>
                </span>
              </button>
            </li>
          );
        })}
        {options.length === 0 && <li className="px-3 py-2 text-sm text-muted">No more places match.</li>}
      </ul>
    </div>
  );
}
