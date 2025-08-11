import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import TripBudget from './pages/TripBudget';
import TripCalendar from './pages/TripCalendar';
import SharedItinerary from './pages/SharedItinerary';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

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
              <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
              <Route path="/create-trip" element={<><Navbar /><CreateTrip /></>} />
              <Route path="/my-trips" element={<><Navbar /><MyTrips /></>} />
              <Route path="/itinerary-builder/:tripId" element={<><Navbar /><ItineraryBuilder /></>} />
              <Route path="/itinerary/:tripId" element={<><Navbar /><ItineraryView /></>} />
              <Route path="/city-search" element={<><Navbar /><CitySearch /></>} />
              <Route path="/activity-search" element={<><Navbar /><ActivitySearch /></>} />
              <Route path="/trip-budget/:tripId" element={<><Navbar /><TripBudget /></>} />
              <Route path="/trip-calendar/:tripId" element={<><Navbar /><TripCalendar /></>} />
              <Route path="/shared/:tripId" element={<SharedItinerary />} />
              <Route path="/profile" element={<><Navbar /><UserProfile /></>} />
              <Route path="/admin" element={<><Navbar /><AdminDashboard /></>} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;