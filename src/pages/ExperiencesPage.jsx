import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import DataGate from '../components/DataGate.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ExperienceCard from '../components/ExperienceCard.jsx';
import { EmptyState } from '../components/StatusViews.jsx';
import {
  DEFAULT_CRITERIA,
  filterExperiences,
  sortExperiences,
  suggestRelaxations,
  parseAge,
} from '../utils/experienceQueries.js';

// Filters live in the URL (?q=hunza&difficulty=Easy), so Back/Forward,
// refresh and shared links all keep the customer's place.
function readCriteria(searchParams) {
  return {
    q: searchParams.get('q') ?? DEFAULT_CRITERIA.q,
    category: searchParams.get('category') ?? DEFAULT_CRITERIA.category,
    difficulty: searchParams.get('difficulty') ?? DEFAULT_CRITERIA.difficulty,
    age: searchParams.get('age') ?? DEFAULT_CRITERIA.age,
    openOnly: searchParams.get('open') === '1',
    sort: searchParams.get('sort') ?? DEFAULT_CRITERIA.sort,
  };
}

function toSearchParams(criteria) {
  const params = new URLSearchParams();
  if (criteria.q) params.set('q', criteria.q);
  if (criteria.category !== 'all') params.set('category', criteria.category);
  if (criteria.difficulty !== 'all') params.set('difficulty', criteria.difficulty);
  if (criteria.age !== '') params.set('age', criteria.age);
  if (criteria.openOnly) params.set('open', '1');
  if (criteria.sort !== 'recommended') params.set('sort', criteria.sort);
  return params;
}

export default function ExperiencesPage({ planIds = [] }) {
  const { experiences } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const criteria = readCriteria(searchParams);

  const updateCriteria = (patch) => {
    // Typing should not create a history entry for every key press.
    const isTyping = 'q' in patch || 'age' in patch;
    setSearchParams(toSearchParams({ ...criteria, ...patch }), { replace: isTyping });
  };
  const resetCriteria = () => setSearchParams(new URLSearchParams());

  const ageError = criteria.age !== '' && parseAge(criteria.age) === null ? 'Enter an age from 0 to 90.' : '';
  // An invalid age is ignored rather than hiding every trip.
  const effectiveCriteria = ageError ? { ...criteria, age: '' } : criteria;
  const results = sortExperiences(filterExperiences(experiences, effectiveCriteria), criteria.sort);
  const listSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return (
    <div className="container page">
      <header className="page-header">
        <p className="eyebrow">All trips from Islamabad</p>
        <h1>Find a trip that fits your group</h1>
        <p className="lede">
          Every card shows difficulty, age limit and the next date you can book, so you can compare before opening a trip.
        </p>
      </header>

      <DataGate>
        {experiences.length === 0 ? (
          <EmptyState
            title="No trips are published right now"
            actions={
              <Link className="btn btn--secondary" to="/demo">
                Check demo settings
              </Link>
            }
          >
            <p>Our team is planning the next season. This is different from a search with no matches: there are no trips at all.</p>
          </EmptyState>
        ) : (
          <>
            <FilterBar criteria={criteria} onChange={updateCriteria} onReset={resetCriteria} ageError={ageError} />
            <p className="results-count" role="status" aria-live="polite">
              Showing <strong>{results.length}</strong> of {experiences.length} trips
            </p>
            {results.length === 0 ? (
              <NoMatches experiences={experiences} criteria={effectiveCriteria} onChange={updateCriteria} onReset={resetCriteria} />
            ) : (
              <ul className="card-grid">
                {results.map((experience) => (
                  <li key={experience.id}>
                    <ExperienceCard experience={experience} inPlan={planIds.includes(experience.id)} listSearch={listSearch} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </DataGate>
    </div>
  );
}

function NoMatches({ experiences, criteria, onChange, onReset }) {
  const suggestions = suggestRelaxations(experiences, criteria);
  return (
    <EmptyState
      title="No trips match these filters"
      actions={
        <button type="button" className="btn btn--primary" onClick={onReset}>
          Clear all filters
        </button>
      }
    >
      {criteria.q && (
        <p>
          Nothing matched &ldquo;<strong>{criteria.q}</strong>&rdquo; with the other filters you chose.
        </p>
      )}
      {suggestions.length > 0 ? (
        <>
          <p>Try one of these changes:</p>
          <ul className="suggestion-list">
            {suggestions.map((suggestion) => (
              <li key={suggestion.key}>
                <button type="button" className="btn btn--secondary btn--small" onClick={() => onChange(suggestion.patch)}>
                  {suggestion.label} ({suggestion.count} {suggestion.count === 1 ? 'trip' : 'trips'})
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Clear the filters to see all {experiences.length} trips.</p>
      )}
    </EmptyState>
  );
}
