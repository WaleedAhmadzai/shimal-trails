// Pricing helpers shared by the details page, plan page and checkout, so the
// customer sees the same numbers everywhere (Decision 3).

// Pickup is part of the fulfilment rule set: meeting points are free,
// doorstep pickup inside the service area costs a flat fee per booking.
export const DOORSTEP_PICKUP_FEE = 1500;

export const MEETING_POINTS = [
  { id: 'faizabad', label: 'Faizabad Metro Station, Islamabad' },
  { id: 'f9-park', label: 'F-9 Park main gate, Islamabad' },
  { id: 'saddar-rwp', label: 'Saddar Metro Station, Rawalpindi' },
];

// Doorstep pickup is only offered inside this service area.
export const DOORSTEP_AREAS = [
  'Islamabad: E-11',
  'Islamabad: F-6 / F-7',
  'Islamabad: F-10 / F-11',
  'Islamabad: G-9 / G-10 / G-11',
  'Islamabad: H-8 / H-9 / H-11',
  'Islamabad: I-8',
  'Rawalpindi: Satellite Town',
  'Rawalpindi: Saddar',
  'Rawalpindi: Bahria Town Phase 1 to 8',
];

/** Cost of one plan line: base price and selected add-ons, per traveller. */
export function calculateLineCost(experience, { travellers, addOnIds = [] }) {
  const count = Number.isInteger(travellers) && travellers > 0 ? travellers : 0;
  const selectedAddOns = experience.addOns.filter((addOn) => addOnIds.includes(addOn.id));
  const base = experience.pricePerPerson * count;
  const addOnsPerPerson = selectedAddOns.reduce((sum, addOn) => sum + addOn.pricePerPerson, 0);
  const addOns = addOnsPerPerson * count;
  return { base, addOns, selectedAddOns, total: base + addOns };
}

/**
 * Totals for the whole plan.
 * @param {{ experience: object, line: object }[]} items
 * @param {'meeting'|'doorstep'} pickupType
 */
export function calculatePlanSummary(items, pickupType = 'meeting') {
  const lineCosts = items.map(({ experience, line }) => calculateLineCost(experience, line));
  const subtotal = lineCosts.reduce((sum, cost) => sum + cost.total, 0);
  const addOnsTotal = lineCosts.reduce((sum, cost) => sum + cost.addOns, 0);
  const travellerSeats = items.reduce((sum, { line }) => sum + (line.travellers || 0), 0);
  const tripDays = items.reduce((sum, { experience }) => sum + experience.durationDays, 0);
  // One pickup fee per trip booking, because each trip leaves on a different day.
  const pickupFee = pickupType === 'doorstep' ? DOORSTEP_PICKUP_FEE * items.length : 0;
  return {
    tripCount: items.length,
    travellerSeats,
    tripDays,
    addOnsTotal,
    subtotal,
    pickupFee,
    total: subtotal + pickupFee,
  };
}
