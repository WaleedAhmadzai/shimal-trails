import { CATEGORIES, DIFFICULTIES } from '../data/experiences.js';
import { SORT_OPTIONS } from '../utils/experienceQueries.js';

// Search, filter and sort controls. This component does not own any state:
// it shows the current criteria and reports changes through onChange.
export default function FilterBar({ criteria, onChange, onReset, ageError }) {
  const update = (key) => (event) => {
    const { type, checked, value } = event.target;
    onChange({ [key]: type === 'checkbox' ? checked : value });
  };

  return (
    <form
      className="filter-bar"
      role="search"
      aria-label="Search and filter trips"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="field field--search">
        <label htmlFor="search">Search trips</label>
        <input
          id="search"
          type="search"
          placeholder="Try Hunza, lake, trek…"
          value={criteria.q}
          onChange={update('q')}
        />
      </div>

      <div className="field">
        <label htmlFor="category">Trip type</label>
        <select id="category" value={criteria.category} onChange={update('category')}>
          <option value="all">All types</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="difficulty">Difficulty</label>
        <select id="difficulty" value={criteria.difficulty} onChange={update('difficulty')}>
          <option value="all">Any difficulty</option>
          {DIFFICULTIES.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </div>

      <div className="field field--narrow">
        <label htmlFor="age">Youngest traveller&apos;s age</label>
        <input
          id="age"
          type="number"
          inputMode="numeric"
          min="0"
          max="90"
          placeholder="Any"
          value={criteria.age}
          onChange={update('age')}
          aria-invalid={ageError ? 'true' : undefined}
          aria-describedby={ageError ? 'age-error' : undefined}
        />
        {ageError && (
          <p id="age-error" className="field__error">
            {ageError}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={criteria.sort} onChange={update('sort')}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__footer">
        <label className="checkbox">
          <input type="checkbox" checked={criteria.openOnly} onChange={update('openOnly')} />
          Only trips with dates open for booking
        </label>
        <button type="button" className="btn btn--link" onClick={onReset}>
          Clear all filters
        </button>
      </div>
    </form>
  );
}
