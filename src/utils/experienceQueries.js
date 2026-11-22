// Pure functions for searching, filtering and sorting the trip list.
// The listing page derives its results from these on every render.

import { getDepartureStatus, DEPARTURE_STATUS } from '../rules/bookingCutoff.js';
import { isOldEnough } from '../rules/ageEligibility.js';

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'soonest', label: 'Next open departure' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'duration-asc', label: 'Duration: shortest first' },
];

export const DEFAULT_CRITERIA = {
  q: '',
  category: 'all',
  difficulty: 'all',
  age: '',
  openOnly: false,
  sort: 'recommended',
};

/** Departures with their current status attached. */
export function withStatus(departures) {
  return departures.map((departure) => ({
    ...departure,
    status: getDepartureStatus(departure.daysUntil, departure.seatsLeft),
  }));
}

/** The earliest departure that can still be booked, or null. */
export function getNextOpenDeparture(experience) {
  const open = withStatus(experience.departures)
    .filter((departure) => departure.status === DEPARTURE_STATUS.OPEN)
    .sort((a, b) => a.daysUntil - b.daysUntil);
  return open[0] ?? null;
}

function matchesSearch(experience, query) {
  if (!query) return true;
  const haystack = [experience.title, experience.region, experience.summary, experience.category, experience.difficulty]
    .join(' ')
    .toLowerCase();
  // Every word must appear somewhere, so "hunza road" finds the Hunza road trip.
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

/** Parses the age filter. Returns null when empty or invalid. */
export function parseAge(age) {
  if (age === '' || age === null || age === undefined) return null;
  const n = Number(age);
  return Number.isInteger(n) && n >= 0 && n <= 90 ? n : null;
}

export function filterExperiences(list, criteria) {
  const { q, category, difficulty, age, openOnly } = criteria;
  const ageNumber = parseAge(age);
  return list.filter(
    (experience) =>
      matchesSearch(experience, q.trim()) &&
      (category === 'all' || experience.category === category) &&
      (difficulty === 'all' || experience.difficulty === difficulty) &&
      (ageNumber === null || isOldEnough(ageNumber, experience.minAge)) &&
      (!openOnly || getNextOpenDeparture(experience) !== null),
  );
}

export function sortExperiences(list, sort) {
  const copy = [...list]; // never sort the shared array in place
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    case 'price-desc':
      return copy.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    case 'duration-asc':
      return copy.sort((a, b) => a.durationDays - b.durationDays || a.pricePerPerson - b.pricePerPerson);
    case 'soonest': {
      // Trips with no open departure go to the end.
      const key = (experience) => getNextOpenDeparture(experience)?.daysUntil ?? Infinity;
      return copy.sort((a, b) => key(a) - key(b));
    }
    default:
      return copy; // recommended = order in the data file
  }
}

/**
 * When no results match, work out which single change would bring results
 * back, so the empty state can offer a useful next step.
 */
export function suggestRelaxations(list, criteria) {
  const candidates = [
    { key: 'q', label: 'Clear the search text', patch: { q: '' } },
    { key: 'category', label: 'Show all trip types', patch: { category: 'all' } },
    { key: 'difficulty', label: 'Show every difficulty', patch: { difficulty: 'all' } },
    { key: 'age', label: 'Remove the age filter', patch: { age: '' } },
    { key: 'openOnly', label: 'Include trips without open dates', patch: { openOnly: false } },
  ];
  return candidates
    .filter(({ key }) => criteria[key] !== DEFAULT_CRITERIA[key])
    .map((candidate) => ({
      ...candidate,
      count: filterExperiences(list, { ...criteria, ...candidate.patch }).length,
    }))
    .filter((candidate) => candidate.count > 0);
}
