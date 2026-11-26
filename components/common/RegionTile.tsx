import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Topography } from "./Topography";
import { cn } from "@/lib/utils";
import type { Region } from "@/types";

export interface RegionTileProps {
  region: Region;
  count: number;
  index: number;
  className?: string;
}

const TONES = ["bg-ink text-snow", "bg-glacier text-snow", "bg-apricot-soft text-ink", "bg-paper-2 text-ink"];

export function RegionTile({ region, count, index, className }: RegionTileProps) {
  return (
    <Link
      href={`/destinations?region=${region.id}`}
      className={cn(
        "group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-[1.4rem] p-6 transition duration-500 hover:-translate-y-1 hover:shadow-lift",
        TONES[index % TONES.length],
        className,
      )}
    >
      <Topography seed={index + 3} className="opacity-[0.12] transition duration-700 group-hover:scale-105" />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs tracking-[0.2em] opacity-70">0{index + 1}</span>
        <ArrowUpRight className="size-5 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </div>
      <div className="relative">
        <h3 className="text-3xl leading-none sm:text-4xl">{region.name}</h3>
        <p className="mt-3 max-w-xs text-sm opacity-75">{region.blurb}</p>
        <p className="mt-4 font-mono text-xs tracking-wide opacity-80">
          {count} {count === 1 ? "destination" : "destinations"}
        </p>
      </div>
    </Link>
  );
}
