import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, MapPin, Users, Clock, Heart, ExternalLink, Globe, Plane, Compass, Zap, Target, Sparkles, MessageCircle, Share2, User, ThumbsUp, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface SharedTrip {
  _id: string;
  tripId: {
    _id: string;
    title: string;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    travelers: number;
    tripType: string;
    imageUrl?: string;
  };
  publicUrl: string;
  shareDate: string;
}

const ExplorePage: React.FC = () => {
  const { showToast } = useToast();
  const [sharedTrips, setSharedTrips] = useState<SharedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalShared: 0,
    recentShares: 0
  });

  useEffect(() => {
    fetchSharedTrips();
    fetchStats();
  }, [currentPage, searchTerm]);

  const fetchSharedTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/shared/explore?page=${currentPage}&limit=12&search=${searchTerm}`);
      setSharedTrips(response.sharedTrips);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching shared trips:', error);
      showToast('error', 'Error', 'Failed to load shared trips');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/shared/stats');
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSharedTrips();
  };

  const copyShareLink = async (publicUrl: string) => {
    const shareUrl = `${window.location.origin}/shared/${publicUrl}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('success', 'Link Copied!', 'Share link copied to clipboard');
    } catch (error) {
      showToast('error', 'Error', 'Failed to copy link');
    }
  };

  const getTripTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cultural': return <Globe className="h-4 w-4" />;
      case 'adventure': return <Zap className="h-4 w-4" />;
      case 'relaxation': return <Heart className="h-4 w-4" />;
      case 'business': return <Target className="h-4 w-4" />;
      default: return <Plane className="h-4 w-4" />;
    }
  };

  const getTripTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'adventure': return 'bg-orange-100 text-orange-800';
      case 'relaxation': return 'bg-green-100 text-green-800';
      case 'business': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (loading && sharedTrips.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Shared Trips</h1>
          <p className="text-xl text-gray-600 mb-8">Discover amazing travel itineraries shared by our community</p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalShared}</div>
              <div className="text-sm text-gray-600">Trips Shared</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.recentShares}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search trips by destination, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Shared Trips Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <AnimatePresence>
            {sharedTrips.map((sharedTrip, index) => (
              <motion.div
                key={sharedTrip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Trip Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                  {sharedTrip.tripId.imageUrl ? (
                    <img
                      src={sharedTrip.tripId.imageUrl}
                      alt={sharedTrip.tripId.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Plane className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTripTypeColor(sharedTrip.tripId.tripType)}`}>
                      {getTripTypeIcon(sharedTrip.tripId.tripType)}
                      <span className="ml-1">{sharedTrip.tripId.tripType || 'General'}</span>
                    </span>
                  </div>
                </div>

                {/* Trip Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {sharedTrip.tripId.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {sharedTrip.tripId.destination}
                  </p>
                  
                  {sharedTrip.tripId.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {sharedTrip.tripId.description}
                    </p>
                  )}

                  {/* Trip Details */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {calculateDuration(sharedTrip.tripId.startDate, sharedTrip.tripId.endDate)} days
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {sharedTrip.tripId.travelers} travelers
                    </div>
                  </div>

                  {/* Share Date */}
                  <div className="text-xs text-gray-400 mb-4">
                    Shared {formatDate(sharedTrip.shareDate)}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/shared/${sharedTrip.publicUrl}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                    >
                      View Itinerary
                    </Link>
                    <button
                      onClick={() => copyShareLink(sharedTrip.publicUrl)}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Copy share link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {sharedTrips.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to share your travel experience!'}
            </p>
            {!searchTerm && (
              <Link
                to="/create-trip"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Trip
              </Link>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center space-x-2"
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
