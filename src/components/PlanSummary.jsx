import { formatPKR } from '../utils/format.js';
import { DOORSTEP_PICKUP_FEE } from '../rules/pricing.js';

// Calculated summary for the whole plan. Values are derived by the parent
// with calculatePlanSummary() and passed in as props.
export default function PlanSummary({ summary, pickupKnown = false, children, title = 'Plan summary' }) {
  return (
    <section className="panel summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading">{title}</h2>
      <dl className="summary__list">
        <div>
          <dt>Trips</dt>
          <dd>{summary.tripCount}</dd>
        </div>
        <div>
          <dt>Traveller seats</dt>
          <dd>{summary.travellerSeats}</dd>
        </div>
        <div>
          <dt>Days on the road</dt>
          <dd>{summary.tripDays}</dd>
        </div>
        <div>
          <dt>Extras included</dt>
          <dd>{formatPKR(summary.addOnsTotal)}</dd>
        </div>
        <div>
          <dt>Trips subtotal</dt>
          <dd>{formatPKR(summary.subtotal)}</dd>
        </div>
        <div>
          <dt>Pickup</dt>
          <dd>
            {pickupKnown
              ? summary.pickupFee === 0
                ? 'Free'
                : formatPKR(summary.pickupFee)
              : `Free, or ${formatPKR(DOORSTEP_PICKUP_FEE)}/trip doorstep`}
          </dd>
        </div>
        <div className="summary__total">
          <dt>{pickupKnown ? 'Total to pay' : 'Total (meeting-point pickup)'}</dt>
          <dd>{formatPKR(summary.total)}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}
