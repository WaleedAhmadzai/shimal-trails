// Asynchronous mock loader. There is no real server: data comes from
// src/data/experiences.js after a short delay, like a network request.

import { experiences } from '../data/experiences.js';
import { getDemoSettings, saveDemoSettings } from './demoSettings.js';

const NORMAL_DELAY_MS = 600;
const SLOW_DELAY_MS = 2500;
export const BROKEN_IMAGE_TRIP = 'rawal-heritage-evening';

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Request cancelled', 'AbortError'));
    });
  });
}

/**
 * Loads all experiences.
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<object[]>}
 */
export async function fetchExperiences({ signal } = {}) {
  const settings = getDemoSettings();
  await wait(settings.slowNetwork ? SLOW_DELAY_MS : NORMAL_DELAY_MS, signal);

  if (settings.failMode === 'once') {
    // Fail one time only, so the Retry button then succeeds.
    saveDemoSettings({ ...settings, failMode: 'off' });
    throw new Error('The trip list could not be loaded (simulated network error).');
  }
  if (settings.failMode === 'always') {
    throw new Error('The trip list could not be loaded (simulated server outage).');
  }
  if (settings.emptyDataset) return [];

  // Return copies so nothing can mutate the source data, and apply the
  // demo seat overrides to simulate seats being sold to other customers.
  return experiences.map((experience) => ({
    ...experience,
    // Demo: point one photo at a file that does not exist, to test the fallback.
    ...(settings.brokenImage && experience.id === BROKEN_IMAGE_TRIP ? { image: '/photos/missing.jpg' } : {}),
    departures: experience.departures.map((departure) => {
      const override = settings.seatOverrides[departure.id];
      return {
        ...departure,
        daysUntil: departure.daysFromToday - settings.dayOffset,
        seatsLeft: override === undefined ? departure.seatsLeft : override,
      };
    }),
  }));
}
