import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Users, TrendingUp, Clock, Star, Plane, Heart, Zap, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const recentTrips = [
    {
      id: '1',
      title: 'European Adventure',
      destination: 'Paris, Rome, Barcelona',
      dates: 'Jun 15 - Jun 30, 2024',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'upcoming',
      collaborators: 3,
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
      progress: 25
    }
  ];

  const popularDestinations = [
    {
      name: 'Santorini, Greece',
      image: 'https://images.pexels.com/photos/161901/santorini-greece-island-161901.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      rating: 4.9,
      trips: 1234,
      price: '$1,200'
    },
    {
      name: 'Kyoto, Japan',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      rating: 4.8,
      trips: 987,
      price: '$1,500'
    },
    {
      name: 'Machu Picchu, Peru',
      image: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      rating: 4.9,
      trips: 756,
      price: '$800'
    },
    {
      name: 'Iceland',
      image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      rating: 4.7,
      trips: 654,
      price: '$2,100'
    }
  ];

  const stats = [
    { 
      label: 'Total Trips', 
      value: '12', 
      icon: <MapPin className="h-6 w-6" />, 
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    },
    { 
      label: 'Countries Visited', 
      value: '8', 
      icon: <TrendingUp className="h-6 w-6" />, 
      color: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50',
      textColor: 'text-success-600'
    },
    { 
      label: 'Upcoming Trips', 
      value: '3', 
      icon: <Calendar className="h-6 w-6" />, 
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'bg-secondary-50',
      textColor: 'text-secondary-600'
    },
    { 
      label: 'Travel Days', 
      value: '89', 
      icon: <Clock className="h-6 w-6" />, 
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-50',
      textColor: 'text-accent-600'
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-bright-blue via-bright-purple to-bright-pink py-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-bright-yellow/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-bright-green/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-bright-orange/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-bright-cyan/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome back, <span className="gradient-text">{user?.name}</span>! ✈️
              </h1>
              <p className="text-gray-600 mt-1">Ready to plan your next adventure?</p>
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
              className={`card p-6 ${stat.bgColor} border-0`}
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/create-trip"
                className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-primary-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create New Trip</h3>
                  <p className="text-sm text-gray-600">Start planning your next adventure</p>
                </div>
              </Link>
              
              <Link
                to="/city-search"
                className="flex items-center p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl hover:from-secondary-100 hover:to-secondary-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-secondary-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Explore Cities</h3>
                  <p className="text-sm text-gray-600">Discover amazing destinations</p>
                </div>
              </Link>
              
              <Link
                to="/activity-search"
                className="flex items-center p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl hover:from-accent-100 hover:to-accent-200 transition-all duration-300 group"
              >
                <div className="p-2 bg-accent-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Find Activities</h3>
                  <p className="text-sm text-gray-600">Discover exciting things to do</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
                <Link to="/my-trips" className="text-primary-600 hover:text-primary-700 font-semibold">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/itinerary/${trip.id}`}>
                      <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                        <div className="relative">
                          <img
                            src={trip.image}
                            alt={trip.title}
                            className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                            <Users className="h-3 w-3 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {trip.title}
                          </h3>
                          <p className="text-sm text-gray-600">{trip.destination}</p>
                          <p className="text-xs text-gray-500">{trip.dates}</p>
                          <div className="flex items-center mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  trip.status === 'completed' ? 'bg-success-500' : 
                                  trip.status === 'upcoming' ? 'bg-primary-500' : 'bg-accent-500'
                                }`}
                                style={{ width: `${trip.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{trip.progress}%</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          trip.status === 'completed' ? 'bg-success-100 text-success-700' :
                          trip.status === 'upcoming' ? 'bg-primary-100 text-primary-700' :
                          'bg-accent-100 text-accent-700'
                        }`}>
                          {trip.status}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Popular Destinations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Popular Destinations</h2>
                <Link to="/city-search" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Explore More
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {popularDestinations.map((destination, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-sm mb-1">{destination.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs ml-1">{destination.rating}</span>
                          </div>
                          <span className="text-white text-xs font-medium">{destination.price}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Travel Inspiration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="card p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need Travel <span className="gradient-text">Inspiration</span>?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Discover trending destinations, get personalized recommendations, and find the perfect trip for your next adventure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/city-search" className="btn-primary">
                  Explore Destinations
                </Link>
                <Link to="/activity-search" className="btn-secondary">
                  Find Activities
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;