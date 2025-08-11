import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Mail, ArrowLeft, CheckCircle, Lock, Shield, ArrowRight, Eye, EyeOff, Sparkles, Zap, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading && !isSubmitted) {
        const form = document.querySelector('form');
        if (form) {
          form.requestSubmit();
        }
      }
      if (e.key === 'Escape' && isSubmitted) {
        handleTryAgain();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isLoading, isSubmitted]);

  const validateForm = () => {
    const newErrors: { email?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      showToast('success', 'Reset link sent!', 'Check your email for password reset instructions.');
    } catch (error) {
      showToast('error', 'Failed to send reset link', 'Please try again or contact support.');
      setErrors({ email: 'Failed to send reset link. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
    
    // Real-time validation for better UX
    if (value.trim() && !/\S+@\S+\.\S+/.test(value.trim())) {
      setErrors({ email: 'Please enter a valid email address' });
    } else if (value.trim() && /\S+@\S+\.\S+/.test(value.trim())) {
      setErrors({});
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail('');
    setErrors({});
    showToast('info', 'Ready to try again', 'Enter your email address to receive a new reset link.');
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      showToast('error', 'No email address', 'Please enter your email address first.');
      return;
    }
    
    setIsResending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast('success', 'Email resent!', 'A new password reset link has been sent to your email.');
    } catch (error) {
      showToast('error', 'Failed to resend email', 'Please try again or contact support.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const securityFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Bank-Level Security",
      description: "256-bit encryption protects your data",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "24/7 Protection",
      description: "Your account is monitored around the clock",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Delivery",
      description: "Reset links are sent immediately",
      color: "from-purple-500 to-purple-600"
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full space-y-8"
          >
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <Link to="/" className="flex justify-center items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    GlobeTrotter
                  </span>
                </Link>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg"
                >
                  <CheckCircle className="h-10 w-10 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full shadow-lg">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Check your email
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We've sent a password reset link to{' '}
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    {email}
                  </span>
                  . Please check your email and follow the instructions to reset your password.
                </p>
                
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
                  >
                    <div className="flex items-start space-x-3">
                      <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-blue-600">💡 Pro tip:</span> Didn't receive the email? 
                          Check your spam folder or try again with a different email address.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTryAgain}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                      aria-label="Try again with a different email"
                    >
                      Try again
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleResendEmail}
                      disabled={isResending}
                      className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-500/20"
                      aria-label="Resend password reset email"
                    >
                      {isResending ? (
                        <div className="flex items-center justify-center">
                          <LoadingSpinner size="sm" color="white" />
                          <span className="ml-2">Resending...</span>
                        </div>
                      ) : (
                        'Resend email'
                      )}
                    </motion.button>
                  </div>
                  
                  <Link
                    to="/login"
                    onClick={handleBackToLogin}
                    className="block w-full text-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg"
                    aria-label="Go back to login page"
                  >
                    ← Back to login
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Side - Security Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <Link to="/" className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    GlobeTrotter
                  </span>
                </Link>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg"
                >
                  <Lock className="h-10 w-10 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-5xl lg:text-6xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Reset Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Password
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Don't worry! It happens to the best of us. Enter your email and we'll send you a secure link to reset your password in just a few seconds.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="space-y-6"
            >
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Reset Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-md w-full mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Forgot Password?
              </h2>
              <p className="text-gray-600">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    className={`block w-full pl-12 pr-4 py-4 border-2 ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    } rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg`}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-red-600 flex items-center"
                    id="email-error"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {errors.email}
                  </motion.div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !email.trim()}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                aria-label="Send password reset link"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </motion.button>

              <div className="text-center pt-4">
                <Link
                  to="/login"
                  onClick={handleBackToLogin}
                  className="flex items-center justify-center text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg px-2 py-1"
                  aria-label="Go back to login page"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to login
                </Link>
              </div>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
