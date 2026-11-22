import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext.jsx';
import { PlanProvider } from './context/PlanContext.jsx';
import usePlanDetails from './hooks/usePlanDetails.js';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ExperiencesPage from './pages/ExperiencesPage.jsx';
import ExperienceDetailsPage from './pages/ExperienceDetailsPage.jsx';
import PlanPage from './pages/PlanPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import './styles/global.css';

function AppRoutes() {
  // Derived once here and passed down as props to the layout and listings.
  const { lines, issueCount } = usePlanDetails();
  const planIds = lines.map((line) => line.experienceId);

  return (
    <Routes>
      <Route element={<Layout planCount={lines.length} planIssues={issueCount} />}>
        <Route index element={<HomePage planIds={planIds} />} />
        <Route path="experiences" element={<ExperiencesPage planIds={planIds} />} />
        <Route path="experiences/:experienceId" element={<ExperienceDetailsPage />} />
        <Route path="plan" element={<PlanPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <PlanProvider>
          <AppRoutes />
        </PlanProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
