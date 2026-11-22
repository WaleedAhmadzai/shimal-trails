import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import { getDemoSettings, DEFAULT_DEMO_SETTINGS } from '../services/demoSettings.js';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout({ planCount, planIssues }) {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const previousPath = useRef(pathname);
  useData(); // re-render when data reloads, so the demo banner stays current
  const demo = getDemoSettings();
  const demoActive =
    demo.failMode !== 'off' ||
    demo.emptyDataset ||
    demo.slowNetwork ||
    demo.dayOffset !== DEFAULT_DEMO_SETTINGS.dayOffset ||
    Object.keys(demo.seatOverrides).length > 0;

  // On route change: scroll to the top and move keyboard focus to the main
  // area so screen-reader and keyboard users start at the new content.
  useEffect(() => {
    // Only on a real navigation (not the first load).
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header planCount={planCount} planIssues={planIssues} />
      {demoActive && pathname !== '/demo' && (
        <p className="demo-banner">
          Demo settings are changing how this site behaves. <Link to="/demo">View or reset demo settings</Link>
        </p>
      )}
      <main id="main" ref={mainRef} tabIndex={-1} className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
