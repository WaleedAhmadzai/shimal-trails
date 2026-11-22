import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback.jsx';
import Stepper from './Stepper.jsx';
import AddOnOptions from './AddOnOptions.jsx';
import { formatPKR, formatDate, getDepartureDate, formatDuration } from '../utils/format.js';
import { describeDepartureStatus, DEPARTURE_STATUS } from '../rules/bookingCutoff.js';
import { MIN_TRAVELLERS, MAX_TRAVELLERS_PER_BOOKING } from '../rules/travellerLimit.js';
import { withStatus } from '../utils/experienceQueries.js';

// One trip in the plan. It reports every change upward through callback
// props; PlanPage decides how the shared plan state is updated.
export default function PlanItem({ item, onUpdate, onToggleAddOn, onRemove }) {
  const { line, experience, departure, issues, cost } = item;
  const dateSelectRef = useRef(null);

  if (!experience) {
    return (
      <li className="plan-item plan-item--broken">
        <div className="notice notice--error">
          <p className="notice__title">A saved trip is no longer available</p>
          <p>The trip with ID “{line.experienceId}” has been removed from our list.</p>
          <button type="button" className="btn btn--secondary btn--small" onClick={onRemove}>
            Remove it from my plan
          </button>
        </div>
      </li>
    );
  }

  const departures = withStatus(experience.departures).sort((a, b) => a.daysUntil - b.daysUntil);
  const idBase = `plan-${experience.id}`;

  const applyFix = (fix) => {
    if (fix.type === 'remove') onRemove();
    if (fix.type === 'patch') onUpdate(fix.patch);
    if (fix.type === 'chooseDate') dateSelectRef.current?.focus();
  };

  return (
    <li className={`plan-item ${issues.length ? 'plan-item--issue' : ''}`}>
      <div className="plan-item__media">
        <ImageWithFallback src={experience.image} alt="" label={experience.title} />
      </div>
      <div className="plan-item__body">
        <h2 className="plan-item__title">
          <Link to={`/experiences/${experience.id}`}>{experience.title}</Link>
        </h2>
        <p className="muted small">
          {formatDuration(experience.durationDays)} · {experience.region}
        </p>

        {issues.length > 0 && (
          <div className="notice notice--warning" role="alert">
            <p className="notice__title">⚠ Needs your attention</p>
            <ul className="issue-list">
              {issues.map((issue) => (
                <li key={issue.code}>
                  {issue.message}{' '}
                  {issue.fix && (
                    <button type="button" className="btn btn--link" onClick={() => applyFix(issue.fix)}>
                      {issue.fix.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="plan-item__controls">
          <div className="field">
            <label htmlFor={`${idBase}-date`}>Departure date</label>
            <select
              id={`${idBase}-date`}
              ref={dateSelectRef}
              value={departure ? line.departureId : ''}
              onChange={(event) => onUpdate({ departureId: event.target.value })}
              aria-invalid={issues.some((i) => i.fix?.type === 'chooseDate') ? 'true' : undefined}
            >
              {!departure && <option value="">Choose a date</option>}
              {departures.map((d) => (
                <option
                  key={d.id}
                  value={d.id}
                  // The current date stays selectable so the select can show it.
                  disabled={d.status !== DEPARTURE_STATUS.OPEN && d.id !== line.departureId}
                >
                  {formatDate(getDepartureDate(d.daysFromToday))} · {describeDepartureStatus(d.status, d.seatsLeft)}
                </option>
              ))}
            </select>
          </div>

          <Stepper
            id={`${idBase}-travellers`}
            label="Travellers"
            value={String(line.travellers)}
            onChange={(value) => {
              const n = Number.parseInt(value, 10);
              onUpdate({ travellers: Number.isNaN(n) ? 0 : n });
            }}
            min={MIN_TRAVELLERS}
            max={MAX_TRAVELLERS_PER_BOOKING}
            hint={departure ? `Up to ${Math.min(MAX_TRAVELLERS_PER_BOOKING, departure.seatsLeft)} on this date` : ''}
            hintId={`${idBase}-travellers-hint`}
          />
        </div>

        <AddOnOptions
          idPrefix={`${idBase}-addon`}
          addOns={experience.addOns}
          selectedIds={line.addOnIds}
          onToggle={onToggleAddOn}
        />

        <div className="plan-item__footer">
          <p className="plan-item__total">
            <span className="muted small">Trip total</span>
            <strong>{formatPKR(cost.total)}</strong>
          </p>
          <button type="button" className="btn btn--danger btn--small" onClick={onRemove}>
            Remove<span className="visually-hidden"> {experience.title}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
