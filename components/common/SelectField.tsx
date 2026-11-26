import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: string;
  options: SelectOption[];
  hideLabel?: boolean;
  invalid?: boolean;
}

/** Native select (best on phones) styled to match the design system. */
export function SelectField({ label, options, hideLabel, invalid, className, id, ...props }: SelectFieldProps) {
  const selectId = id ?? `select-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={selectId} className={cn("text-xs font-medium text-ink-2", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "h-11 w-full cursor-pointer appearance-none rounded-full border bg-snow pl-4 pr-10 text-sm text-ink outline-none transition focus:border-ink",
            invalid ? "border-danger" : "border-line-strong",
          )}
          aria-invalid={invalid || undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
      </div>
    </div>
  );
}
