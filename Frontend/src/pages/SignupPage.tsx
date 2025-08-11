import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, Lock, User, Eye, EyeOff, Plane, ArrowRight, Heart, CheckCircle, Sparkles, Star, Zap, Target } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      showToast('success', 'Account created!', 'You can now login with your email and password, or use OTP login.');
      navigate('/login');
    } catch (error) {
      setErrors({ email: 'Failed to create account' });
      showToast('error', 'Signup failed', 'Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const benefits = [
    {
      icon: <CheckCircle className="h-5 w-5" />,
      text: "AI-powered suggestions for perfect itineraries"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      text: "Plan trips with friends and family"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      text: "Connect with travelers worldwide"
    }
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
    color: ['purple', 'pink', 'indigo', 'cyan', 'green', 'orange'][Math.floor(Math.random() * 6)]
  }));

  // Floating icons
  const floatingIcons = [
    { icon: <Star className="h-4 w-4" />, color: "text-yellow-400", delay: 0 },
    { icon: <Heart className="h-4 w-4" />, color: "text-red-400", delay: 2 },
    { icon: <Zap className="h-4 w-4" />, color: "text-blue-400", delay: 4 },
    { icon: <Target className="h-4 w-4" />, color: "text-green-400", delay: 6 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating gradient orbs with more complex animations */}
        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 80, -60, 0],
            scale: [1, 1.4, 0.7, 1],
            rotate: [0, 180, 360, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-36 h-36 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 100, -80, 0],
            y: [0, -60, 100, 0],
            scale: [1, 0.7, 1.5, 1],
            rotate: [0, -180, 360, 0],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-40 right-20 w-28 h-28 bg-gradient-to-r from-pink-400/40 to-rose-400/40 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -60, 90, 0],
            y: [0, 40, -80, 0],
            scale: [1, 1.5, 0.6, 1],
            rotate: [0, 90, 270, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
          className="absolute bottom-20 left-1/4 w-32 h-32 bg-gradient-to-r from-indigo-400/40 to-purple-400/40 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 80, -50, 0],
            y: [0, -100, 70, 0],
            scale: [1, 0.8, 1.6, 1],
            rotate: [0, -90, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-40 right-1/3 w-24 h-24 bg-gradient-to-r from-cyan-400/40 to-blue-400/40 rounded-full"
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
              y: [0, -200, 0],
              x: [0, Math.random() * 60 - 30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.8, 0],
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
            scale: [1, 1.3, 0.7, 1],
            x: [0, 25, -25, 0],
            y: [0, -25, 25, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 left-1/3 w-20 h-20 border-2 border-purple-300/40 rounded-lg"
        />
        <motion.div
          animate={{
            rotate: [360, 0, -360],
            scale: [1, 0.8, 1.4, 1],
            x: [0, -20, 20, 0],
            y: [0, 20, -20, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
            delay: 10
          }}
          className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-pink-300/40 rounded-full"
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
      >
        {/* Left Side - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-900 space-y-8"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <motion.div 
                  className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    boxShadow: [
                      "0 10px 25px rgba(147, 51, 234, 0.3)",
                      "0 20px 40px rgba(236, 72, 153, 0.4)",
                      "0 10px 25px rgba(147, 51, 234, 0.3)"
                    ]
                  }}
                  transition={{ 
                    duration: 0.6,
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <Globe className="h-8 w-8 text-white" />
                </motion.div>
                <motion.span 
                  className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  GlobeTrotter
                </motion.span>
              </Link>
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Join the <motion.span 
                className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Adventure
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Start your journey with thousands of travelers worldwide. Create unforgettable memories and discover amazing destinations.
            </motion.p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-3 group"
                whileHover={{ x: 10, scale: 1.02 }}
              >
                <motion.div 
                  className="p-1 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(34, 197, 94, 0.4)",
                      "0 0 20px rgba(34, 197, 94, 0.6)",
                      "0 0 0 rgba(34, 197, 94, 0.4)"
                    ]
                  }}
                  transition={{ 
                    duration: 0.3,
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <div className="text-green-600">{benefit.icon}</div>
                </motion.div>
                <motion.span 
                  className="text-gray-700 group-hover:text-gray-900 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  {benefit.text}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Enhanced floating sparkles */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 5, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20"
          >
            <Sparkles className="h-6 w-6 text-purple-400" />
          </motion.div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Create Your Account
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                Sign in here
              </Link>
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6 bg-white/90 p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden"
            onSubmit={handleSubmit}
          >
            {/* Form background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/50 to-rose-100/50 rounded-full translate-y-12 -translate-x-12" />
            
            <div className="relative z-10 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`block w-full pl-12 pr-4 py-4 border-2 ${
                      errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white/80`}
                    placeholder="Enter your full name"
                  />
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-12 pr-4 py-4 border-2 ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white/80`}
                    placeholder="Enter your email"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-12 pr-12 py-4 border-2 ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white/80`}
                    placeholder="Create a password"
                  />
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-12 pr-12 py-4 border-2 ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 bg-white/80`}
                    placeholder="Confirm your password"
                  />
                  <motion.button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl relative z-10 overflow-hidden"
              animate={{
                boxShadow: [
                  "0 10px 25px rgba(147, 51, 234, 0.3)",
                  "0 20px 40px rgba(236, 72, 153, 0.4)",
                  "0 10px 25px rgba(147, 51, 234, 0.3)"
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="relative flex items-center">
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    Create Account
                    <motion.div
                      animate={{
                        x: [0, 5, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.div>
                  </>
                )}
              </div>
            </motion.button>

            <motion.div 
              className="text-xs text-gray-500 text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 relative z-10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  "0 4px 12px rgba(147, 51, 234, 0.1)",
                  "0 8px 20px rgba(236, 72, 153, 0.2)",
                  "0 4px 12px rgba(147, 51, 234, 0.1)"
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              By creating an account, you agree to our{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">Privacy Policy</a>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;