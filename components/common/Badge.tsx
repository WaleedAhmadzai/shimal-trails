import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

type Tone = "neutral" | "glacier" | "apricot" | "pine" | "easy" | "moderate" | "challenging" | "glass";

export interface BadgeProps {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

const tones: Record<Tone, string> = {
  neutral: "bg-paper-2 text-ink-2",
  glacier: "bg-glacier-soft text-glacier",
  apricot: "bg-apricot-soft text-apricot",
  pine: "bg-pine-soft text-pine",
  easy: "bg-pine-soft text-pine",
  moderate: "bg-warning-soft text-warning",
  challenging: "bg-danger-soft text-danger",
  glass: "bg-ink/40 text-snow backdrop-blur-md ring-1 ring-snow/20",
};

/** Small rounded label. Colour is never the only signal: it always has text. */
export function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ level, glass = false }: { level: Difficulty; glass?: boolean }) {
  const dots = { easy: 1, moderate: 2, challenging: 3 }[level];
  return (
    <Badge tone={glass ? "glass" : level}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("size-1.5 rounded-full bg-current", i > dots && "opacity-25")} />
        ))}
      </span>
      {level[0].toUpperCase() + level.slice(1)}
    </Badge>
  );
}
