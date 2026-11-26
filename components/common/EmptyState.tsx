import type { LucideIcon } from "lucide-react";
import { Compass } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon = Compass, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-[1.4rem] border border-dashed border-line-strong bg-snow/60 px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-paper-2 text-glacier">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="mt-5 text-3xl">{title}</h2>
      <p className="mt-2 max-w-md text-muted">{description}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
