import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import MyTrips from './pages/MyTrips';
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
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/trip-budget" element={<TripBudget />} />
              <Route path="/trip-calendar" element={<TripCalendar />} />
              <Route path="/city-search" element={<CitySearch />} />
              <Route path="/activity-search" element={<ActivitySearch />} />
              <Route path="/create-trip" element={<CreateTrip />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;