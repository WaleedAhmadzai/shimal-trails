import { formatPKR } from '../utils/format.js';
import { DOORSTEP_PICKUP_FEE } from '../rules/pricing.js';

// Line-by-line price for one trip, shown BEFORE it is added (Decision 3).
export default function PriceBreakdown({ experience, travellers, cost }) {
  const count = travellers > 0 ? travellers : 0;
  return (
    <div className="breakdown" aria-live="polite">
      <h3 className="breakdown__title">Price for your group</h3>
      <dl>
        <div className="breakdown__row">
          <dt>
            {formatPKR(experience.pricePerPerson)} × {count} {count === 1 ? 'traveller' : 'travellers'}
          </dt>
          <dd>{formatPKR(cost.base)}</dd>
        </div>
        {cost.selectedAddOns.map((addOn) => (
          <div className="breakdown__row" key={addOn.id}>
            <dt>
              {addOn.label} × {count}
            </dt>
            <dd>{formatPKR(addOn.pricePerPerson * count)}</dd>
          </div>
        ))}
        <div className="breakdown__row breakdown__row--total">
          <dt>Trip total</dt>
          <dd>{formatPKR(cost.total)}</dd>
        </div>
      </dl>
      <p className="breakdown__note">
        Pickup is chosen at checkout: free from a meeting point, or {formatPKR(DOORSTEP_PICKUP_FEE)} for doorstep pickup
        in Islamabad/Rawalpindi. No other charges are added.
      </p>
    </div>
  );
}
