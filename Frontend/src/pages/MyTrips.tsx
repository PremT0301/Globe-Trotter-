import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, MapPin, Users, MoreVertical, Edit, Trash2, Share2, Plane, Heart, Globe, Zap, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

const MyTrips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/trips');
      // Map backend fields to frontend format
      const mapped = response.map((trip: any) => ({
        id: trip._id,
        title: trip.title,
        destination: trip.destination,
        dates: `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`,
        image: trip.coverPhoto || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        status: trip.status || 'planning',
        collaborators: 1, // Placeholder, update if you have collaborators
        budget: trip.budget || 0,
        description: trip.description || '',
        progress: 0 // Placeholder, update if you have progress logic
      }));
      setTrips(mapped);
    } catch (err: any) {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary-100 text-primary-700';
      case 'completed': return 'bg-success-100 text-success-700';
      case 'planning': return 'bg-accent-100 text-accent-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Plane className="h-4 w-4" />;
      case 'completed': return <Heart className="h-4 w-4" />;
      case 'planning': return <Globe className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: <Globe className="h-6 w-6" />, color: 'from-primary-500 to-primary-600' },
    { label: 'Upcoming', value: trips.filter(t => t.status === 'upcoming').length, icon: <Plane className="h-6 w-6" />, color: 'from-secondary-500 to-secondary-600' },
    { label: 'Completed', value: trips.filter(t => t.status === 'completed').length, icon: <Heart className="h-6 w-6" />, color: 'from-success-500 to-success-600' },
    { label: 'Planning', value: trips.filter(t => t.status === 'planning').length, icon: <Zap className="h-6 w-6" />, color: 'from-accent-500 to-accent-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                My <span className="gradient-text">Trips</span>
              </h1>
              <p className="text-gray-600 mt-1">Manage and track all your travel adventures</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              >
                <option value="all">All Trips</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="planning">Planning</option>
              </select>
              <Link
                to="/create-trip"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Trip
              </Link>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              variants={itemVariants}
              className="card overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                    {getStatusIcon(trip.status)}
                    <span className="ml-1 capitalize">{trip.status}</span>
                  </span>
                </div>

                {/* Collaborators */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <Users className="h-4 w-4 text-gray-600 mr-1" />
                    <span className="text-sm font-medium text-gray-700">{trip.collaborators}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{trip.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        trip.status === 'completed' ? 'bg-success-500' : 
                        trip.status === 'upcoming' ? 'bg-primary-500' : 'bg-accent-500'
                      }`}
                      style={{ width: `${trip.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {trip.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{trip.destination}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === trip.id ? null : trip.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                    
                    <AnimatePresence>
                      {showDropdown === trip.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10"
                        >
                          <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Edit className="h-4 w-4 mr-3" />
                            Edit Trip
                          </button>
                          <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Share2 className="h-4 w-4 mr-3" />
                            Share Trip
                          </button>
                          <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete Trip
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {trip.dates}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-primary-600">${trip.budget.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to={`/itinerary/${trip.id}`}
                  className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 group"
                >
                  <span className="font-semibold">View Details</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No trips found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start planning your first adventure!'
                }
              </p>
              <Link
                to="/create-trip"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Trip
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;