"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { SelectField } from "@/components/common/SelectField";
import { regions } from "@/data/regions";
import {
  DAY_OPTIONS,
  DIFFICULTY_LABELS,
  EMPTY_FILTERS,
  SORT_OPTIONS,
  filtersToQuery,
  type DestinationFilters as Filters,
} from "@/lib/destinations";
import { MONTHS_LONG, cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";

// Client Component: it keeps the typed search text in useState, reacts to
// change events, and writes the filters into the URL with the router.
// The results grid itself is rendered on the server from that URL.

export interface DestinationFiltersProps {
  filters: Filters;
  resultCount: number;
}

const CHIP_LABELS: Record<string, (f: Filters) => string> = {
  q: (f) => `“${f.q}”`,
  region: (f) => regions.find((r) => r.id === f.region)?.name ?? "",
  month: (f) => `Best in ${MONTHS_LONG[f.month - 1]}`,
  difficulty: (f) => (f.difficulty ? DIFFICULTY_LABELS[f.difficulty] : ""),
  days: (f) => `Fits in ${f.days} days`,
  family: () => "Family-friendly",
};

export function DestinationFilters({ filters, resultCount }: DestinationFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState(filters.q);
  const [panelOpen, setPanelOpen] = useState(false);
  const debounce = useRef<number | undefined>(undefined);

  // Keep the box in sync when the URL changes (back button, chip removed).
  const [syncedQ, setSyncedQ] = useState(filters.q);
  if (syncedQ !== filters.q) {
    setSyncedQ(filters.q);
    setText(filters.q);
  }

  const apply = (next: Filters) => {
    startTransition(() => {
      router.replace(`${pathname}${filtersToQuery(next)}`, { scroll: false });
    });
  };

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => apply({ ...filters, [key]: value });

  const onText = (value: string) => {
    setText(value);
    window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => apply({ ...filters, q: value.trim() }), 300);
  };

  const activeKeys = (Object.keys(CHIP_LABELS) as (keyof Filters)[]).filter((key) => Boolean(filters[key]));

  const selects = (
    <>
      <SelectField
        label="Region"
        value={filters.region}
        onChange={(e) => update("region", e.target.value as Filters["region"])}
        options={[{ value: "", label: "All regions" }, ...regions.map((r) => ({ value: r.id, label: r.name }))]}
      />
      <SelectField
        label="Best month"
        value={String(filters.month)}
        onChange={(e) => update("month", Number(e.target.value))}
        options={[{ value: "0", label: "Any month" }, ...MONTHS_LONG.map((m, i) => ({ value: String(i + 1), label: m }))]}
      />
      <SelectField
        label="Difficulty"
        value={filters.difficulty}
        onChange={(e) => update("difficulty", e.target.value as Filters["difficulty"])}
        options={[
          { value: "", label: "Any difficulty" },
          ...Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({ value, label })),
        ]}
      />
      <SelectField
        label="Trip length"
        value={String(filters.days)}
        onChange={(e) => update("days", Number(e.target.value))}
        options={[{ value: "0", label: "Any length" }, ...DAY_OPTIONS.map((d) => ({ value: String(d), label: `Fits in ${d} days` }))]}
      />
      <SelectField
        label="Sort by"
        value={filters.sort}
        onChange={(e) => update("sort", e.target.value as Filters["sort"])}
        options={SORT_OPTIONS}
      />
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <SearchBar
          value={text}
          onChange={onText}
          placeholder="Search Hunza, lakes, Saif ul Malook…"
          label="Search destinations"
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          className="relative grid size-13 shrink-0 place-items-center rounded-full border border-line-strong bg-snow text-ink shadow-sm transition hover:border-pine lg:hidden"
          aria-expanded={panelOpen}
          aria-controls="filter-panel"
          aria-label="Show filters"
        >
          <SlidersHorizontal className="size-5" aria-hidden />
          {activeKeys.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-apricot text-[0.65rem] text-snow">
              {activeKeys.length}
            </span>
          )}
        </button>
      </div>

      <div
        id="filter-panel"
        className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid lg:grid-cols-5", panelOpen ? "grid" : "hidden")}
      >
        {selects}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="mr-1 inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-snow px-3.5 py-2 text-sm has-[:checked]:border-pine has-[:checked]:bg-pine-soft has-[:checked]:text-pine-deep">
          <input
            type="checkbox"
            checked={filters.family}
            onChange={(e) => update("family", e.target.checked)}
            className="size-4 accent-pine"
          />
          Family-friendly only
        </label>
        {activeKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => update(key, EMPTY_FILTERS[key])}
            className="inline-flex items-center gap-1.5 rounded-full bg-pine px-3.5 py-2 text-sm text-snow transition hover:bg-pine-deep"
            aria-label={`Remove filter ${CHIP_LABELS[key](filters)}`}
          >
            {CHIP_LABELS[key](filters)}
            <X className="size-3.5" aria-hidden />
          </button>
        ))}
        {activeKeys.length > 1 && (
          <button
            type="button"
            onClick={() => apply({ ...EMPTY_FILTERS, sort: filters.sort })}
            className="px-2 text-sm font-medium text-apricot underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        )}
        <p className="ml-auto text-sm text-muted" aria-live="polite">
          {isPending ? "Updating…" : `${resultCount} ${resultCount === 1 ? "destination" : "destinations"}`}
        </p>
      </div>
    </div>
  );
}
