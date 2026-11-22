import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout({ planCount, planIssues }) {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const isFirstRender = useRef(true);

  // On route change: scroll to the top and move keyboard focus to the main
  // area so screen-reader and keyboard users start at the new content.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Header planCount={planCount} planIssues={planIssues} />
      <main id="main" ref={mainRef} tabIndex={-1} className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
