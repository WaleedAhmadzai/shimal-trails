import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, Leaf, Mountain, Signal, ThermometerSnowflake, TriangleAlert } from "lucide-react";
import { Button } from "@/components/common/Button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TeamCard } from "@/components/common/TeamCard";
import { destinations } from "@/data/destinations";
import { photos } from "@/data/photos";
import { team } from "@/data/team";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why we built Shimal Trails, how to travel the north safely and responsibly, and the team behind it.",
};

const PRINCIPLES = [
  { icon: Mountain, title: "Honest about the mountains", text: "Real road times, real closures. If a pass is shut in March, we say so before you plan around it." },
  { icon: HeartHandshake, title: "Local first", text: "Quotes go to operators from the region you visit, so the money stays in Hunza, Skardu and Swat." },
  { icon: Leaf, title: "Leave it better", text: "Carry your rubbish down, keep to trails, and never feed wildlife. Deosai's bears depend on it." },
];

const SAFETY = [
  { icon: ThermometerSnowflake, title: "Altitude", text: "Above 3,000 m, climb slowly. Do not sleep more than about 1,000 m higher than the night before. Headache, nausea or breathlessness at rest mean go down." },
  { icon: TriangleAlert, title: "Roads", text: "Landslides close roads after rain, especially on the Karakoram Highway and in Neelum. Avoid driving after dark and keep a spare day." },
  { icon: Signal, title: "Connectivity", text: "Signal disappears in valleys and on passes. Tell someone your plan and print your itinerary before you go." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink pt-32 pb-20 text-snow sm:pb-28">
        <Image src={photos.margalla.src} alt={photos.margalla.alt} fill placeholder="blur" sizes="100vw" className="-z-20 object-cover opacity-50" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        <div className="container-page">
          <p className="eyebrow mb-4 flex items-center gap-2 text-snow/70">
            <span aria-hidden className="h-px w-6 bg-apricot-bright" />
            About Shimal Trails
          </p>
          <h1 className="max-w-4xl text-5xl leading-[0.98] sm:text-7xl">
            <em>Shimal</em> means north. We built the planner we wished we had.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-snow/80">
            Planning a trip north usually means stitching together Facebook groups, old blogs and guesses about roads.
            Shimal Trails puts {destinations.length} destinations, the roads between them, the seasons and honest costs
            in one place, built for a phone and priced in rupees.
          </p>
        </div>
      </section>

      <section className="container-page py-20 sm:py-24">
        <SectionHeading eyebrow="What we believe" title="Three promises" />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[1.4rem] border border-line bg-line md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="bg-snow p-7">
              <div className="flex items-center justify-between">
                <p.icon className="size-6 text-apricot" aria-hidden />
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </div>
              <h3 className="mt-8 text-3xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-snow">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-[0.9fr_1.5fr]">
          <SectionHeading eyebrow="Travel safely" title="Three things the mountains will teach you anyway" />
          <ul className="space-y-6">
            {SAFETY.map((s) => (
              <li key={s.title} className="flex gap-5 border-b border-line pb-6 last:border-0">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-glacier-soft text-glacier">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-medium">{s.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-20 sm:py-24">
        <SectionHeading
          eyebrow="The team"
          title="Built by three students in Islamabad"
          description="CS4032 Web Programming, BS Cyber Security, Fall 2026."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {team.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="rounded-[1.4rem] bg-paper-2 p-8 sm:p-10">
          <h2 className="text-3xl">Credits and honesty</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">
            Photos are from Wikimedia Commons contributors under free licences and are credited on each destination page.
            Altitudes, seasons and drive times are approximate and come from public sources linked on every page; prices
            are planning estimates from November 2026. Bookings on this site are simulated: nothing is sent or charged.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/destinations">Explore destinations</Button>
            <Button href="/itinerary" variant="outline">Open the builder</Button>
          </div>
        </div>
      </section>
    </>
  );
}
