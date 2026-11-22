import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback.jsx';
import TripFacts from './TripFacts.jsx';
import { formatPKR, formatDate, getDepartureDate } from '../utils/format.js';
import { getNextOpenDeparture } from '../utils/experienceQueries.js';
import { describeDepartureStatus } from '../rules/bookingCutoff.js';

export default function ExperienceCard({ experience, inPlan = false, listSearch = '' }) {
  const next = getNextOpenDeparture(experience);
  const detailsPath = `/experiences/${experience.id}`;
  // Remember the listing filters so the details page can link back to them.
  const linkState = { listSearch };

  return (
    <article className={`card ${inPlan ? 'card--selected' : ''}`}>
      <div className="card__media">
        <ImageWithFallback src={experience.image} alt={experience.imageAlt} label={experience.title} />
        <span className="card__category">{experience.category}</span>
        {inPlan && <span className="card__badge">✓ In your plan</span>}
      </div>
      <div className="card__body">
        <p className="card__region">{experience.region}</p>
        <h3 className="card__title">
          <Link to={detailsPath} state={linkState}>
            {experience.title}
          </Link>
        </h3>
        <TripFacts experience={experience} compact />
        <p className={`card__availability ${next ? 'is-open' : 'is-unavailable'}`}>
          {next ? (
            <>
              <strong>Next: {formatDate(getDepartureDate(next.daysFromToday))}</strong>
              <span> · {describeDepartureStatus(next.status, next.seatsLeft)}</span>
            </>
          ) : (
            <strong>No dates open for online booking</strong>
          )}
        </p>
      </div>
      <div className="card__footer">
        <p className="price">
          <span className="price__amount">{formatPKR(experience.pricePerPerson)}</span>
          <span className="price__unit">per person</span>
        </p>
        <Link
          className="btn btn--secondary btn--small"
          to={detailsPath}
          state={linkState}
          aria-label={`View dates and prices for ${experience.title}`}
        >
          View dates
        </Link>
      </div>
    </article>
  );
}
