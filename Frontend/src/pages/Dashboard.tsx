import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Calendar, Users, TrendingUp, Clock, Star, Plane, Heart, Zap, Compass, Target, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface DashboardStats {
  totalTrips: number;
  countriesVisited: number;
  upcomingTrips: number;
  travelDays: number;
}

interface RecentTrip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  image: string;
  status: 'planning' | 'ongoing' | 'upcoming' | 'completed';
  collaborators: number;
  progress: number;
}

interface PopularDestination {
  name: string;
  image: string;
  rating: string;
  trips: number;
  price: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    countriesVisited: 0,
    upcomingTrips: 0,
    travelDays: 0
  });
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<PopularDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/dashboard') as any;
      const data = response.data;
      
      setStats(data.stats);
      setRecentTrips(data.recentTrips);
      setPopularDestinations(data.popularDestinations);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      label: 'Total Trips', 
      value: stats.totalTrips.toString(), 
      icon: <MapPin className="h-6 w-6" />, 
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Countries Visited', 
      value: stats.countriesVisited.toString(), 
      icon: <TrendingUp className="h-6 w-6" />, 
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      label: 'Upcoming Trips', 
      value: stats.upcomingTrips.toString(), 
      icon: <Calendar className="h-6 w-6" />, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      label: 'Travel Days', 
      value: '0', 
      icon: <Clock className="h-6 w-6" />, 
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Trip',
      description: 'Start planning your next adventure',
      icon: <Plus className="h-8 w-8" />,
      color: 'from-blue-500 to-indigo-500',
      link: '/create-trip'
    },
    {
      title: 'Explore Cities',
      description: 'Discover amazing destinations',
      icon: <Compass className="h-8 w-8" />,
      color: 'from-green-500 to-teal-500',
      link: '/city-search'
    },
    {
      title: 'Find Activities',
      description: 'Search for exciting experiences',
      icon: <Zap className="h-8 w-8" />,
      color: 'from-purple-500 to-pink-500',
      link: '/activity-search'
    }
  ];

  // Enhanced background particles with more variety
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 3,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 8,
    type: ['star', 'circle', 'square', 'triangle'][Math.floor(Math.random() * 4)],
    color: ['blue', 'purple', 'pink', 'indigo', 'green', 'orange'][Math.floor(Math.random() * 6)]
  }));

  // Floating icons
  const floatingIcons = [
    { icon: <Star className="h-4 w-4" />, color: "text-yellow-400", delay: 0 },
    { icon: <Heart className="h-4 w-4" />, color: "text-red-400", delay: 2 },
    { icon: <Zap className="h-4 w-4" />, color: "text-blue-400", delay: 4 },
    { icon: <Target className="h-4 w-4" />, color: "text-green-400", delay: 6 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.name || 'Traveler'}!</span>
          </h1>
          <p className="text-gray-600">Ready to plan your next adventure?</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white/90 rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <motion.div 
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-white">{stat.icon}</div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Link to={action.link} className="block">
                  <div className="bg-white/90 rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group">
                    <motion.div 
                      className={`p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4 w-fit`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="text-white">{action.icon}</div>
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Trips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
            <Link to="/my-trips" className="text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/90 rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                      trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{trip.title}</h3>
                    <p className="text-white/90 text-sm">{trip.destination}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {trip.dates}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {trip.collaborators}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900 font-medium">{trip.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${trip.progress}%` }}
                        transition={{ duration: 1, delay: 1 + index * 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/90 rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-32">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-sm font-semibold text-white">{destination.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-900">{destination.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{destination.trips} trips</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{destination.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;