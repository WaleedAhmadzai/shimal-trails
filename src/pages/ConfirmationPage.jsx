import { Link } from 'react-router-dom';
import { usePlan } from '../context/PlanContext.jsx';
import { EmptyState } from '../components/StatusViews.jsx';
import { formatPKR, formatDate } from '../utils/format.js';

export default function ConfirmationPage() {
  const { lastBooking } = usePlan();

  if (!lastBooking) {
    return (
      <div className="container page">
        <EmptyState
          title="No booking to show yet"
          actions={
            <Link className="btn btn--primary" to="/experiences">
              Browse trips
            </Link>
          }
        >
          <p>When you complete a booking, its reference and summary appear here.</p>
        </EmptyState>
      </div>
    );
  }

  const { reference, items, pickup, summary, createdAt } = lastBooking;

  return (
    <div className="container page confirmation">
      <div className="confirmation__banner" role="status">
        <span className="confirmation__icon" aria-hidden="true">
          ✓
        </span>
        <div>
          <p className="eyebrow">Booking confirmed · simulated</p>
          <h1>You&apos;re going north!</h1>
          <p>
            Booking reference <strong className="confirmation__ref">{reference}</strong>
          </p>
          <p className="small">
            Made on {new Date(createdAt).toLocaleString('en-GB')}. This is a student demo: no payment was taken and no
            booking was sent.
          </p>
        </div>
      </div>

      <div className="two-column">
        <section className="panel" aria-labelledby="booked-heading">
          <h2 id="booked-heading">Your trips</h2>
          <ul className="confirmation__list">
            {items.map((item) => (
              <li key={item.experienceId}>
                <h3>{item.title}</h3>
                <p>
                  {formatDate(new Date(item.departureDate))} · {item.travellers}{' '}
                  {item.travellers === 1 ? 'traveller' : 'travellers'}
                  {item.addOns.length > 0 && ` · Extras: ${item.addOns.join(', ')}`}
                </p>
                <p className="confirmation__line-total">{formatPKR(item.total)}</p>
              </li>
            ))}
          </ul>
          <h2>Pickup</h2>
          <p>{pickup}</p>
          <h2>What happens next</h2>
          <ol>
            <li>Our team would call the lead traveller within 24 hours to confirm.</li>
            <li>A packing list is sent 3 days before departure.</li>
            <li>Carry your CNIC or passport: there are checkpoints on northern roads.</li>
          </ol>
        </section>
        <aside className="panel summary">
          <h2>Amount due</h2>
          <dl className="summary__list">
            <div>
              <dt>Trips</dt>
              <dd>{formatPKR(summary.subtotal)}</dd>
            </div>
            <div>
              <dt>Pickup</dt>
              <dd>{summary.pickupFee === 0 ? 'Free' : formatPKR(summary.pickupFee)}</dd>
            </div>
            <div className="summary__total">
              <dt>Total</dt>
              <dd>{formatPKR(summary.total)}</dd>
            </div>
          </dl>
          <Link className="btn btn--primary btn--block" to="/experiences">
            Plan another trip
          </Link>
        </aside>
      </div>
    </div>
  );
}
