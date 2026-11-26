"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/common/Button";
import { useItinerary } from "@/context/ItineraryProvider";
import { useToast } from "@/context/ToastProvider";

export interface LoadTemplateButtonProps {
  templateId: string;
  templateName: string;
  variant?: ButtonProps["variant"];
}

/** Client Component: loads a ready-made plan into the store on click. */
export function LoadTemplateButton({ templateId, templateName, variant = "primary" }: LoadTemplateButtonProps) {
  const { loadTemplate } = useItinerary();
  const { notify } = useToast();
  const router = useRouter();
  return (
    <Button
      variant={variant}
      onClick={() => {
        loadTemplate(templateId);
        notify(`Loaded “${templateName}” into your itinerary`);
        router.push("/itinerary");
      }}
    >
      Open in builder
      <ArrowRight className="size-4" aria-hidden />
    </Button>
  );
}
