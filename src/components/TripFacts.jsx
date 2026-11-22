import { formatDuration } from '../utils/format.js';
import { describeMinAge } from '../rules/ageEligibility.js';

const DIFFICULTY_ICON = { Easy: '●○○', Moderate: '●●○', Challenging: '●●●' };

// The facts customers need to compare trips (Decision 1). Each fact is
// labelled in text, so meaning never depends on colour or an icon alone.
export default function TripFacts({ experience, compact = false }) {
  const { durationDays, difficulty, maxAltitudeM, minAge } = experience;
  return (
    <dl className={`trip-facts ${compact ? 'trip-facts--compact' : ''}`}>
      <div>
        <dt>Duration</dt>
        <dd>{formatDuration(durationDays)}</dd>
      </div>
      <div>
        <dt>Difficulty</dt>
        <dd className={`difficulty difficulty--${difficulty.toLowerCase()}`}>
          <span aria-hidden="true">{DIFFICULTY_ICON[difficulty]}</span> {difficulty}
        </dd>
      </div>
      <div>
        <dt>Highest point</dt>
        <dd>{maxAltitudeM.toLocaleString('en-US')} m</dd>
      </div>
      <div>
        <dt>Age limit</dt>
        <dd>{describeMinAge(minAge)}</dd>
      </div>
    </dl>
  );
}
