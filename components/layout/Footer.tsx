import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Topography } from "@/components/common/Topography";
import { regions } from "@/data/regions";

export interface FooterProps {
  links: { href: string; label: string }[];
}

export function Footer({ links }: FooterProps) {
  return (
    <footer className="no-print relative overflow-hidden bg-ink text-snow">
      <Topography seed={7} className="text-snow/[0.06]" />
      <div className="container-page relative grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <Logo tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-snow/65">
            Plan a realistic trip to northern Pakistan: where to go, when it is open, how long the roads take and what it
            costs in PKR.
          </p>
          <p className="mt-6 font-mono text-[0.68rem] tracking-[0.16em] text-snow/40 uppercase">
            Bookings on this site are simulated
          </p>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-snow/50">Explore</h2>
          <ul className="space-y-2.5 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-snow/80 transition hover:text-apricot-bright">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-snow/50">Regions</h2>
          <ul className="space-y-2.5 text-sm">
            {regions.map((region) => (
              <li key={region.id}>
                <Link href={`/destinations?region=${region.id}`} className="text-snow/80 transition hover:text-apricot-bright">
                  {region.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-snow/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-snow/45 sm:flex-row sm:justify-between">
          <p>© 2026 Shimal Trails · CS4032 Web Programming, Assignment 3</p>
          <p>Photos: Wikimedia Commons contributors, credited on each page.</p>
        </div>
      </div>
    </footer>
  );
}
