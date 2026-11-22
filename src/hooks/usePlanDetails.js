import { useData } from '../context/DataContext.jsx';
import { usePlan } from '../context/PlanContext.jsx';
import { getLineIssues } from '../rules/planValidation.js';
import { calculateLineCost } from '../rules/pricing.js';
import { getDepartureStatus } from '../rules/bookingCutoff.js';

// Joins the saved plan lines with the current trip data. Everything here is
// derived on each render, never stored, so it cannot go out of date.
export default function usePlanDetails() {
  const { experiences, status } = useData();
  const plan = usePlan();
  const ready = status === 'success';

  const items = plan.lines.map((line) => {
    const experience = experiences.find((e) => e.id === line.experienceId) ?? null;
    const rawDeparture = experience?.departures.find((d) => d.id === line.departureId) ?? null;
    const departure = rawDeparture
      ? { ...rawDeparture, status: getDepartureStatus(rawDeparture.daysUntil, rawDeparture.seatsLeft) }
      : null;
    // Until data has loaded we cannot judge the line, so report no issues yet.
    const issues = ready ? getLineIssues(line, experience) : [];
    const cost = experience ? calculateLineCost(experience, line) : { base: 0, addOns: 0, selectedAddOns: [], total: 0 };
    return { line, experience, departure, issues, cost };
  });

  const issueCount = items.reduce((sum, item) => sum + item.issues.length, 0);
  return { ...plan, items, issueCount, ready };
}
