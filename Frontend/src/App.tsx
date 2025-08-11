import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TripBudget from './pages/TripBudget';
import TripCalendar from './pages/TripCalendar';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import CreateTrip from './pages/CreateTrip';






function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
              <Route path="/trip-budget" element={<TripBudget />} />
              <Route path="/trip-calendar" element={<TripCalendar />} />
              <Route path="/city-search" element={<CitySearch />} />
              <Route path="/activity-search" element={<ActivitySearch />} />
              <Route path="/create-trip" element={<CreateTrip />} />
                

            </Routes>
          </AnimatePresence>
        </div>
      </Router >
    </AuthProvider>
  );
}

export default App;