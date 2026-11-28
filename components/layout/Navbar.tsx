"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";
import { ItineraryCount } from "./ItineraryCount";

// Client Component: it needs useState for the mobile menu and the scroll
// state, a click handler for the menu button, and usePathname for the
// active link. None of that can run on the server.

export interface NavLink {
  href: string;
  label: string;
}

export interface NavbarProps {
  links: NavLink[];
}

export function Navbar({ links }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const overHero = pathname === "/" && !scrolled && !open;

  // Close the menu after navigating (adjusting state during render).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "no-print fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300",
         overHero
          ? "bg-transparent"
          : open
            ? "bg-paper shadow-[0_1px_0_var(--color-line)]"
            : "bg-snow/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-snow"
      >
        Skip to content
      </a>
      <nav className="container-page flex h-18 items-center justify-between gap-6" aria-label="Main">
        <Logo tone={overHero ? "light" : "dark"} />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition",
                  overHero ? "text-snow/85 hover:text-snow" : "text-ink-2 hover:text-pine",
                  isActive(link.href) &&
                    "after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-apricot-bright",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ItineraryCount tone={overHero ? "light" : "dark"} className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "grid size-11 place-items-center rounded-full transition md:hidden",
              overHero ? "text-snow hover:bg-snow/15" : "text-ink hover:bg-pine-soft",
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-18 animate-fade bg-paper md:hidden">
          <ul className="container-page flex flex-col gap-1 pt-6">
            {links.map((link, i) => (
              <li key={link.href} className="animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="flex items-baseline justify-between border-b border-line py-5 font-display text-4xl"
                >
                  {link.label}
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-page mt-8">
            <ItineraryCount className="h-12 w-full justify-center" />
          </div>
        </div>
      )}
    </header>
  );
}
