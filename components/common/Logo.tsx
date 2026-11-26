import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  tone?: "dark" | "light";
  className?: string;
}

/** Wordmark with a two-peak mark. Drawn by us, no external assets. */
export function Logo({ tone = "dark", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", tone === "light" ? "text-snow" : "text-ink", className)}
      aria-label="Shimal Trails home"
    >
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.25" />
        <path d="M5 23 L13 10 L17.5 17 L20.5 13 L27 23 Z" fill="currentColor" />
        <path d="M11.6 12.3 L13 10 L14.5 12.4 L13.4 13.3 Z" fill="var(--color-paper)" />
        <circle cx="23" cy="8.5" r="2" className="fill-apricot-bright transition-transform duration-500 group-hover:-translate-y-0.5" />
      </svg>
      <span className="font-display text-[1.45rem] leading-none tracking-tight">
        Shimal<span className="text-apricot-bright">.</span>
        <span className="ml-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.22em] opacity-70">Trails</span>
      </span>
    </Link>
  );
}
