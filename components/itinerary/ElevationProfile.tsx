import { cn, formatNumber } from "@/lib/utils";
import type { Day } from "@/types";

export interface ElevationProfileProps {
  days: Day[];
  startAltitudeM: number;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Sleeping altitude night by night, drawn as an area chart in plain SVG.
 * The 3,000 m line marks where altitude sickness becomes a real risk.
 */
export function ElevationProfile({ days, startAltitudeM, tone = "light", className }: ElevationProfileProps) {
  const points = [
    { label: "Start", altitude: startAltitudeM },
    ...days.map((d) => ({ label: `D${d.n}`, altitude: d.sleepAltitudeM ?? startAltitudeM })),
  ];
  if (points.length < 2) return null;

  const W = 640;
  const H = 180;
  const pad = { top: 22, right: 16, bottom: 26, left: 44 };
  const max = Math.max(5000, ...points.map((p) => p.altitude));
  const x = (i: number) => pad.left + (i / (points.length - 1)) * (W - pad.left - pad.right);
  const y = (alt: number) => pad.top + (1 - alt / max) * (H - pad.top - pad.bottom);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.altitude).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)} ${H - pad.bottom} L${x(0).toFixed(1)} ${H - pad.bottom} Z`;
  const peak = points.reduce((best, p, i) => (p.altitude > points[best].altitude ? i : best), 0);
  const dark = tone === "dark";
  const ticks = [0, 1000, 2000, 3000, 4000, 5000].filter((t) => t <= max);

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Sleeping altitude by night, highest ${formatNumber(points[peak].altitude)} metres`}
      >
        <defs>
          <linearGradient id="elev-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-glacier)" stopOpacity={dark ? 0.55 : 0.35} />
            <stop offset="100%" stopColor="var(--color-glacier)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              x2={W - pad.right}
              y1={y(t)}
              y2={y(t)}
              stroke={t === 3000 ? "var(--color-apricot-bright)" : dark ? "rgb(255 253 249 / 0.1)" : "var(--color-line)"}
              strokeDasharray={t === 3000 ? "4 4" : undefined}
            />
            <text x={pad.left - 8} y={y(t) + 3.5} textAnchor="end" className={cn("font-mono text-[10px]", dark ? "fill-snow/50" : "fill-muted")}>
              {t === 0 ? "0" : `${t / 1000}k`}
            </text>
          </g>
        ))}
        <text x={W - pad.right} y={y(3000) - 6} textAnchor="end" className="fill-apricot-bright font-mono text-[10px]">
          3,000 m
        </text>
        <path d={area} fill="url(#elev-fill)" />
        <path d={line} fill="none" stroke={dark ? "var(--color-snow)" : "var(--color-glacier)"} strokeWidth="2" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={p.label}>
            <circle cx={x(i)} cy={y(p.altitude)} r={i === peak ? 5 : 3} className={i === peak ? "fill-apricot-bright" : dark ? "fill-snow" : "fill-glacier"} />
            {(points.length <= 12 || i % 2 === 0) && (
              <text x={x(i)} y={H - 8} textAnchor="middle" className={cn("font-mono text-[10px]", dark ? "fill-snow/50" : "fill-muted")}>
                {p.label}
              </text>
            )}
          </g>
        ))}
        <text x={x(peak)} y={y(points[peak].altitude) - 10} textAnchor="middle" className={cn("font-mono text-[11px]", dark ? "fill-snow" : "fill-ink")}>
          {formatNumber(points[peak].altitude)} m
        </text>
      </svg>
      <figcaption className="sr-only">Chart of the altitude where you sleep each night.</figcaption>
    </figure>
  );
}
