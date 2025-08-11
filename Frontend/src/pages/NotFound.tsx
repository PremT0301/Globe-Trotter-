import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-3 rounded-full">
              <Search className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Page not found
          </h2>
          
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link to="/" className="flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <Globe className="h-6 w-6" />
              <span className="text-lg font-semibold">GlobeTrotter</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
