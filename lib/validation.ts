import { LIMITS } from "@/data/pricing";
import type { TripRequest, TripRequestErrors } from "@/types";
import { daysUntil } from "./itinerary/warnings";

export const PICKUP_CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Peshawar", "Other"] as const;
export const REQUESTS_MAX = 500;

export const EMPTY_REQUEST: TripRequest = {
  fullName: "",
  mobile: "",
  email: "",
  startDate: "",
  travellers: "2",
  tier: "",
  pickupCity: "Islamabad",
  pickupOther: "",
  contactBy: "whatsapp",
  requests: "",
  agree: false,
};

/** Pakistani mobile: 03XXXXXXXXX or +923XXXXXXXXX; spaces and dashes ignored. */
export function isPakistaniMobile(value: string) {
  return /^(?:\+92|0)3\d{9}$/.test(value.replace(/[\s-]/g, ""));
}

/**
 * Validate one field. Pure, so it can be unit-tested and reused by a real
 * API later. `today` is an ISO date used for the notice-period rule.
 */
export function validateField(
  field: keyof TripRequest,
  form: TripRequest,
  today: string,
): string | undefined {
  switch (field) {
    case "fullName": {
      const name = form.fullName.trim();
      if (!name) return "Enter your full name.";
      if (name.length < 3 || name.length > 60 || !/^[\p{L} .'-]+$/u.test(name))
        return "Use 3 to 60 letters for your name.";
      return;
    }
    case "mobile":
      if (!form.mobile.trim()) return "Enter your mobile number.";
      if (!isPakistaniMobile(form.mobile)) return "Enter a mobile number like 0300 1234567.";
      return;
    case "email":
      if (!form.email.trim()) return "Enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) return "Enter a valid email address.";
      return;
    case "startDate": {
      if (!form.startDate) return "Choose a start date.";
      const lead = daysUntil(form.startDate, today);
      if (lead < LIMITS.minNoticeDays) return `Trips need at least ${LIMITS.minNoticeDays} days' notice.`;
      if (lead > 365) return "Choose a date within the next 12 months.";
      return;
    }
    case "travellers": {
      const n = Number(form.travellers);
      if (!Number.isInteger(n) || n < 1 || n > LIMITS.maxTravellers)
        return `Enter a whole number from 1 to ${LIMITS.maxTravellers}.`;
      return;
    }
    case "tier":
      if (!form.tier) return "Choose a comfort level.";
      return;
    case "pickupOther":
      if (form.pickupCity === "Other" && !form.pickupOther.trim()) return "Tell us where to pick you up.";
      return;
    case "requests":
      if (form.requests.length > REQUESTS_MAX) return `Keep it under ${REQUESTS_MAX} characters.`;
      return;
    case "agree":
      if (!form.agree) return "Please accept the terms to continue.";
      return;
    default:
      return;
  }
}

export const VALIDATED_FIELDS: (keyof TripRequest)[] = [
  "fullName",
  "mobile",
  "email",
  "startDate",
  "travellers",
  "tier",
  "pickupOther",
  "requests",
  "agree",
];

export function validateTripRequest(form: TripRequest, today: string): TripRequestErrors {
  const errors: TripRequestErrors = {};
  for (const field of VALIDATED_FIELDS) {
    const message = validateField(field, form, today);
    if (message) errors[field] = message;
  }
  return errors;
}
