import Image from "next/image";
import { Topography } from "@/components/common/Topography";
import { cn, formatAltitude } from "@/lib/utils";
import type { Destination } from "@/types";

export interface DestinationImageProps {
  destination: Destination;
  sizes: string;
  priority?: boolean;
  className?: string;
}

const POSTER_TONES = [
  "from-[#1d3b37] to-[#0e1a17]",
  "from-[#3a2f26] to-[#141110]",
  "from-[#203247] to-[#0d141d]",
  "from-[#2f3a28] to-[#11160f]",
];

/**
 * The destination photo through next/image, or, until a licensed photo is
 * added, a designed contour poster with the place's altitude.
 */
export function DestinationImage({ destination, sizes, priority = false, className }: DestinationImageProps) {
  if (destination.photo) {
    return (
      <Image
        src={destination.photo.src}
        alt={destination.photo.alt}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        fill
        className={cn("object-cover", className)}
      />
    );
  }

  const seed = destination.slug.length + destination.altitudeM;
  return (
    <div
      role="img"
      aria-label={`Contour illustration for ${destination.name}`}
      className={cn("absolute inset-0 bg-gradient-to-br text-snow", POSTER_TONES[seed % POSTER_TONES.length], className)}
    >
      <Topography seed={seed} className="text-snow/15" />
      <span className="absolute right-4 top-4 font-mono text-[0.65rem] tracking-[0.2em] text-snow/60">
        {formatAltitude(destination.altitudeM)}
      </span>
    </div>
  );
}
