// Re-checks every plan line against the CURRENT data and all three rules.
// This runs on every render, so a plan restored from localStorage, or a plan
// whose seats/dates changed since it was saved, shows conflicts immediately.

import { checkTravellerCount } from './travellerLimit.js';
import { getDepartureStatus, DEPARTURE_STATUS, BOOKING_CUTOFF_DAYS } from './bookingCutoff.js';

/**
 * @returns {{ code: string, message: string, fix?: { label: string, type: string, patch?: object } }[]}
 */
export function getLineIssues(line, experience) {
  if (!experience) {
    return [{ code: 'TRIP_REMOVED', message: 'This trip is no longer offered.', fix: { label: 'Remove from plan', type: 'remove' } }];
  }

  const issues = [];
  const departure = experience.departures.find((d) => d.id === line.departureId);

  if (!departure) {
    issues.push({
      code: 'DEPARTURE_REMOVED',
      message: 'The date you chose has been cancelled. Choose another date.',
      fix: { label: 'Choose another date', type: 'chooseDate' },
    });
  } else {
    const status = getDepartureStatus(departure.daysUntil, departure.seatsLeft);
    if (status === DEPARTURE_STATUS.CLOSED || status === DEPARTURE_STATUS.DEPARTED) {
      issues.push({
        code: 'DEPARTURE_CLOSED',
        message: `Online booking for this date has closed (it ends ${BOOKING_CUTOFF_DAYS} days before departure). Choose a later date.`,
        fix: { label: 'Choose another date', type: 'chooseDate' },
      });
    } else if (status === DEPARTURE_STATUS.SOLD_OUT) {
      issues.push({
        code: 'SOLD_OUT',
        message: 'This date has sold out since you added it. Choose another date.',
        fix: { label: 'Choose another date', type: 'chooseDate' },
      });
    } else {
      const check = checkTravellerCount(line.travellers, departure.seatsLeft);
      if (!check.ok) {
        issues.push({
          code: check.code,
          message: check.message,
          fix: check.max > 0 && line.travellers > check.max
            ? { label: `Change to ${check.max} ${check.max === 1 ? 'traveller' : 'travellers'}`, type: 'patch', patch: { travellers: check.max } }
            : undefined,
        });
      }
    }
  }

  const knownAddOns = experience.addOns.map((addOn) => addOn.id);
  const missingAddOns = line.addOnIds.filter((id) => !knownAddOns.includes(id));
  if (missingAddOns.length > 0) {
    issues.push({
      code: 'ADDON_REMOVED',
      message: 'An extra you chose is no longer offered and will not be charged.',
      fix: { label: 'Remove the extra', type: 'patch', patch: { addOnIds: line.addOnIds.filter((id) => knownAddOns.includes(id)) } },
    });
  }
  return issues;
}
