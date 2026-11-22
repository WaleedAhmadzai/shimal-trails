// Validation for the checkout form. Pure function: form values in, a map of
// field -> message out. An empty object means the form is valid.

import { checkAgeEligibility, MIN_ENTERABLE_AGE, MAX_ENTERABLE_AGE, describeMinAge } from '../rules/ageEligibility.js';

export const NOTES_MAX_LENGTH = 300;

export const EMPTY_CHECKOUT_FORM = {
  leadName: '',
  phone: '',
  email: '',
  youngestAge: '',
  pickupType: 'meeting', // 'meeting' | 'doorstep'
  meetingPoint: '',
  doorstepArea: '',
  notes: '',
  acceptTerms: false,
};

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/;
// Pakistani mobile numbers: 03XX-XXXXXXX, with or without the dash/space.
const PHONE_PATTERN = /^03\d{2}[- ]?\d{7}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * @param {typeof EMPTY_CHECKOUT_FORM} form
 * @param {{ id: string, title: string, minAge: number }[]} trips  trips in the plan
 */
export function validateCheckout(form, trips) {
  const errors = {};
  const name = form.leadName.trim();

  if (!name) errors.leadName = 'Enter the lead traveller’s full name.';
  else if (name.length < 3) errors.leadName = 'The name must be at least 3 characters.';
  else if (!NAME_PATTERN.test(name)) errors.leadName = 'Use letters, spaces, apostrophes or hyphens only.';

  if (!form.phone.trim()) errors.phone = 'Enter a mobile number so the trip leader can reach you.';
  else if (!PHONE_PATTERN.test(form.phone.trim())) errors.phone = 'Enter a Pakistani mobile number like 0300-1234567.';

  if (!form.email.trim()) errors.email = 'Enter an email address for your booking summary.';
  else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = 'Enter an email address like name@example.com.';

  // Rule 2 (eligibility) is enforced here against every trip in the plan.
  const ageText = String(form.youngestAge).trim();
  const age = Number(ageText);
  if (!ageText) errors.youngestAge = 'Enter the age of the youngest traveller.';
  else if (!Number.isInteger(age) || age < MIN_ENTERABLE_AGE || age > MAX_ENTERABLE_AGE) {
    errors.youngestAge = `Enter a whole number from ${MIN_ENTERABLE_AGE} to ${MAX_ENTERABLE_AGE}.`;
  } else {
    const { ok, blockingTrips } = checkAgeEligibility(age, trips);
    if (!ok) {
      const names = blockingTrips.map((trip) => `${trip.title} (${describeMinAge(trip.minAge)})`).join(', ');
      errors.youngestAge = `A ${age}-year-old cannot join: ${names}. Remove ${blockingTrips.length === 1 ? 'that trip' : 'those trips'} from your plan or check the age.`;
    }
  }

  if (form.pickupType === 'meeting' && !form.meetingPoint) errors.meetingPoint = 'Choose a meeting point.';
  if (form.pickupType === 'doorstep' && !form.doorstepArea)
    errors.doorstepArea = 'Choose your area. Doorstep pickup is only offered in these areas.';

  if (form.notes.length > NOTES_MAX_LENGTH)
    errors.notes = `Keep notes under ${NOTES_MAX_LENGTH} characters (currently ${form.notes.length}).`;

  if (!form.acceptTerms) errors.acceptTerms = 'Confirm that you have read the cancellation policy.';

  return errors;
}
