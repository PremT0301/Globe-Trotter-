import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, Shield, BarChart3, Users, Plane, Activity, TrendingUp, Database, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Admin-specific navigation items
  const adminNavItems = [
    { name: 'Dashboard', path: '/admin', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'User Management', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Trip Analytics', path: '/admin/trips', icon: <Plane className="h-5 w-5" /> },
    { name: 'Activity Stats', path: '/admin/activities', icon: <Activity className="h-5 w-5" /> },
    { name: 'System Stats', path: '/admin/stats', icon: <TrendingUp className="h-5 w-5" /> },
    { name: 'Database', path: '/admin/database', icon: <Database className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-purple-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Admin Logo */}
          <Link to="/admin" className="flex items-center space-x-3 group">
            <div className="p-2 bg-purple-600 rounded-lg shadow-md">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">Admin Panel</span>
              <span className="text-sm text-purple-200">GlobeTrotter</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center space-x-4 flex-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-white hover:bg-purple-700/50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Admin User Menu */}
          <div className="hidden md:flex items-center">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-3 bg-purple-700 rounded-lg text-white shadow-md hover:bg-purple-600 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Admin</span>
                    <span className="text-xs opacity-90">User</span>
                  </div>
                  <span className="text-xs bg-purple-500 px-2 py-1 rounded-full">Admin</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Administrator</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-all duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">User Dashboard</span>
                          </Link>
                          
                          <Link
                            to="/settings"
                            className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-green-50 transition-all duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Settings</span>
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 transition-all duration-200 w-full"
                          >
                            <LogOut className="h-5 w-5 text-red-600" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 bg-purple-600 rounded-lg text-white"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white rounded-lg shadow-lg border border-gray-200 mt-2 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {user && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 p-3 bg-purple-600 rounded-lg mb-4 text-white">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Admin</span>
                        <span className="text-xs opacity-90">User</span>
                      </div>
                      <span className="text-xs bg-purple-500 px-2 py-1 rounded-full">Admin</span>
                    </div>
                    
                    <div className="space-y-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">User Dashboard</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-green-50 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 transition-all duration-200 w-full"
                      >
                        <LogOut className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default AdminNavbar;
