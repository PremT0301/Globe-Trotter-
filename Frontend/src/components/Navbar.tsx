import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, Globe, Plane, Heart, Zap, Sparkles, Camera, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfilePhotoUpload from './ProfilePhotoUpload';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

  // Debug logging for navbar
  console.log('🔍 Navbar Debug:', {
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    hasUser: !!user,
    userRole: user?.role,
    isAdmin: user?.role === 'admin'
  });

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Globe className="h-5 w-5" /> },
    { name: 'My Trips', path: '/my-trips', icon: <Plane className="h-5 w-5" /> },
    { name: 'Explore', path: '/explore', icon: <Heart className="h-5 w-5" /> },
    { name: 'Activities', path: '/activity-search', icon: <Zap className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-3d-lg sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="p-3 bg-gradient-to-r from-bright-blue to-bright-purple rounded-2xl shadow-3d group-hover:shadow-3d-lg transform group-hover:scale-110 transition-all duration-300"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Globe className="h-8 w-8 text-white" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">GlobeTrotter</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link-3d flex items-center space-x-2 px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-bright-blue to-bright-purple text-white shadow-3d-lg transform scale-105'
                    : 'text-gray-700 hover:text-bright-blue hover:bg-white/50'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {item.icon}
                </motion.div>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-2xl bg-gradient-to-r from-bright-green to-bright-teal text-white shadow-3d hover:shadow-3d-lg transform hover:scale-105 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <motion.div
                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-3xl shadow-3d-lg border border-white/20 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-bright-blue/10 to-bright-purple/10 rounded-2xl">
                          <div className="w-10 h-10 bg-gradient-to-r from-bright-blue to-bright-purple rounded-full flex items-center justify-center overflow-hidden">
                            {user.profilePhoto ? (
                              <img
                                src={user.profilePhoto}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setIsPhotoUploadOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 p-3 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-bright-blue/10 hover:to-bright-purple/10 transition-all duration-300 group w-full"
                          >
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Camera className="h-5 w-5 group-hover:text-bright-blue" />
                            </motion.div>
                            <span className="font-medium">Update Photo</span>
                          </button>
                          
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 p-3 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-bright-blue/10 hover:to-bright-purple/10 transition-all duration-300 group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <User className="h-5 w-5 group-hover:text-bright-blue" />
                            </motion.div>
                            <span className="font-medium">Profile</span>
                          </Link>
                          
                          <Link
                            to="/settings"
                            className="flex items-center space-x-3 p-3 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-bright-green/10 hover:to-bright-teal/10 transition-all duration-300 group"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Settings className="h-5 w-5 group-hover:text-bright-green" />
                            </motion.div>
                            <span className="font-medium">Settings</span>
                          </Link>
                          
                          {(() => {
                            console.log('🔍 Admin Link Check:', {
                              userRole: user?.role,
                              condition: user?.role === 'admin',
                              willShow: user?.role === 'admin'
                            });
                            return user?.role === 'admin';
                          })() && (
                            <Link
                              to="/admin"
                              className="flex items-center space-x-3 p-3 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-purple-600/10 transition-all duration-300 group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                              >
                                <Shield className="h-5 w-5 group-hover:text-purple-600" />
                              </motion.div>
                              <span className="font-medium">Admin Panel</span>
                            </Link>
                          )}
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 p-3 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-bright-red/10 hover:to-bright-orange/10 transition-all duration-300 group w-full"
                          >
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <LogOut className="h-5 w-5 group-hover:text-bright-red" />
                            </motion.div>
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="nav-link-3d text-gray-700 font-medium hover:text-bright-blue"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-neon flex items-center space-x-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 bg-gradient-to-r from-bright-blue to-bright-purple rounded-2xl shadow-3d hover:shadow-3d-lg transform hover:scale-105 transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </motion.div>
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
              className="md:hidden bg-white/95 backdrop-blur-md rounded-3xl shadow-3d-lg border border-white/20 mt-4 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 p-4 rounded-2xl font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-bright-blue to-bright-purple text-white shadow-3d-lg transform scale-105'
                        : 'text-gray-700 hover:text-bright-blue hover:bg-white/50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {user ? (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-bright-green/10 to-bright-teal/10 rounded-2xl mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-bright-green to-bright-teal rounded-full flex items-center justify-center overflow-hidden">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setIsPhotoUploadOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-bright-blue/10 hover:to-bright-purple/10 transition-all duration-300 w-full"
                      >
                        <Camera className="h-5 w-5" />
                        <span className="font-medium">Update Photo</span>
                      </button>
                      
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-bright-blue/10 hover:to-bright-purple/10 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-bright-green/10 hover:to-bright-teal/10 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-bright-red/10 hover:to-bright-orange/10 transition-all duration-300 w-full"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Link
                      to="/login"
                      className="block w-full text-center p-4 bg-gradient-to-r from-bright-blue/10 to-bright-purple/10 text-bright-blue font-medium rounded-2xl hover:from-bright-blue/20 hover:to-bright-purple/20 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-center p-4 btn-neon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Sparkles className="h-4 w-4 inline mr-2" />
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Photo Upload Modal */}
      <ProfilePhotoUpload
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
      />
    </nav>
  );
};

export default Navbar;