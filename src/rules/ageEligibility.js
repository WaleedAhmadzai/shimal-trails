// RULE 2 — Eligibility: minimum age
// Each trip has a minimum age (0 = all ages). The youngest traveller in the
// group must be at least that age. Challenging high-altitude trips are 16+.
// Boundary: a 16-year-old may book a 16+ trip; a 15-year-old may not.

export const MIN_ENTERABLE_AGE = 1;
export const MAX_ENTERABLE_AGE = 90;

export function isOldEnough(youngestAge, minAge) {
  return youngestAge >= minAge;
}

/** Text used on cards and detail pages. */
export function describeMinAge(minAge) {
  return minAge > 0 ? `Ages ${minAge}+` : 'All ages';
}

/**
 * Checks the youngest traveller's age against every trip in the plan.
 * @param {number} youngestAge
 * @param {{ id: string, title: string, minAge: number }[]} trips
 * @returns {{ ok: boolean, blockingTrips: { id: string, title: string, minAge: number }[] }}
 */
export function checkAgeEligibility(youngestAge, trips) {
  const blockingTrips = trips.filter((trip) => !isOldEnough(youngestAge, trip.minAge));
  return { ok: blockingTrips.length === 0, blockingTrips };
}
