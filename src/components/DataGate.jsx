import { useData } from '../context/DataContext.jsx';
import { LoadingState, ErrorState } from './StatusViews.jsx';

// Renders its children only once the trip data has loaded.
export default function DataGate({ children, loadingLabel }) {
  const { status, error, reload } = useData();
  if (status === 'loading') return <LoadingState label={loadingLabel} />;
  if (status === 'error') return <ErrorState message={error} onRetry={reload} />;
  return children;
}
