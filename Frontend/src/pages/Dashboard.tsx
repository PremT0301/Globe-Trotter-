import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Users, TrendingUp, Clock, Star } from 'lucide-react';
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
      collaborators: 3
    },
    {
      id: '2',
      title: 'Tokyo Explorer',
      destination: 'Tokyo, Japan',
      dates: 'Mar 10 - Mar 20, 2024',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'completed',
      collaborators: 1
    },
    {
      id: '3',
      title: 'Bali Retreat',
      destination: 'Bali, Indonesia',
      dates: 'Aug 5 - Aug 15, 2024',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      status: 'planning',
      collaborators: 2
    }
  ];

  const popularDestinations = [
    {
      name: 'Santorini, Greece',
      image: 'https://images.pexels.com/photos/161901/santorini-greece-island-161901.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      rating: 4.9,
      trips: 1234
    },
    {
      name: 'Kyoto, Japan',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      rating: 4.8,
      trips: 987
    },
    {
      name: 'Machu Picchu, Peru',
      image: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      rating: 4.9,
      trips: 756
    },
    {
      name: 'Iceland',
      image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      rating: 4.7,
      trips: 654
    }
  ];

  const stats = [
    { label: 'Total Trips', value: '12', icon: <MapPin className="h-6 w-6" />, color: 'bg-blue-500' },
    { label: 'Countries Visited', value: '8', icon: <TrendingUp className="h-6 w-6" />, color: 'bg-green-500' },
    { label: 'Upcoming Trips', value: '3', icon: <Calendar className="h-6 w-6" />, color: 'bg-purple-500' },
    { label: 'Travel Days', value: '89', icon: <Clock className="h-6 w-6" />, color: 'bg-orange-500' }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! ✈️
          </h1>
          <p className="text-gray-600 mt-2">Ready for your next adventure?</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Trips */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
              <Link
                to="/create-trip"
                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Trip
              </Link>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {recentTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex">
                    <div className="w-32 h-24 flex-shrink-0">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{trip.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{trip.destination}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {trip.dates}
                            <Users className="h-4 w-4 ml-4 mr-1" />
                            {trip.collaborators} people
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-6 text-center">
              <Link
                to="/my-trips"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all trips →
              </Link>
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Destinations</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {popularDestinations.map((destination, index) => (
                <motion.div
                  key={destination.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs font-medium">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{destination.name}</h3>
                    <p className="text-gray-500 text-xs">{destination.trips} trips planned</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-6 text-center">
              <Link
                to="/city-search"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Explore more destinations →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;