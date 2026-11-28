"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

/** Controlled search input: the parent owns the value. */
export function SearchBar({ value, onChange, placeholder = "Search", label = "Search", className }: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor="search" className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
      <input
        id="search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-13 w-full rounded-full border border-line-strong bg-snow pl-12 pr-12 text-base text-ink shadow-sm outline-none transition placeholder:text-muted hover:border-pine/60 focus:border-pine focus:ring-4 focus:ring-pine/10 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-paper-2 hover:text-ink"
          aria-label="Clear search"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
