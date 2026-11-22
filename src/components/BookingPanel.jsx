import { useState } from 'react';
import { Link } from 'react-router-dom';
import Stepper from './Stepper.jsx';
import DepartureOptions from './DepartureOptions.jsx';
import AddOnOptions from './AddOnOptions.jsx';
import PriceBreakdown from './PriceBreakdown.jsx';
import { checkTravellerCount, MIN_TRAVELLERS, MAX_TRAVELLERS_PER_BOOKING } from '../rules/travellerLimit.js';
import { describeMinAge } from '../rules/ageEligibility.js';
import { calculateLineCost } from '../rules/pricing.js';
import { getNextOpenDeparture, withStatus } from '../utils/experienceQueries.js';
import { DEPARTURE_STATUS } from '../rules/bookingCutoff.js';

// Draft booking for one trip. The draft lives here until the customer saves
// it; saving sends it up to the plan through the onSave callback prop.
export default function BookingPanel({ experience, existingLine, onSave, onRemove }) {
  const departures = withStatus(experience.departures);
  const existingDeparture = departures.find((d) => d.id === existingLine?.departureId);
  const firstOpen = getNextOpenDeparture(experience);

  // Start from the saved line if the trip is already in the plan and its date
  // is still open; otherwise suggest the next open date.
  const [departureId, setDepartureId] = useState(
    existingDeparture?.status === DEPARTURE_STATUS.OPEN ? existingDeparture.id : (firstOpen?.id ?? ''),
  );
  const [travellersInput, setTravellersInput] = useState(String(existingLine?.travellers ?? 1));
  const [addOnIds, setAddOnIds] = useState(existingLine?.addOnIds ?? []);
  const [savedMessage, setSavedMessage] = useState('');

  const selectedDeparture = departures.find((d) => d.id === departureId) ?? null;
  const travellers = Number(travellersInput);
  const travellerCheck = selectedDeparture
    ? checkTravellerCount(travellers, selectedDeparture.seatsLeft)
    : { ok: false, max: 0, message: '' };
  const cost = calculateLineCost(experience, { travellers: travellerCheck.ok ? travellers : 0, addOnIds });

  const isUnchanged =
    existingLine &&
    existingLine.departureId === departureId &&
    existingLine.travellers === travellers &&
    [...existingLine.addOnIds].sort().join() === [...addOnIds].sort().join();

  let blockReason = '';
  if (!firstOpen) blockReason = 'No dates are open for online booking on this trip.';
  else if (!selectedDeparture) blockReason = 'Choose a departure date first.';
  else if (!travellerCheck.ok) blockReason = 'Fix the number of travellers to continue.';

  const toggleAddOn = (addOnId) => {
    setSavedMessage('');
    setAddOnIds((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (blockReason || isUnchanged) return;
    onSave({ experienceId: experience.id, departureId, travellers, addOnIds });
    setSavedMessage(existingLine ? 'Your plan has been updated.' : 'Added to your plan.');
  };

  const seatsHint = selectedDeparture
    ? `${MIN_TRAVELLERS} to ${MAX_TRAVELLERS_PER_BOOKING} travellers per booking · ${selectedDeparture.seatsLeft} ${
        selectedDeparture.seatsLeft === 1 ? 'seat' : 'seats'
      } left on this date`
    : `${MIN_TRAVELLERS} to ${MAX_TRAVELLERS_PER_BOOKING} travellers per booking`;

  return (
    <form className="panel booking-panel" onSubmit={handleSubmit} aria-labelledby="booking-heading" noValidate>
      <h2 id="booking-heading" className="booking-panel__heading">
        {existingLine ? 'Change this trip in your plan' : 'Book this trip'}
      </h2>

      {experience.minAge > 0 && (
        <p className="notice notice--info small">
          <strong>{describeMinAge(experience.minAge)}.</strong> The youngest traveller must be at least {experience.minAge}.
          You will enter their age at checkout.
        </p>
      )}

      {existingLine && existingDeparture && existingDeparture.status !== DEPARTURE_STATUS.OPEN && (
        <p className="notice notice--warning small" role="status">
          The date saved in your plan is no longer available. Pick another date below and update your plan.
        </p>
      )}

      <DepartureOptions
        name={`departure-${experience.id}`}
        departures={experience.departures}
        selectedId={departureId}
        onSelect={(id) => {
          setSavedMessage('');
          setDepartureId(id);
        }}
      />

      <Stepper
        id="travellers"
        label="Travellers"
        value={travellersInput}
        onChange={(value) => {
          setSavedMessage('');
          setTravellersInput(value);
        }}
        min={MIN_TRAVELLERS}
        max={Math.max(MIN_TRAVELLERS, travellerCheck.max)}
        hint={seatsHint}
        hintId="travellers-hint"
        error={selectedDeparture && !travellerCheck.ok ? travellerCheck.message : ''}
        errorId="travellers-error"
      />

      <AddOnOptions idPrefix={`addon-${experience.id}`} addOns={experience.addOns} selectedIds={addOnIds} onToggle={toggleAddOn} />

      <PriceBreakdown experience={experience} travellers={travellerCheck.ok ? travellers : 0} cost={cost} />

      <button
        type="submit"
        className="btn btn--primary btn--block btn--large"
        aria-disabled={blockReason || isUnchanged ? 'true' : undefined}
        aria-describedby={blockReason ? 'booking-block-reason' : undefined}
      >
        {existingLine ? (isUnchanged ? '✓ Saved in your plan' : 'Update plan') : 'Add to plan'}
      </button>
      {blockReason && (
        <p id="booking-block-reason" className="field__hint booking-panel__reason">
          {blockReason}
        </p>
      )}

      {savedMessage && (
        <div className="notice notice--success" role="status">
          <p className="notice__title">✓ {savedMessage}</p>
          <p>
            <Link to="/plan">Review your plan and check out</Link>
          </p>
        </div>
      )}

      {existingLine && (
        <button type="button" className="btn btn--danger btn--small" onClick={onRemove}>
          Remove this trip from my plan
        </button>
      )}
    </form>
  );
}
