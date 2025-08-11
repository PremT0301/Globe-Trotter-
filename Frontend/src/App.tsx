import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
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
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-bright-blue via-bright-purple to-bright-pink">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <><Navbar /><Dashboard /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/create-trip" element={
                    <ProtectedRoute>
                      <><Navbar /><CreateTrip /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/my-trips" element={
                    <ProtectedRoute>
                      <><Navbar /><MyTrips /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/itinerary-builder/:tripId" element={
                    <ProtectedRoute>
                      <><Navbar /><ItineraryBuilder /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/itinerary/:tripId" element={
                    <ProtectedRoute>
                      <><Navbar /><ItineraryView /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/city-search" element={
                    <ProtectedRoute>
                      <><Navbar /><CitySearch /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/activity-search" element={
                    <ProtectedRoute>
                      <><Navbar /><ActivitySearch /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/trip-budget/:tripId" element={
                    <ProtectedRoute>
                      <><Navbar /><TripBudget /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/trip-calendar/:tripId" element={
                    <ProtectedRoute>
                      <><Navbar /><TripCalendar /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/shared/:tripId" element={<SharedItinerary />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <><Navbar /><UserProfile /></>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                      <><Navbar /><AdminDashboard /></>
                    </ProtectedRoute>
                  } />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;