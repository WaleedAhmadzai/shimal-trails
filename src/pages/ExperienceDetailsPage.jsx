import { Link, useLocation, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import DataGate from '../components/DataGate.jsx';
import ImageWithFallback from '../components/ImageWithFallback.jsx';
import TripFacts from '../components/TripFacts.jsx';
import { EmptyState } from '../components/StatusViews.jsx';
import { formatPKR } from '../utils/format.js';

export default function ExperienceDetailsPage() {
  return (
    <div className="container page">
      <DataGate loadingLabel="Loading trip details…">
        <DetailsContent />
      </DataGate>
    </div>
  );
}

function DetailsContent() {
  const { experienceId } = useParams();
  const { state } = useLocation();
  const { getExperience, experiences } = useData();
  const experience = getExperience(experienceId);
  const backTo = `/experiences${state?.listSearch ?? ''}`;

  if (!experience) {
    // Suggest trips whose ID shares a word with the address that was typed.
    const words = experienceId.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 2);
    const similar = experiences.filter((e) => words.some((w) => e.id.includes(w))).slice(0, 3);
    return (
      <EmptyState
        title="We couldn't find that trip"
        actions={
          <Link className="btn btn--primary" to="/experiences">
            Browse all trips
          </Link>
        }
      >
        <p>
          There is no trip with the ID <code>{experienceId}</code>. It may have been removed or the link may be mistyped.
        </p>
        {similar.length > 0 && (
          <>
            <p>Did you mean:</p>
            <ul>
              {similar.map((e) => (
                <li key={e.id}>
                  <Link to={`/experiences/${e.id}`}>{e.title}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </EmptyState>
    );
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link to={backTo}>← Back to trips</Link>
      </nav>
      <div className="details">
        <div className="details__main">
          <div className="details__media">
            <ImageWithFallback src={experience.image} alt={experience.imageAlt} label={experience.title} />
          </div>
          <p className="eyebrow">
            {experience.category} · {experience.region}
          </p>
          <h1 className="details__title">{experience.title}</h1>
          <p className="lede">{experience.summary}</p>
          <TripFacts experience={experience} />

          <section className="details__section" aria-labelledby="about-heading">
            <h2 id="about-heading">About this trip</h2>
            <p>{experience.description}</p>
          </section>

          <section className="details__section details__columns" aria-labelledby="included-heading">
            <div>
              <h2 id="included-heading">Included in the price</h2>
              <ul className="tick-list">
                {experience.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Not included</h2>
              <ul className="cross-list">
                {experience.notIncluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {experience.addOns.length > 0 && (
                <p className="muted small">Optional extras with fixed prices can be added in the booking panel.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="details__aside" aria-label="Price">
          <div className="panel">
            <p className="price">
              <span className="price__amount">{formatPKR(experience.pricePerPerson)}</span>
              <span className="price__unit">per person</span>
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
