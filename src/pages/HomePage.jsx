import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import DataGate from '../components/DataGate.jsx';
import ExperienceCard from '../components/ExperienceCard.jsx';
import { getNextOpenDeparture } from '../utils/experienceQueries.js';
import { photoCredits } from '../data/photoCredits.js';

const heroCredit = photoCredits['fairy-meadows'];

const STEPS = [
  { title: 'Compare', text: 'See difficulty, age limit, altitude and the next open date on every trip card.' },
  {
    title: 'Choose a date',
    text: 'Pick a departure with live seats. Closed and sold-out dates are labelled, not hidden.',
  },
  {
    title: 'See the full price',
    text: 'Add travellers and extras and the total updates before you add anything to your plan.',
  },
  { title: 'Book', text: 'Choose a pickup point, check the summary and get a booking reference.' },
];

export default function HomePage({ planIds = [] }) {
  const { experiences } = useData();
  // Feature the trips leaving soonest that can still be booked.
  const featured = experiences
    .filter((experience) => getNextOpenDeparture(experience))
    .sort((a, b) => getNextOpenDeparture(a).daysUntil - getNextOpenDeparture(b).daysUntil)
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="eyebrow eyebrow--light">Islamabad · Rawalpindi · Northern Pakistan</p>
          <h1>Weekend hikes and mountain road trips for students and young professionals</h1>
          <p className="hero__lede">
            Small groups, fixed dates, pickup from the twin cities. Check seats and the full price before you commit.
          </p>
          <div className="button-row">
            <Link className="btn btn--primary btn--large" to="/experiences">
              Browse trips
            </Link>
            <Link className="btn btn--ghost btn--large" to="/experiences?category=Day+trip">
              Day trips from the twin cities
            </Link>
          </div>
        </div>
        <p className="hero__credit">
          Fairy Meadows. Photo: <a href={heroCredit.sourceUrl}>{heroCredit.author}</a>,{' '}
          <a href={heroCredit.licenseUrl}>{heroCredit.license}</a>
        </p>
      </section>

      <section className="container section" aria-labelledby="how-heading">
        <h2 id="how-heading">How booking works</h2>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="steps__item">
              <span className="steps__number" aria-hidden="true">
                {index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section" aria-labelledby="soon-heading">
        <div className="section__header">
          <h2 id="soon-heading">Leaving soon, still bookable</h2>
          <Link to="/experiences?sort=soonest">See all by date</Link>
        </div>
        <DataGate>
          <ul className="card-grid">
            {featured.map((experience) => (
              <li key={experience.id}>
                <ExperienceCard experience={experience} inPlan={planIds.includes(experience.id)} />
              </li>
            ))}
          </ul>
        </DataGate>
      </section>
    </>
  );
}
