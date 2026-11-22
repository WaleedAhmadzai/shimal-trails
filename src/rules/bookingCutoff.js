// RULE 3 — Fulfilment: booking cutoff
// Online booking for a departure closes 3 days before it leaves, because the
// team needs time to confirm hotels, jeeps and permits. A departure exactly
// 3 days away can still be booked; 2 days away cannot.

export const BOOKING_CUTOFF_DAYS = 3;

export const DEPARTURE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed', // inside the cutoff window
  SOLD_OUT: 'soldout',
  DEPARTED: 'departed',
};

/**
 * @param {number} daysUntil  whole days from today until departure
 * @param {number} seatsLeft
 */
export function getDepartureStatus(daysUntil, seatsLeft) {
  if (daysUntil < 0) return DEPARTURE_STATUS.DEPARTED;
  if (daysUntil < BOOKING_CUTOFF_DAYS) return DEPARTURE_STATUS.CLOSED;
  if (seatsLeft <= 0) return DEPARTURE_STATUS.SOLD_OUT;
  return DEPARTURE_STATUS.OPEN;
}

export function isBookable(daysUntil, seatsLeft) {
  return getDepartureStatus(daysUntil, seatsLeft) === DEPARTURE_STATUS.OPEN;
}

/** Short, human-readable status text. Colour is never the only signal. */
export function describeDepartureStatus(status, seatsLeft) {
  switch (status) {
    case DEPARTURE_STATUS.DEPARTED:
      return 'Already departed';
    case DEPARTURE_STATUS.CLOSED:
      return `Booking closed (online booking ends ${BOOKING_CUTOFF_DAYS} days before departure)`;
    case DEPARTURE_STATUS.SOLD_OUT:
      return 'Sold out';
    default:
      return seatsLeft <= 3
        ? `Only ${seatsLeft} ${seatsLeft === 1 ? 'seat' : 'seats'} left`
        : `${seatsLeft} seats left`;
  }
}
