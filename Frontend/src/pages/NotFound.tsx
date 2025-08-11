import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Home, ArrowLeft, Search, MapPin, Plane, Compass } from 'lucide-react';

const NotFound: React.FC = () => {
  const suggestions = [
    {
      icon: <Home className="h-5 w-5" />,
      title: "Go Home",
      description: "Return to the homepage",
      action: () => window.location.href = '/',
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Explore Cities",
      description: "Discover amazing destinations",
      action: () => window.location.href = '/city-search',
      color: "from-secondary-500 to-secondary-600"
    },
    {
      icon: <Plane className="h-5 w-5" />,
      title: "Create Trip",
      description: "Start planning your adventure",
      action: () => window.location.href = '/create-trip',
      color: "from-accent-500 to-accent-600"
    }
  ];

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
      >
        {/* Left Side - 404 Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white space-y-8"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">GlobeTrotter</span>
              </Link>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-4">
                <Search className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-8xl font-bold mb-6 text-shadow-lg">
              404
            </h1>
            <h2 className="text-4xl font-bold mb-6 text-shadow">
              Oops! <span className="text-yellow-300">Page Not Found</span>
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Looks like you've wandered off the beaten path! Don't worry, even the best explorers get lost sometimes. Let's get you back on track to amazing adventures.
            </p>
          </div>

          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                onClick={suggestion.action}
                className="w-full flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-300 group"
              >
                <div className={`p-3 bg-gradient-to-r ${suggestion.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{suggestion.icon}</div>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white text-lg">{suggestion.title}</h3>
                  <p className="text-white/80">{suggestion.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Navigation Options */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md w-full"
        >
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Navigation
              </h3>
              <p className="text-gray-600">
                Choose where you'd like to go next
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/"
                className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 group shadow-lg hover:shadow-xl"
              >
                <Home className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold">Go to Homepage</span>
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 group shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold">Go Back</span>
              </button>

              <Link
                to="/city-search"
                className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 group shadow-lg hover:shadow-xl"
              >
                <Compass className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold">Explore Destinations</span>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Need help finding something?</p>
                <Link 
                  to="/" 
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                >
                  <Globe className="h-5 w-5" />
                  <span>Contact Support</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
