"use client";

import { Check, Plus } from "lucide-react";
import { Button, type ButtonProps } from "@/components/common/Button";
import { useItinerary } from "@/context/ItineraryProvider";
import { useToast } from "@/context/ToastProvider";

export interface AddToItineraryButtonProps {
  slug: string;
  name: string;
  size?: ButtonProps["size"];
  className?: string;
}

/**
 * Client Component: reads and changes the shared itinerary when clicked.
 * Used on the detail page (header and the sticky mobile bar).
 */
export function AddToItineraryButton({ slug, name, size = "lg", className }: AddToItineraryButtonProps) {
  const { has, add, remove, hydrated } = useItinerary();
  const { notify } = useToast();
  const added = hydrated && has(slug);

  return (
    <Button
      size={size}
      variant={added ? "outline" : "accent"}
      className={className}
      disabled={!hydrated}
      aria-pressed={added}
      onClick={() => {
        if (added) {
          remove(slug);
          notify(`Removed ${name} from your itinerary`);
        } else {
          add(slug);
          notify(`Added ${name} to your itinerary`, { label: "View", href: "/itinerary" });
        }
      }}
    >
      {added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
      {added ? "In your itinerary" : "Add to itinerary"}
    </Button>
  );
}
