import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import { usePlan } from '../context/PlanContext.jsx';
import { getDemoSettings, saveDemoSettings, DEFAULT_DEMO_SETTINGS } from '../services/demoSettings.js';
import { STORAGE_KEYS } from '../services/storage.js';

// Clearly labelled demonstration controls for reproducing edge cases:
// loading failure, empty data, changed availability and corrupted storage.
export default function DemoPage() {
  const { reload, status } = useData();
  const { lines } = usePlan();
  const [settings, setSettings] = useState(getDemoSettings);
  const [message, setMessage] = useState('');

  const apply = (patch, note) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveDemoSettings(next);
    reload(); // reload trip data so the change takes effect everywhere
    setMessage(note);
  };

  const setPlanSeats = (seats) => {
    const overrides = { ...settings.seatOverrides };
    lines.forEach((line) => {
      overrides[line.departureId] = seats;
    });
    apply(
      { seatOverrides: overrides },
      `Seats on the ${lines.length} date(s) in your plan set to ${seats}. Open your plan to see the conflict.`,
    );
  };

  const corruptSavedPlan = () => {
    window.localStorage.setItem(STORAGE_KEYS.plan, '{this is not valid JSON');
    window.location.reload(); // the plan is read from storage on start-up
  };

  const overrideCount = Object.keys(settings.seatOverrides).length;

  return (
    <div className="container page demo">
      <header className="page-header">
        <p className="eyebrow">For testers and markers</p>
        <h1>Demo settings</h1>
        <p className="lede">
          These controls simulate problems so edge cases can be checked. They are saved in this browser and apply after
          the trip data reloads. Current data status: <strong>{status}</strong>.
        </p>
      </header>

      {message && (
        <div className="notice notice--success" role="status">
          <p>{message}</p>
        </div>
      )}

      <div className="demo__grid">
        <section className="panel" aria-labelledby="loading-heading">
          <h2 id="loading-heading">Loading</h2>
          <fieldset className="field">
            <legend>Simulate a loading failure</legend>
            {[
              { value: 'off', label: 'Off: data loads normally' },
              { value: 'once', label: 'Fail once: the next load fails, Retry then works' },
              { value: 'always', label: 'Always fail: every load fails until turned off' },
            ].map((option) => (
              <label className="radio" key={option.value} htmlFor={`fail-${option.value}`}>
                <input
                  id={`fail-${option.value}`}
                  type="radio"
                  name="failMode"
                  checked={settings.failMode === option.value}
                  onChange={() => apply({ failMode: option.value }, `Loading failure set to “${option.value}”.`)}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          <label className="checkbox" htmlFor="slow">
            <input
              id="slow"
              type="checkbox"
              checked={settings.slowNetwork}
              onChange={(e) => apply({ slowNetwork: e.target.checked }, 'Network speed changed.')}
            />
            Slow network (2.5 second delay, to see the loading state)
          </label>
          <label className="checkbox" htmlFor="empty">
            <input
              id="empty"
              type="checkbox"
              checked={settings.emptyDataset}
              onChange={(e) => apply({ emptyDataset: e.target.checked }, 'Empty dataset setting changed.')}
            />
            Empty dataset (the loader returns no trips at all)
          </label>
        </section>

        <section className="panel" aria-labelledby="availability-heading">
          <h2 id="availability-heading">Changed availability</h2>
          <div className="field">
            <label htmlFor="dayOffset">Pretend today is this many days later</label>
            <input
              id="dayOffset"
              type="number"
              min="0"
              max="30"
              value={settings.dayOffset}
              onChange={(e) => {
                const n = Math.min(30, Math.max(0, Number.parseInt(e.target.value, 10) || 0));
                apply({ dayOffset: n }, `Today is now simulated as ${n} day(s) later.`);
              }}
            />
            <p className="field__hint">
              Tests the 3-day booking cutoff. Example: add the Fairy Meadows date that is 5 days away, then set this to
              3. That date is now 2 days away, closes, and your plan asks you to choose another date.
            </p>
          </div>

          <p className="small">
            Seat changes apply to the {lines.length} date(s) currently in your plan
            {overrideCount > 0 && ` (${overrideCount} date(s) changed so far)`}.
          </p>
          <div className="button-row">
            <button
              type="button"
              className="btn btn--secondary btn--small"
              disabled={!lines.length}
              onClick={() => setPlanSeats(0)}
            >
              Sell out dates in my plan
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--small"
              disabled={!lines.length}
              onClick={() => setPlanSeats(1)}
            >
              Leave 1 seat on dates in my plan
            </button>
            <button
              type="button"
              className="btn btn--link"
              disabled={!overrideCount}
              onClick={() => apply({ seatOverrides: {} }, 'Seat changes removed.')}
            >
              Undo seat changes
            </button>
          </div>
        </section>

        <section className="panel" aria-labelledby="storage-heading">
          <h2 id="storage-heading">Saved data</h2>
          <p>Replace the saved plan with unreadable data and reload, to check that the app recovers.</p>
          <button type="button" className="btn btn--secondary btn--small" onClick={corruptSavedPlan}>
            Corrupt saved plan and reload
          </button>
        </section>
      </div>

      <div className="button-row demo__footer">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => apply({ ...DEFAULT_DEMO_SETTINGS }, 'All demo settings reset. The site behaves normally.')}
        >
          Reset all demo settings
        </button>
        <Link to="/plan">Go to my plan</Link>
        <Link to="/experiences">Go to trips</Link>
      </div>
    </div>
  );
}
