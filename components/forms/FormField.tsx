import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (props: { id: string; "aria-invalid"?: true; "aria-describedby"?: string; className: string }) => React.ReactNode;
}

export const inputClass =
  "h-12 w-full rounded-xl border bg-snow px-4 text-base text-ink outline-none transition placeholder:text-muted/70 focus:border-ink focus:ring-4 focus:ring-ink/5";

/** Label, input, hint and error message wired together for screen readers. */
export function FormField({ id, label, error, hint, required, className, children }: FormFieldProps) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-apricot" aria-hidden> *</span>}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        className: cn(inputClass, error ? "border-danger bg-danger-soft/40" : "border-line-strong"),
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
