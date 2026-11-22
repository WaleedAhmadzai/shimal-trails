import { NavLink, Link } from 'react-router-dom';

export default function Header({ planCount = 0, planIssues = 0 }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Shimal Trails home">
          <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M6 52 L26 18 L36 33 L44 23 L60 52 Z" fill="currentColor" />
            <path d="M26 18 L31 27 L27 26 L22 30 Z" fill="var(--color-accent)" />
          </svg>
          <span className="brand__name">Shimal Trails</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav-list">
            <li>
              <NavLink to="/experiences">Trips</NavLink>
            </li>
            <li>
              <NavLink to="/plan" className="nav-plan">
                My plan
                <span className="nav-plan__count" aria-label={`${planCount} trips in plan`}>
                  {planCount}
                </span>
                {planIssues > 0 && (
                  <span className="nav-plan__alert">
                    <span aria-hidden="true">!</span>
                    <span className="visually-hidden">{planIssues} need attention</span>
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
