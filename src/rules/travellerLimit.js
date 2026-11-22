// RULE 1 — Availability / capacity (tested in travellerLimit.test.js)
// A booking line must have 1 to 8 travellers, and never more travellers
// than the seats left on the chosen departure.

export const MIN_TRAVELLERS = 1;
export const MAX_TRAVELLERS_PER_BOOKING = 8;

/**
 * Checks a traveller count against the booking limit and the seats left.
 * Returns a plain object so it can be tested without the interface.
 *
 * @param {number} travellers  number of travellers requested
 * @param {number} seatsLeft   seats still available on the departure
 * @returns {{ ok: boolean, code: string, max: number, message: string }}
 */
export function checkTravellerCount(travellers, seatsLeft) {
  // The largest number this departure can accept right now.
  const max = Math.max(0, Math.min(MAX_TRAVELLERS_PER_BOOKING, seatsLeft));

  if (!Number.isInteger(travellers)) {
    return { ok: false, code: 'NOT_A_WHOLE_NUMBER', max, message: 'Enter the number of travellers as a whole number.' };
  }
  if (seatsLeft <= 0) {
    return { ok: false, code: 'SOLD_OUT', max, message: 'This departure is sold out. Choose another date.' };
  }
  if (travellers < MIN_TRAVELLERS) {
    return { ok: false, code: 'BELOW_MINIMUM', max, message: `A booking needs at least ${MIN_TRAVELLERS} traveller.` };
  }
  if (travellers > MAX_TRAVELLERS_PER_BOOKING) {
    return {
      ok: false,
      code: 'ABOVE_BOOKING_LIMIT',
      max,
      message: `One booking can include up to ${MAX_TRAVELLERS_PER_BOOKING} travellers. For larger groups, make a second booking.`,
    };
  }
  if (travellers > seatsLeft) {
    return {
      ok: false,
      code: 'NOT_ENOUGH_SEATS',
      max,
      message: `Only ${seatsLeft} ${seatsLeft === 1 ? 'seat is' : 'seats are'} left on this date. Reduce travellers to ${seatsLeft} or choose another date.`,
    };
  }
  return { ok: true, code: 'OK', max, message: '' };
}
