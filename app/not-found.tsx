import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Topography } from "@/components/common/Topography";
import { getDestinationsBySlugs } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This trail does not exist. Find your way back to a real destination.",
};

export default function NotFound() {
  const popular = getDestinationsBySlugs(["hunza-valley", "skardu", "fairy-meadows", "naran-kaghan"]);
  return (
    <section className="relative flex min-h-[85svh] items-center overflow-hidden bg-ink pt-24 text-snow">
      <Topography seed={9} className="text-snow/[0.08]" />
      <div className="container-page relative py-16">
        <p className="font-mono text-sm tracking-[0.3em] text-apricot-bright">ERROR 404 · ALTITUDE UNKNOWN</p>
        <h1 className="mt-6 max-w-3xl text-6xl leading-[0.95] sm:text-8xl">
          This trail goes <em>nowhere</em>.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-snow/75">
          The page or destination you are looking for does not exist, or the link is out of date.
        </p>
        <form action="/destinations" method="get" className="mt-10 flex max-w-lg gap-2">
          <label htmlFor="nf-search" className="sr-only">Search destinations</label>
          <input id="nf-search" name="q" placeholder="Search destinations" className="h-12 flex-1 rounded-full bg-snow px-5 text-ink outline-none" />
          <Button type="submit" variant="accent" size="md" className="h-12">Search</Button>
        </form>
        <p className="mt-10 eyebrow text-snow/55">Or try one of these</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {popular.map((d) => (
            <li key={d.slug}>
              <Link href={`/destinations/${d.slug}`} className="inline-block rounded-full border border-snow/25 px-4 py-2 text-sm hover:bg-snow hover:text-ink">
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
