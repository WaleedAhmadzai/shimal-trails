// Number input with − / + buttons. The parent owns the value (controlled).
// Out-of-range values can still be typed so the rule message can explain
// the limit; the parent decides whether the value is acceptable.
export default function Stepper({ id, label, value, onChange, min = 1, max = 99, hint, error, hintId, errorId }) {
  const number = Number.parseInt(value, 10);
  const safe = Number.isNaN(number) ? min : number;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__btn"
          onClick={() => onChange(String(Math.max(min, safe - 1)))}
          disabled={safe <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          className="stepper__input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          className="stepper__btn"
          onClick={() => onChange(String(safe + 1))}
          disabled={safe >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
