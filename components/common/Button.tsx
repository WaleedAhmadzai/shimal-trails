import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export type ButtonProps = BaseProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

const variants: Record<Variant, string> = {
  primary: "bg-ink text-snow hover:bg-ink-2 shadow-soft",
  accent: "bg-apricot text-snow hover:bg-[#b4461a] shadow-soft",
  outline: "border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-snow",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  light: "bg-snow/95 text-ink hover:bg-snow shadow-soft backdrop-blur",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

/** One button style for the whole site; renders a link when given `href`. */
export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
