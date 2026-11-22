import { useState } from 'react';
import { Link } from 'react-router-dom';
import usePlanDetails from '../hooks/usePlanDetails.js';
import DataGate from '../components/DataGate.jsx';
import PlanItem from '../components/PlanItem.jsx';
import PlanSummary from '../components/PlanSummary.jsx';
import { EmptyState } from '../components/StatusViews.jsx';
import { calculatePlanSummary } from '../rules/pricing.js';
import { formatPKR } from '../utils/format.js';

export default function PlanPage() {
  const plan = usePlanDetails();
  // Remember the last removed line so the customer can undo a mistake.
  const [removed, setRemoved] = useState(null);

  const handleRemove = (item, index) => {
    plan.removeLine(item.line.experienceId);
    setRemoved({ line: item.line, index, title: item.experience?.title ?? 'Trip' });
  };

  const validItems = plan.items.filter((item) => item.experience);
  const summary = calculatePlanSummary(validItems, 'meeting');
  const canCheckout = plan.items.length > 0 && plan.issueCount === 0;

  return (
    <div className={`container page ${plan.items.length ? 'has-mobile-bar' : ''}`}>
      <header className="page-header">
        <p className="eyebrow">Step 2 of 3</p>
        <h1>Your trip plan</h1>
        <p className="lede">Change dates, travellers or extras here. Every change is saved on this device.</p>
      </header>

      {plan.storageNotice && (
        <div className="notice notice--warning" role="alert">
          <p>{plan.storageNotice}</p>
          <button type="button" className="btn btn--link" onClick={plan.dismissStorageNotice}>
            Dismiss
          </button>
        </div>
      )}

      {removed && (
        <div className="notice notice--info" role="status">
          <p>
            Removed “{removed.title}” from your plan.{' '}
            <button
              type="button"
              className="btn btn--link"
              onClick={() => {
                plan.restoreLine(removed.line, removed.index);
                setRemoved(null);
              }}
            >
              Undo
            </button>
          </p>
        </div>
      )}

      <DataGate loadingLabel="Checking your plan against the latest dates and seats…">
        {plan.items.length === 0 ? (
          <EmptyState
            title="Your plan is empty"
            actions={
              <Link className="btn btn--primary" to="/experiences">
                Browse trips
              </Link>
            }
          >
            <p>Open a trip, choose a date and travellers, then add it to your plan.</p>
          </EmptyState>
        ) : (
          <div className="two-column">
            <div>
              {plan.issueCount > 0 && (
                <div className="notice notice--warning" role="alert">
                  <p className="notice__title">
                    {plan.issueCount} {plan.issueCount === 1 ? 'problem needs' : 'problems need'} fixing before checkout
                  </p>
                  <p>
                    Seats and dates may have changed since you saved this plan. Use the buttons on each trip to fix
                    them.
                  </p>
                </div>
              )}
              <ul className="plan-list">
                {plan.items.map((item, index) => (
                  <PlanItem
                    key={item.line.experienceId}
                    item={item}
                    onUpdate={(patch) => plan.updateLine(item.line.experienceId, patch)}
                    onToggleAddOn={(addOnId) => plan.toggleAddOn(item.line.experienceId, addOnId)}
                    onRemove={() => handleRemove(item, index)}
                  />
                ))}
              </ul>
              <Link to="/experiences">+ Add another trip</Link>
            </div>
            <aside className="sticky-aside">
              <PlanSummary summary={summary}>
                {canCheckout ? (
                  <Link className="btn btn--primary btn--block btn--large" to="/checkout">
                    Continue to details
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="btn btn--primary btn--block btn--large"
                    aria-disabled="true"
                    aria-describedby="checkout-block"
                  >
                    Continue to details
                  </button>
                )}
                {!canCheckout && (
                  <p id="checkout-block" className="field__hint">
                    Fix the highlighted problems to continue.
                  </p>
                )}
              </PlanSummary>
            </aside>
            {/* Small screens: total and primary action stay visible while editing. */}
            <div className="mobile-bar">
              <p className="mobile-bar__total">
                <span className="small muted">
                  {summary.tripCount} {summary.tripCount === 1 ? 'trip' : 'trips'} · total
                </span>
                <strong>{formatPKR(summary.total)}</strong>
              </p>
              {canCheckout ? (
                <Link className="btn btn--primary" to="/checkout">
                  Continue
                </Link>
              ) : (
                <span className="notice--warning small mobile-bar__blocked">
                  ⚠ Fix {plan.issueCount} problem(s) first
                </span>
              )}
            </div>
          </div>
        )}
      </DataGate>
    </div>
  );
}
