// Demonstration settings used to reproduce edge cases (see README and /demo).
// They are stored in localStorage so they survive a page reload.

import { readJSON, writeJSON, STORAGE_KEYS } from './storage.js';

export const DEFAULT_DEMO_SETTINGS = {
  failMode: 'off', // 'off' | 'once' | 'always' — make the mock loader reject
  emptyDataset: false, // loader returns no records at all
  dayOffset: 0, // pretend today is N days later (tests the booking cutoff)
  seatOverrides: {}, // { [departureId]: seatsLeft } — simulate seats selling
  slowNetwork: false, // longer loading delay so the loading state is visible
  brokenImage: false, // one trip's photo URL points to a missing file
};

export function getDemoSettings() {
  const { value } = readJSON(STORAGE_KEYS.demo, DEFAULT_DEMO_SETTINGS);
  // Merge so that settings saved by an older version still have every key.
  return { ...DEFAULT_DEMO_SETTINGS, ...(value && typeof value === 'object' ? value : {}) };
}

export function saveDemoSettings(settings) {
  writeJSON(STORAGE_KEYS.demo, settings);
}
