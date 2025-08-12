import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, MapPin, Users, MoreVertical, Edit, Trash2, Share2, Plane, Heart, Globe, Zap, ArrowRight, Star, Target, Sparkles, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

const MyTrips: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/trips') as any[];
      // Map backend fields to frontend format and add status based on dates
      const mapped = response.map((trip: any) => {
        const today = new Date();
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        
        let status = trip.status || 'planning';
        
        // Auto-update status based on dates
        if (today >= startDate && today <= endDate) {
          status = 'ongoing';
        } else if (today > endDate) {
          status = 'completed';
        } else if (today < startDate) {
          status = 'upcoming';
        }
        
        return {
        id: trip._id,
        title: trip.title,
        destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
        dates: `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`,
        image: trip.imageUrl || trip.coverPhoto || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
          status: status,
          collaborators: 1,
        budget: trip.budget || 0,
        description: trip.description || '',
          progress: calculateProgress(trip.startDate, trip.endDate, status)
        };
      });
      setTrips(mapped);
    } catch (err: any) {
      setError('Failed to load trips');
      showToast('error', 'Failed to load trips', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (startDate: string, endDate: string, status: string) => {
    if (status === 'completed') return 100;
    if (status === 'planning') return 0;
    
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    return Math.round((elapsed / totalDuration) * 100);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleMarkAsCompleted = async (tripId: string) => {
    try {
      await api.put(`/api/trips/${tripId}`, { status: 'completed' });
      setTrips(prev => prev.map(trip => 
        trip.id === tripId ? { ...trip, status: 'completed', progress: 100 } : trip
      ));
      showToast('success', 'Trip marked as completed!', 'Your trip has been updated successfully.');
      setEditingTrip(null);
    } catch (error) {
      showToast('error', 'Failed to update trip', 'Please try again.');
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await api.delete(`/api/trips/${tripId}`);
        setTrips(prev => prev.filter(trip => trip.id !== tripId));
        showToast('success', 'Trip deleted!', 'Your trip has been removed successfully.');
      } catch (error) {
        showToast('error', 'Failed to delete trip', 'Please try again.');
      }
    }
  };

  const handleShareTrip = async (tripId: string) => {
    try {
      const response = await api.post(`/api/shared/${tripId}`) as any;
      const shareUrl = response.shareUrl;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      showToast('success', 'Trip Shared!', 'Share link copied to clipboard');
      
      // Refresh trips to show shared status
      fetchTrips();
    } catch (error) {
      console.error('Error sharing trip:', error);
      showToast('error', 'Error', 'Failed to share trip');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'planning': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing': return <Clock className="h-4 w-4" />;
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'planning': return <Globe className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const ongoingTrips = trips.filter(trip => trip.status === 'ongoing');
  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
  const completedTrips = trips.filter(trip => trip.status === 'completed');
  const planningTrips = trips.filter(trip => trip.status === 'planning');

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: <Plane className="h-6 w-6" />, color: 'from-blue-500 to-indigo-500' },
    { label: 'Ongoing', value: ongoingTrips.length, icon: <Clock className="h-6 w-6" />, color: 'from-green-500 to-emerald-500' },
    { label: 'Upcoming', value: upcomingTrips.length, icon: <Calendar className="h-6 w-6" />, color: 'from-purple-500 to-pink-500' },
    { label: 'Completed', value: completedTrips.length, icon: <CheckCircle className="h-6 w-6" />, color: 'from-gray-500 to-gray-600' }
  ];

  const TripCard = ({ trip, index }: { trip: any; index: number }) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/90 rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="relative h-48">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)} flex items-center`}>
                    {getStatusIcon(trip.status)}
                    <span className="ml-1">{trip.status}</span>
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{trip.title}</h3>
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
                
                <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                
                <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-gray-900">₹{trip.budget.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Budget</div>
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
                      transition={{ duration: 1, delay: 1 + index * 0.1 }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Link to={`/itinerary/${trip.id}`}>
                    <motion.button
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </motion.button>
                  </Link>
                  
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowDropdown(showDropdown === trip.id ? null : trip.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </motion.button>
                    
                    <AnimatePresence>
                      {showDropdown === trip.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10"
                        >
                  {trip.status !== 'completed' && (
                    <button 
                      onClick={() => handleMarkAsCompleted(trip.id)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </button>
                  )}
                  <Link to={`/edit-trip/${trip.id}`}>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Trip
                          </button>
                  </Link>
                  <button 
                    onClick={() => handleShareTrip(trip.id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Trip
                  </button>
                  <button 
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center"
                  >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Trip
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-gray-600">Manage and track your travel adventures</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-0"
          >
            <Link to="/create-trip">
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Trip
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
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

        {/* Timeline Sections - Organized as per wireframe */}
        <div className="space-y-8">
          {/* Ongoing Trips */}
          {ongoingTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Ongoing</h2>
                <div className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {ongoingTrips.length} trips
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingTrips.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Upcoming Trips */}
          {upcomingTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming</h2>
                <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {upcomingTrips.length} trips
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed Trips */}
          {completedTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Completed</h2>
                <div className="ml-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {completedTrips.length} trips
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTrips.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Planning Trips */}
          {planningTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Planning</h2>
                <div className="ml-4 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  {planningTrips.length} trips
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {planningTrips.map((trip, index) => (
                  <TripCard key={trip.id} trip={trip} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {trips.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <motion.div 
              className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Plane className="h-12 w-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or create a new trip</p>
            <Link to="/create-trip">
              <motion.button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Trip
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;