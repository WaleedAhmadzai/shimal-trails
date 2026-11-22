import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container page">
      <div className="status-view status-view--empty">
        <h1>Page not found</h1>
        <p>The address you opened does not match any page on Shimal Trails.</p>
        <div className="button-row">
          <Link className="btn btn--primary" to="/experiences">
            Browse all trips
          </Link>
          <Link className="btn btn--secondary" to="/">
            Go to home page
          </Link>
        </div>
      </div>
    </div>
  );
}
