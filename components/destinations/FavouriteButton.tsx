"use client";

import { Heart } from "lucide-react";
import { useFavourites } from "@/context/FavouritesProvider";
import { useToast } from "@/context/ToastProvider";
import { cn } from "@/lib/utils";

export interface FavouriteButtonProps {
  slug: string;
  name: string;
  variant?: "glass" | "outline";
  className?: string;
}

/** Client Component: toggles a favourite on click (state + event handler). */
export function FavouriteButton({ slug, name, variant = "glass", className }: FavouriteButtonProps) {
  const { isFavourite, toggle } = useFavourites();
  const { notify } = useToast();
  const active = isFavourite(slug);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const added = toggle(slug);
        notify(added ? `Saved ${name} to favourites` : `Removed ${name} from favourites`);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      className={cn(
        "grid size-10 place-items-center rounded-full transition duration-200 active:scale-90",
        variant === "glass"
          ? "bg-ink/35 text-snow ring-1 ring-snow/25 backdrop-blur-md hover:bg-ink/55"
          : "border border-line-strong text-ink hover:border-ink",
        className,
      )}
    >
      <Heart className={cn("size-[18px] transition", active && "fill-apricot-bright stroke-apricot-bright")} aria-hidden />
    </button>
  );
}
