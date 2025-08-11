import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Navbar from './components/Navbar';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';

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
              <Route path="/profile" element={<><Navbar /><UserProfile /></>} />
              <Route path="/admin" element={<><Navbar/><AdminDashboard /></>} />
              <Route path="/itinerary-builder" element={<><Navbar /><ItineraryBuilder /></>} />
              <Route path="/itinerary-view" element={<><Navbar /><ItineraryView /></>} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router >
    </AuthProvider>
  );
}

export default App;