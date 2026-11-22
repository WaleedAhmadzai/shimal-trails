import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePlanDetails from '../hooks/usePlanDetails.js';
import DataGate from '../components/DataGate.jsx';
import PlanSummary from '../components/PlanSummary.jsx';
import { EmptyState } from '../components/StatusViews.jsx';
import { calculatePlanSummary, MEETING_POINTS, DOORSTEP_AREAS, DOORSTEP_PICKUP_FEE } from '../rules/pricing.js';
import { validateCheckout, EMPTY_CHECKOUT_FORM, NOTES_MAX_LENGTH } from '../utils/checkoutValidation.js';
import { formatPKR, formatDate, getDepartureDate } from '../utils/format.js';

// Order used for the error summary and for focusing the first problem.
const FIELD_ORDER = [
  'leadName',
  'phone',
  'email',
  'youngestAge',
  'meetingPoint',
  'doorstepArea',
  'notes',
  'acceptTerms',
];
const FIELD_LABELS = {
  leadName: 'Lead traveller name',
  phone: 'Mobile number',
  email: 'Email',
  youngestAge: 'Youngest traveller’s age',
  meetingPoint: 'Meeting point',
  doorstepArea: 'Pickup area',
  notes: 'Notes',
  acceptTerms: 'Cancellation policy',
};

// Simulated booking reference, e.g. ST-K3F9ZQ.
function createReference() {
  return `ST-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export default function CheckoutPage() {
  return (
    <div className="container page">
      <header className="page-header">
        <p className="eyebrow">Step 3 of 3</p>
        <h1>Traveller details and pickup</h1>
      </header>
      <DataGate loadingLabel="Checking seats before checkout…">
        <CheckoutContent />
      </DataGate>
    </div>
  );
}

function CheckoutContent() {
  const plan = usePlanDetails();
  const navigate = useNavigate();
  const errorSummaryRef = useRef(null);

  const [form, setForm] = useState(EMPTY_CHECKOUT_FORM);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validItems = plan.items.filter((item) => item.experience);
  const trips = validItems.map((item) => item.experience);
  const errors = validateCheckout(form, trips);
  const errorFields = FIELD_ORDER.filter((field) => errors[field]);
  const summary = calculatePlanSummary(validItems, form.pickupType);

  if (plan.items.length === 0) {
    return (
      <EmptyState
        title="There is nothing to check out"
        actions={
          <Link className="btn btn--primary" to="/experiences">
            Browse trips
          </Link>
        }
      >
        <p>Your plan is empty. If you just booked, your confirmation is on the confirmation page.</p>
        {plan.lastBooking && <Link to="/confirmation">See your last booking</Link>}
      </EmptyState>
    );
  }

  // Show a field's error after the customer leaves it, or after a submit attempt.
  const visibleError = (field) => (touched[field] || submitAttempted ? errors[field] : undefined);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    // Copy the form object; never mutate state.
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    if (plan.issueCount > 0 || errorFields.length > 0) {
      // Valid values are kept; focus moves to the list of problems.
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    // Simulated booking. Personal details are NOT stored: only the trip
    // choices and totals are kept for the confirmation page.
    const booking = {
      reference: createReference(),
      createdAt: new Date().toISOString(),
      items: validItems.map(({ experience, departure, line, cost }) => ({
        experienceId: experience.id,
        title: experience.title,
        departureDate: getDepartureDate(departure.daysFromToday).toISOString(),
        travellers: line.travellers,
        addOns: cost.selectedAddOns.map((addOn) => addOn.label),
        total: cost.total,
      })),
      pickup:
        form.pickupType === 'meeting'
          ? MEETING_POINTS.find((point) => point.id === form.meetingPoint)?.label
          : `Doorstep pickup: ${form.doorstepArea}`,
      summary,
    };
    plan.completeBooking(booking);
    navigate('/confirmation', { replace: true });
  };

  const fieldProps = (name) => ({
    id: name,
    name,
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': visibleError(name) ? 'true' : undefined,
    'aria-describedby': [visibleError(name) ? `${name}-error` : null, `${name}-hint`].filter(Boolean).join(' '),
  });

  const renderError = (name) =>
    visibleError(name) ? (
      <p id={`${name}-error`} className="field__error">
        {visibleError(name)}
      </p>
    ) : null;

  const showSummary = submitAttempted && (errorFields.length > 0 || plan.issueCount > 0);

  return (
    <div className="two-column">
      <form className="checkout-form panel" onSubmit={handleSubmit} noValidate aria-labelledby="form-heading">
        <h2 id="form-heading">Lead traveller</h2>
        <p className="muted small">
          This is a simulated booking. Nothing you type here is saved or sent. Use made-up details if you prefer.
        </p>

        {showSummary && (
          <div className="notice notice--error" role="alert" tabIndex={-1} ref={errorSummaryRef}>
            <p className="notice__title">Please fix {errorFields.length + (plan.issueCount > 0 ? 1 : 0)} problem(s):</p>
            <ul>
              {plan.issueCount > 0 && (
                <li>
                  Your plan has seat or date problems. <Link to="/plan">Fix them in your plan</Link>.
                </li>
              )}
              {errorFields.map((field) => (
                <li key={field}>
                  <a href={`#${field}`}>
                    {FIELD_LABELS[field]}: {errors[field]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-grid">
          <div className="field field--full">
            <label htmlFor="leadName">Full name</label>
            <input type="text" autoComplete="name" value={form.leadName} {...fieldProps('leadName')} />
            <p id="leadName-hint" className="field__hint">
              As shown on the CNIC or passport you will carry.
            </p>
            {renderError('leadName')}
          </div>

          <div className="field">
            <label htmlFor="phone">Mobile number</label>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="0300-1234567"
              value={form.phone}
              {...fieldProps('phone')}
            />
            <p id="phone-hint" className="field__hint">
              The trip leader calls this number on the day.
            </p>
            {renderError('phone')}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email" autoComplete="email" value={form.email} {...fieldProps('email')} />
            <p id="email-hint" className="field__hint">
              For the packing list and summary.
            </p>
            {renderError('email')}
          </div>

          <div className="field">
            <label htmlFor="youngestAge">Age of the youngest traveller</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="90"
              value={form.youngestAge}
              {...fieldProps('youngestAge')}
            />
            <p id="youngestAge-hint" className="field__hint">
              Checked against each trip&apos;s age limit:{' '}
              {trips
                .map((trip) => `${trip.title.split(':')[0]} ${trip.minAge > 0 ? `${trip.minAge}+` : 'all ages'}`)
                .join(' · ')}
            </p>
            {renderError('youngestAge')}
          </div>
        </div>

        <fieldset className="field form-section">
          <legend className="form-section__legend">Pickup</legend>
          <label className="radio" htmlFor="pickup-meeting">
            <input
              id="pickup-meeting"
              type="radio"
              name="pickupType"
              value="meeting"
              checked={form.pickupType === 'meeting'}
              onChange={handleChange}
            />
            <span>
              <strong>Meeting point</strong> · free
            </span>
          </label>
          <label className="radio" htmlFor="pickup-doorstep">
            <input
              id="pickup-doorstep"
              type="radio"
              name="pickupType"
              value="doorstep"
              checked={form.pickupType === 'doorstep'}
              onChange={handleChange}
            />
            <span>
              <strong>Doorstep pickup</strong> · {formatPKR(DOORSTEP_PICKUP_FEE)} per trip, selected Islamabad and
              Rawalpindi areas only
            </span>
          </label>

          {form.pickupType === 'meeting' ? (
            <div className="field">
              <label htmlFor="meetingPoint">Meeting point</label>
              <select value={form.meetingPoint} {...fieldProps('meetingPoint')}>
                <option value="">Choose a meeting point</option>
                {MEETING_POINTS.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.label}
                  </option>
                ))}
              </select>
              <p id="meetingPoint-hint" className="field__hint">
                Be there 15 minutes before the departure time on your ticket.
              </p>
              {renderError('meetingPoint')}
            </div>
          ) : (
            <div className="field">
              <label htmlFor="doorstepArea">Pickup area</label>
              <select value={form.doorstepArea} {...fieldProps('doorstepArea')}>
                <option value="">Choose your area</option>
                {DOORSTEP_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <p id="doorstepArea-hint" className="field__hint">
                Not listed? Choose a free meeting point instead.
              </p>
              {renderError('doorstepArea')}
            </div>
          )}
        </fieldset>

        <div className="field form-section">
          <label htmlFor="notes">Notes for the trip leader (optional)</label>
          <textarea value={form.notes} {...fieldProps('notes')} />
          <p id="notes-hint" className={`field__hint ${form.notes.length > NOTES_MAX_LENGTH ? 'is-over' : ''}`}>
            Dietary needs, medical conditions to know about. {form.notes.length}/{NOTES_MAX_LENGTH} characters.
          </p>
          {renderError('notes')}
        </div>

        <div className="field form-section">
          <label className="checkbox" htmlFor="acceptTerms">
            <input type="checkbox" checked={form.acceptTerms} {...fieldProps('acceptTerms')} />
            <span>
              I have read the cancellation policy: free cancellation up to 7 days before departure, 50% refund after
              that.
            </span>
          </label>
          <p id="acceptTerms-hint" className="visually-hidden">
            Required
          </p>
          {renderError('acceptTerms')}
        </div>

        <button type="submit" className="btn btn--primary btn--large btn--block">
          Confirm booking (simulated) · {formatPKR(summary.total)}
        </button>
        <p className="field__hint center">No payment is taken. You will get a booking reference on the next page.</p>
      </form>

      <aside className="sticky-aside">
        <PlanSummary summary={summary} pickupKnown title="Booking summary">
          <ul className="mini-list">
            {validItems.map(({ experience, departure, line, cost }) => (
              <li key={experience.id}>
                <strong>{experience.title}</strong>
                <span>
                  {departure ? formatDate(getDepartureDate(departure.daysFromToday)) : 'No date'} · {line.travellers}{' '}
                  {line.travellers === 1 ? 'traveller' : 'travellers'} · {formatPKR(cost.total)}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/plan" className="small">
            Change trips, dates or travellers
          </Link>
        </PlanSummary>
      </aside>
    </div>
  );
}
