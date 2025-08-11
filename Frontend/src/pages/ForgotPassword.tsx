import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Mail, ArrowLeft, CheckCircle, Lock, Shield, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const { showToast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      showToast('success', 'Reset link sent!', 'Check your email for password reset instructions.');
    } catch (error) {
      showToast('error', 'Failed to send reset link', 'Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const securityFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Reset",
      description: "Your password reset link is encrypted and secure"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "24/7 Protection",
      description: "Your account is protected around the clock"
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen hero-gradient relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link to="/" className="flex justify-center items-center space-x-3 mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">GlobeTrotter</span>
              </Link>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-success-500 to-success-600 p-4 rounded-full">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Check your email
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                We've sent a password reset link to <strong className="text-primary-600">{email}</strong>. Please check your email and follow the instructions to reset your password.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-primary-600">💡 Tip:</span> Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full btn-primary py-3"
                >
                  Try again
                </button>
                
                <Link
                  to="/login"
                  className="block w-full text-center text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
        {/* Left Side - Security Info */}
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl font-bold mb-6 text-shadow-lg">
              Reset Your <span className="text-yellow-300">Password</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Don't worry! It happens to the best of us. Enter your email and we'll send you a secure link to reset your password.
            </p>
          </div>

          <div className="space-y-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-md rounded-xl"
              >
                <div className="p-3 bg-white/20 rounded-lg">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Reset Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-shadow">
              Forgot Password?
            </h2>
            <p className="text-white/80">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20"
            onSubmit={handleSubmit}
          >
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
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  className={`block w-full pl-12 pr-4 py-4 border-2 ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white/80 backdrop-blur-sm`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center"
                >
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.email}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </motion.button>

            <div className="text-center">
              <Link
                to="/login"
                className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Link>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
