import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  action,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-4 flex items-center gap-2", light ? "text-snow/70" : "text-muted", align === "center" && "justify-center")}>
            <span aria-hidden className="h-px w-6 bg-apricot-bright" />
            {eyebrow}
          </p>
        )}
        <Tag className={cn("text-4xl leading-[1.05] sm:text-5xl lg:text-6xl", light ? "text-snow" : "text-ink")}>{title}</Tag>
        {description && (
          <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", light ? "text-snow/75" : "text-muted")}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
