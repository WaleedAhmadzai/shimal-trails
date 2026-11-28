import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "pine" | "outline" | "ghost" | "light";
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
  primary: "bg-ink text-snow hover:bg-pine-deep shadow-soft",
  accent: "bg-apricot text-snow hover:bg-apricot-deep shadow-soft",
  pine: "bg-pine text-snow hover:bg-pine-deep shadow-soft",
  outline: "border border-line-strong bg-transparent text-ink hover:border-pine hover:bg-pine-soft hover:text-pine-deep",
  ghost: "bg-transparent text-ink hover:bg-pine-soft",
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
