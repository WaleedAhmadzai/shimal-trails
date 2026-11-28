import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Fact {
  icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
}

export interface FactGridProps {
  facts: Fact[];
  columns?: 2 | 3;
}

/** Instrument-panel style key facts: label in mono, value in display type. */
export function FactGrid({ facts, columns = 3 }: FactGridProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-line [&>div]:bg-snow",
        "gap-px",
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
      )}
    >
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-2 p-5">
          <dt className="eyebrow flex items-center gap-2 text-muted">
            <fact.icon className="size-3.5 text-pine" aria-hidden />
            {fact.label}
          </dt>
          <dd className="font-display text-2xl leading-tight text-ink sm:text-[1.7rem]">{fact.value}</dd>
          {fact.note && <dd className="text-xs leading-snug text-muted">{fact.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
