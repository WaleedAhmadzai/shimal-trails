import { formatDate, formatDaysUntil, getDepartureDate } from '../utils/format.js';
import { describeDepartureStatus, DEPARTURE_STATUS } from '../rules/bookingCutoff.js';
import { withStatus } from '../utils/experienceQueries.js';

// Every departure is listed with its seats and status (Decision 2).
// Closed and sold-out dates stay visible but cannot be selected.
export default function DepartureOptions({ name, departures, selectedId, onSelect }) {
  const sorted = withStatus(departures).sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <fieldset className="field">
      <legend>Choose a departure date</legend>
      <ul className="departures">
        {sorted.map((departure) => {
          const open = departure.status === DEPARTURE_STATUS.OPEN;
          const selected = departure.id === selectedId;
          const inputId = `${name}-${departure.id}`;
          return (
            <li key={departure.id}>
              <label
                htmlFor={inputId}
                className={`departure ${selected ? 'is-selected' : ''} ${open ? '' : 'is-unavailable'}`}
              >
                <input
                  id={inputId}
                  type="radio"
                  name={name}
                  value={departure.id}
                  checked={selected}
                  disabled={!open}
                  onChange={() => onSelect(departure.id)}
                />
                <span className="departure__date">
                  {formatDate(getDepartureDate(departure.daysFromToday))}
                  <span className="departure__when"> · {formatDaysUntil(departure.daysUntil)}</span>
                </span>
                <span className={`departure__status status--${departure.status}`}>
                  {!open && <span aria-hidden="true">⊘ </span>}
                  {describeDepartureStatus(departure.status, departure.seatsLeft)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
