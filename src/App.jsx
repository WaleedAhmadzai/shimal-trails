import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext.jsx';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ExperiencesPage from './pages/ExperiencesPage.jsx';
import ExperienceDetailsPage from './pages/ExperienceDetailsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="experiences" element={<ExperiencesPage />} />
            <Route path="experiences/:experienceId" element={<ExperienceDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}
