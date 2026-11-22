import { Link } from 'react-router-dom';

export function LoadingState({ label = 'Loading trips…' }) {
  return (
    <div className="status-view" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="status-view status-view--error" role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <p className="muted">Your saved plan is safe. Try again, or check the demo settings if you turned on a failure.</p>
      <div className="button-row">
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Retry loading
        </button>
        <Link className="btn btn--secondary" to="/demo">
          Open demo settings
        </Link>
      </div>
    </div>
  );
}

export function EmptyState({ title, children, actions }) {
  return (
    <div className="status-view status-view--empty">
      <h2>{title}</h2>
      {children}
      {actions && <div className="button-row">{actions}</div>}
    </div>
  );
}
