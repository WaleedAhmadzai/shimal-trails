import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchExperiences } from '../services/mockApi.js';

const DataContext = createContext(null);

// Loads the trip data once for the whole app, so the listing, details,
// plan and checkout pages all read the same records (shared state).
export function DataProvider({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [experiences, setExperiences] = useState([]);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0); // bumping this re-runs the effect

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setError(null);

    fetchExperiences({ signal: controller.signal })
      .then((records) => {
        setExperiences(records);
        setStatus('success');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // the component re-rendered or unmounted
        setError(err.message);
        setStatus('error');
      });

    // Cleanup: cancel the request if attempt changes or the provider unmounts.
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const getExperience = useCallback(
    (id) => experiences.find((experience) => experience.id === id) ?? null,
    [experiences],
  );

  return (
    <DataContext.Provider value={{ status, experiences, error, reload, getExperience }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used inside <DataProvider>');
  return context;
}
