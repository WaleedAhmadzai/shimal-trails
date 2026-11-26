"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/common/Button";

export interface ConfirmationDialogProps {
  open: boolean;
  reference: string;
  name: string;
  contactBy: string;
  summary: string;
  onClose: () => void;
}

/** Client Component: a native <dialog> opened and closed from state. */
export function ConfirmationDialog({ open, reference, name, contactBy, summary, onClose }: ConfirmationDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="confirm-title"
      className="m-auto w-[min(92vw,32rem)] rounded-[1.6rem] bg-snow p-0 text-ink shadow-lift backdrop:bg-ink/60 backdrop:backdrop-blur-sm open:animate-rise"
    >
      <div className="relative p-7 sm:p-9">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full hover:bg-paper-2"
          aria-label="Close"
        >
          <X className="size-5" aria-hidden />
        </button>
        <span className="grid size-14 place-items-center rounded-full bg-[#e1f0e6] text-success">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h2 id="confirm-title" className="mt-6 text-4xl leading-tight">
          Request sent, {name.split(" ")[0]}.
        </h2>
        <p className="mt-3 text-muted">
          A local operator will reply by {contactBy} within 24 hours with a quote for your trip.
        </p>
        <dl className="mt-6 space-y-3 rounded-2xl bg-paper p-5 text-sm">
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
            <dt className="text-muted">Reference</dt>
            <dd className="font-mono font-medium whitespace-nowrap">{reference}</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-muted">Trip</dt>
            <dd className="sm:text-right">{summary}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted">This is a demo: nothing was sent and no details were stored.</p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button onClick={onClose} className="flex-1">Done</Button>
          <Button href="/destinations" variant="outline" className="flex-1" onClick={onClose}>
            Keep exploring
          </Button>
        </div>
      </div>
    </dialog>
  );
}
