import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, MapPin, Users, MoreVertical, Edit, Trash2, Share2, Plane, Heart, Globe, Zap, ArrowRight, Star, Target, Sparkles } from 'lucide-react';

const MyTrips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const trips = [
    {
      id: '1',
      title: 'European Adventure',
      destination: 'Paris, Rome, Barcelona',
      dates: 'Jun 15 - Jun 30, 2024',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'upcoming',
      collaborators: 3,
      budget: 3500,
      description: 'A wonderful journey through Europe\'s most beautiful cities.',
      progress: 75
    },
    {
      id: '2',
      title: 'Tokyo Explorer',
      destination: 'Tokyo, Japan',
      dates: 'Mar 10 - Mar 20, 2024',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'completed',
      collaborators: 1,
      budget: 2800,
      description: 'Exploring the vibrant culture and cuisine of Tokyo.',
      progress: 100
    },
    {
      id: '3',
      title: 'Bali Retreat',
      destination: 'Bali, Indonesia',
      dates: 'Aug 5 - Aug 15, 2024',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'planning',
      collaborators: 2,
      budget: 2200,
      description: 'A relaxing retreat in the tropical paradise of Bali.',
      progress: 25
    },
    {
      id: '4',
      title: 'New York City',
      destination: 'New York, USA',
      dates: 'Dec 20 - Dec 27, 2024',
      image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'upcoming',
      collaborators: 4,
      budget: 4000,
      description: 'Holiday season in the Big Apple with friends.',
      progress: 60
    },
    {
      id: '5',
      title: 'Safari Adventure',
      destination: 'Kenya & Tanzania',
      dates: 'Sep 10 - Sep 25, 2024',
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'planning',
      collaborators: 2,
      budget: 5500,
      description: 'Wildlife safari across East Africa.',
      progress: 15
    },
    {
      id: '6',
      title: 'Mediterranean Cruise',
      destination: 'Italy, Greece, Turkey',
      dates: 'May 1 - May 14, 2024',
      image: 'https://images.pexels.com/photos/161901/santorini-greece-island-161901.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'completed',
      collaborators: 6,
      budget: 3200,
      description: 'Luxury cruise through the Mediterranean.',
      progress: 100
    }
  ];

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'planning': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'completed': return <Plane className="h-4 w-4" />;
      case 'planning': return <Globe className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: <Plane className="h-6 w-6" />, color: 'from-blue-500 to-indigo-500' },
    { label: 'Upcoming', value: trips.filter(t => t.status === 'upcoming').length, icon: <Calendar className="h-6 w-6" />, color: 'from-purple-500 to-pink-500' },
    { label: 'Completed', value: trips.filter(t => t.status === 'completed').length, icon: <Heart className="h-6 w-6" />, color: 'from-green-500 to-teal-500' },
    { label: 'Planning', value: trips.filter(t => t.status === 'planning').length, icon: <Globe className="h-6 w-6" />, color: 'from-orange-500 to-amber-500' }
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
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating gradient orbs with more complex animations */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 80, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 60, -40, 0],
            scale: [1, 0.8, 1.3, 1],
            rotate: [0, -180, 360, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.3, 0.7, 1],
            rotate: [0, 90, 270, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
          className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -40, 70, 0],
            y: [0, 80, -30, 0],
            scale: [1, 0.9, 1.4, 1],
            rotate: [0, -90, 180, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-40 right-1/3 w-20 h-20 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full"
        />

        {/* Animated particles with different shapes */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${particle.color}-400/50`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 360, 720],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          >
            {particle.type === 'star' && <Star className="w-full h-full" />}
            {particle.type === 'circle' && <div className="w-full h-full rounded-full bg-current" />}
            {particle.type === 'square' && <div className="w-full h-full bg-current transform rotate-45" />}
            {particle.type === 'triangle' && <div className="w-full h-full bg-current clip-path-triangle" />}
          </motion.div>
        ))}

        {/* Geometric shapes with enhanced animations */}
        <motion.div
          animate={{
            rotate: [0, 360, 720],
            scale: [1, 1.2, 0.8, 1],
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-blue-300/30 rounded-lg"
        />
        <motion.div
          animate={{
            rotate: [360, 0, -360],
            scale: [1, 0.9, 1.3, 1],
            x: [0, -15, 15, 0],
            y: [0, 15, -15, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 8
          }}
          className="absolute bottom-1/4 right-1/4 w-12 h-12 border-2 border-purple-300/30 rounded-full"
        />

        {/* Floating icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.color}`}
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + index * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

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
                animate={{
                  boxShadow: [
                    "0 10px 25px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
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

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/90 rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'upcoming', 'completed', 'planning'].map((status) => (
                <motion.button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trips Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
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
                  <div className="text-lg font-bold text-gray-900">${trip.budget.toLocaleString()}</div>
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
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Trip
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Trip
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center">
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
          ))}
        </motion.div>

        {filteredTrips.length === 0 && (
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