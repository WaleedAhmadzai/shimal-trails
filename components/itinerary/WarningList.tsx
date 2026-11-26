import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripWarning } from "@/types";

export interface WarningListProps {
  warnings: TripWarning[];
}

const STYLES = {
  error: { icon: AlertOctagon, box: "bg-danger-soft text-danger", label: "Problem" },
  warning: { icon: AlertTriangle, box: "bg-warning-soft text-warning", label: "Warning" },
  info: { icon: Info, box: "bg-glacier-soft text-glacier", label: "Note" },
};

export function WarningList({ warnings }: WarningListProps) {
  if (warnings.length === 0) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-[#e1f0e6] px-3.5 py-3 text-sm text-success">
        <CheckCircle2 className="size-4 shrink-0" aria-hidden />
        All checks passed: roads open, altitude gain is safe.
      </p>
    );
  }
  return (
    <ul className="space-y-2" aria-label="Checks on your plan">
      {warnings.map((w) => {
        const style = STYLES[w.severity];
        return (
          <li key={w.id} className={cn("flex gap-2.5 rounded-xl px-3.5 py-3 text-sm", style.box)}>
            <style.icon className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              <span className="sr-only">{style.label}: </span>
              {w.message}
              {w.fix && <span className="mt-0.5 block font-medium">{w.fix}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
