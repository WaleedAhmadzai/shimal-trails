"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { TripSummary } from "@/components/itinerary/TripSummary";
import { todayIso, useItinerary } from "@/context/ItineraryProvider";
import { LIMITS, TIER_LABELS, TIER_NOTES } from "@/data/pricing";
import { planTrip } from "@/lib/itinerary";
import { addDays, cn, formatDate } from "@/lib/utils";
import {
  EMPTY_REQUEST,
  PICKUP_CITIES,
  REQUESTS_MAX,
  VALIDATED_FIELDS,
  validateField,
  validateTripRequest,
} from "@/lib/validation";
import type { Tier, TripRequest, TripRequestErrors } from "@/types";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { FormField } from "./FormField";

// Client Component: every input is controlled by useState, fields are
// validated on blur and on submit, and the "send" is simulated in state.

const CONTACT_LABELS = { whatsapp: "WhatsApp", call: "phone call", email: "email" } as const;

export function TripRequestForm() {
  const { itinerary, hydrated } = useItinerary();
  const [form, setForm] = useState<TripRequest>(EMPTY_REQUEST);
  const [errors, setErrors] = useState<TripRequestErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof TripRequest, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [submitted, setSubmitted] = useState<{ reference: string; name: string; contactBy: string; summary: string } | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);

  // After a failed submit, move focus to the error summary so keyboard and
  // screen-reader users land on the list of problems.
  useEffect(() => {
    if (failedAttempts === 0) return;
    summaryRef.current?.focus({ preventScroll: true });
    summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [failedAttempts]);

  const today = hydrated ? todayIso() : "2026-01-01";
  const trip = useMemo(() => planTrip(itinerary, today), [itinerary, today]);
  const hasPlan = trip.plan.stops.length > 0;

  // Fill dates and group size from the itinerary once it has loaded.
  if (hydrated && !prefilled) {
    setPrefilled(true);
    if (hasPlan) {
      setForm((prev) => ({
        ...prev,
        startDate: itinerary.startDate,
        travellers: String(itinerary.travellers),
        tier: itinerary.tier,
      }));
    }
  }

  const update = <K extends keyof TripRequest>(field: K, value: TripRequest[K]) => {
    const next = { ...form, [field]: value };
    setForm(next);
    // Re-check a field as soon as it changes, once the user has left it.
    if (touched[field] || errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, next, today) }));
    }
  };

  const blur = (field: keyof TripRequest) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form, today) }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateTripRequest(form, today);
    setErrors(found);
    setTouched(Object.fromEntries(VALIDATED_FIELDS.map((f) => [f, true])));
    if (VALIDATED_FIELDS.some((f) => found[f])) {
      // The error summary renders after this state update; focus it then.
      setFailedAttempts((n) => n + 1);
      return;
    }
    setStatus("sending");
    window.setTimeout(() => {
      const reference = `ST-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
      setSubmitted({
        reference,
        name: form.fullName.trim(),
        contactBy: CONTACT_LABELS[form.contactBy],
        summary: hasPlan
          ? `${trip.plan.stops.map((s) => s.destination.name).join(", ")} · ${trip.plan.days.length} days from ${formatDate(form.startDate)}`
          : `Custom trip from ${formatDate(form.startDate)} for ${form.travellers}`,
      });
      setStatus("sent");
      setForm({ ...EMPTY_REQUEST, startDate: form.startDate, travellers: form.travellers, tier: form.tier });
      setTouched({});
      setErrors({});
    }, 900);
  };

  const errorList = VALIDATED_FIELDS.filter((f) => errors[f]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
      <form noValidate onSubmit={handleSubmit} className="space-y-8" aria-describedby="form-note">
        {errorList.length > 0 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="rounded-2xl border border-danger/30 bg-danger-soft p-5 text-danger outline-none"
          >
            <p className="flex items-center gap-2 font-medium">
              <AlertCircle className="size-5" aria-hidden />
              Please fix {errorList.length} {errorList.length === 1 ? "field" : "fields"}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-7 text-sm">
              {errorList.map((f) => (
                <li key={f}>
                  <a href={`#${f}`} className="underline underline-offset-2">{errors[f]}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="space-y-5 rounded-3xl border border-line bg-snow p-6 sm:p-8">
          <legend className="float-left mb-2 w-full font-display text-3xl">About you</legend>
          <div className="clear-both grid gap-5 sm:grid-cols-2">
            <FormField id="fullName" label="Full name" required error={errors.fullName} className="sm:col-span-2">
              {(p) => (
                <input {...p} type="text" autoComplete="name" value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)} onBlur={() => blur("fullName")} placeholder="Ayesha Khan" />
              )}
            </FormField>
            <FormField id="mobile" label="Mobile number" required error={errors.mobile} hint="Pakistani mobile, e.g. 0300 1234567">
              {(p) => (
                <input {...p} type="tel" inputMode="tel" autoComplete="tel" value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value)} onBlur={() => blur("mobile")} placeholder="0300 1234567" />
              )}
            </FormField>
            <FormField id="email" label="Email" required error={errors.email}>
              {(p) => (
                <input {...p} type="email" autoComplete="email" value={form.email}
                  onChange={(e) => update("email", e.target.value)} onBlur={() => blur("email")} placeholder="you@example.com" />
              )}
            </FormField>
          </div>
          <div>
            <p className="text-sm font-medium">Best way to reach you</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Best way to reach you">
              {(Object.keys(CONTACT_LABELS) as (keyof typeof CONTACT_LABELS)[]).map((c) => (
                <label key={c} className="cursor-pointer rounded-full border border-line-strong px-4 py-2 text-sm transition has-[:checked]:border-pine has-[:checked]:bg-pine has-[:checked]:text-snow has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-apricot-bright">
                  <input type="radio" name="contactBy" value={c} checked={form.contactBy === c}
                    onChange={() => update("contactBy", c)} className="sr-only" />
                  {c === "whatsapp" ? "WhatsApp" : c === "call" ? "Phone call" : "Email"}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-5 rounded-3xl border border-line bg-snow p-6 sm:p-8">
          <legend className="float-left mb-2 w-full font-display text-3xl">Your trip</legend>
          <div className="clear-both grid gap-5 sm:grid-cols-2">
            <FormField id="startDate" label="Start date" required error={errors.startDate} hint={`At least ${LIMITS.minNoticeDays} days from today`}>
              {(p) => (
                <input {...p} type="date" value={form.startDate} min={addDays(today, LIMITS.minNoticeDays)}
                  onChange={(e) => update("startDate", e.target.value)} onBlur={() => blur("startDate")} />
              )}
            </FormField>
            <FormField id="travellers" label="Travellers" required error={errors.travellers} hint={`1 to ${LIMITS.maxTravellers} people`}>
              {(p) => (
                <input {...p} type="number" inputMode="numeric" min={1} max={LIMITS.maxTravellers} value={form.travellers}
                  onChange={(e) => update("travellers", e.target.value)} onBlur={() => blur("travellers")} />
              )}
            </FormField>
            <FormField id="tier" label="Comfort level" required error={errors.tier} className="sm:col-span-2">
              {(p) => (
                <select {...p} value={form.tier} onChange={(e) => update("tier", e.target.value as Tier | "")} onBlur={() => blur("tier")}>
                  <option value="">Choose a comfort level</option>
                  {(Object.keys(TIER_LABELS) as Tier[]).map((t) => (
                    <option key={t} value={t}>{TIER_LABELS[t]} · {TIER_NOTES[t]}</option>
                  ))}
                </select>
              )}
            </FormField>
            <FormField id="pickupCity" label="Pick-up city">
              {(p) => (
                <select {...p} value={form.pickupCity} onChange={(e) => update("pickupCity", e.target.value)}>
                  {PICKUP_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
            </FormField>
            {form.pickupCity === "Other" && (
              <FormField id="pickupOther" label="Where should we pick you up?" required error={errors.pickupOther}>
                {(p) => (
                  <input {...p} type="text" value={form.pickupOther}
                    onChange={(e) => update("pickupOther", e.target.value)} onBlur={() => blur("pickupOther")} placeholder="e.g. Gilgit airport" />
                )}
              </FormField>
            )}
            <FormField
              id="requests"
              label="Anything else?"
              error={errors.requests}
              hint={`${form.requests.length}/${REQUESTS_MAX} · dietary needs, a birthday, a fear of heights…`}
              className="sm:col-span-2"
            >
              {(p) => (
                <textarea {...p} rows={4} value={form.requests} className={cn(p.className, "h-auto py-3")}
                  onChange={(e) => update("requests", e.target.value)} onBlur={() => blur("requests")} />
              )}
            </FormField>
          </div>
        </fieldset>

        <div className="space-y-5">
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                id="agree"
                type="checkbox"
                checked={form.agree}
                onChange={(e) => update("agree", e.target.checked)}
                onBlur={() => blur("agree")}
                aria-invalid={errors.agree ? true : undefined}
                aria-describedby={errors.agree ? "agree-error" : undefined}
                className="mt-0.5 size-5 shrink-0 accent-ink"
              />
              <span>
                I agree to be contacted about this trip and understand prices shown are estimates, not a booking.
              </span>
            </label>
            {errors.agree && (
              <p id="agree-error" className="mt-1.5 flex items-center gap-1.5 pl-8 text-sm text-danger">
                <AlertCircle className="size-4" aria-hidden /> {errors.agree}
              </p>
            )}
          </div>
          <Button type="submit" variant="accent" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
            {status === "sending" ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden /> Sending…
              </>
            ) : (
              <>
                Send request <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </Button>
          <p id="form-note" className="text-xs text-muted">
            Demo: this form validates in your browser and shows a confirmation. Nothing is sent or stored.
          </p>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        {hydrated && hasPlan ? (
          <TripSummary itinerary={itinerary} plan={trip.plan} cost={trip.cost} variant="compact">
            <Link href="/itinerary" className="block text-center text-sm text-snow/70 underline-offset-4 hover:text-snow hover:underline">
              Edit itinerary
            </Link>
          </TripSummary>
        ) : (
          <div className="rounded-3xl border border-dashed border-line-strong bg-snow/60 p-6">
            <p className="font-display text-2xl">No itinerary yet</p>
            <p className="mt-2 text-sm text-muted">
              You can still send a request, but operators reply faster when they can see your plan.
            </p>
            <Button href="/itinerary" variant="outline" size="sm" className="mt-4">Build an itinerary</Button>
          </div>
        )}
      </aside>

      {submitted && (
        <ConfirmationDialog
          open={status === "sent"}
          reference={submitted.reference}
          name={submitted.name}
          contactBy={submitted.contactBy}
          summary={submitted.summary}
          onClose={() => setStatus("idle")}
        />
      )}
    </div>
  );
}
