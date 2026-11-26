import { cn } from "@/lib/utils";

export interface TopographyProps {
  className?: string;
  /** Changes the pattern so neighbouring sections do not look identical. */
  seed?: number;
}

/**
 * Decorative contour lines, the brand's signature texture. Pure SVG computed
 * from a seed, so it renders the same on the server and the client.
 */
export function Topography({ className, seed = 1 }: TopographyProps) {
  const rings = Array.from({ length: 14 }, (_, i) => i);
  const cx = 380 + ((seed * 97) % 240);
  const cy = 180 + ((seed * 53) % 160);
  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        {rings.map((i) => {
          const r = 30 + i * 42;
          const wobble = 0.18 + ((seed + i) % 5) * 0.03;
          const points = Array.from({ length: 48 }, (_, k) => {
            const a = (k / 48) * Math.PI * 2;
            const noise = 1 + wobble * Math.sin(a * 3 + seed + i * 0.6) * 0.35 + 0.06 * Math.cos(a * 5 + i);
            return `${(cx + Math.cos(a) * r * 1.5 * noise).toFixed(1)},${(cy + Math.sin(a) * r * noise).toFixed(1)}`;
          });
          return <polygon key={i} points={points.join(" ")} opacity={1 - i * 0.05} />;
        })}
      </g>
    </svg>
  );
}
