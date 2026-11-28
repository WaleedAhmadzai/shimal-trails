import type { Metadata } from "next";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { TripRequestForm } from "@/components/forms/TripRequestForm";

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Send your northern Pakistan itinerary to a local operator and get a quote within 24 hours. Free, no obligation.",
};

/** Server Component shell; the form inside is a Client Component. */
export default function PlanTripPage() {
  return (
    <div className="container-page pt-28 pb-24">
      <header className="mb-10 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4 flex items-center gap-2 text-pine">
            <span aria-hidden className="h-0.5 w-6 rounded-full bg-pine" />
            Get a quote
          </p>
          <h1 className="text-5xl leading-[0.98] sm:text-7xl">
            Hand your plan to a <em>local</em>
          </h1>
          <p className="mt-4 text-lg text-muted">
            Tell us how to reach you. A vetted operator from the region you are visiting replies with a price.
          </p>
        </div>
        <ul className="grid gap-3 text-sm">
          {[
            { icon: Clock, text: "Reply within 24 hours" },
            { icon: MessageCircle, text: "On WhatsApp, a call or email" },
            { icon: ShieldCheck, text: "Free, no obligation to book" },
          ].map((item) => (
            <li key={item.text} className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-pine-soft text-pine">
                <item.icon className="size-4" aria-hidden />
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </header>
      <TripRequestForm />
    </div>
  );
}
