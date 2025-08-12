import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Users, Star, ArrowRight, Plane, Compass, Heart, Zap, Sparkles, Rocket, Target, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

interface City {
  id: number;
  name: string;
  country: string;
  image?: string;
  popularityScore?: number;
}

const LandingPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const data = await api.get<City[]>('/api/cities');
      setCities(data);
    } catch (e) {
      console.error('Failed to fetch cities:', e);
    }
  };

  const features = [
    {
      icon: <Plane className="h-8 w-8" />,
      title: "Smart Trip Planning",
      description: "AI-powered suggestions for perfect itineraries",
      color: "from-blue-500 to-indigo-500",
      image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Collaborative Travel",
      description: "Plan trips with friends and family",
      color: "from-purple-500 to-pink-500",
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Community",
      description: "Connect with travelers worldwide",
      color: "from-green-500 to-teal-500",
      image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1"
    }
  ];

  // Destinations based on backend data (top 4)
  const destinations = cities
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, 4)
    .map((city, index) => ({
      name: `${city.name}, ${city.country}`,
      image: city.image || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      rating: 4.5 + Math.random() * 0.5,
      trips: Math.floor(Math.random() * 1000) + 500,
      color: ["from-blue-500 to-indigo-500", "from-purple-500 to-pink-500", "from-green-500 to-teal-500", "from-orange-500 to-amber-500"][index % 4]
    }));

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Travel Blogger",
      content: "GlobeTrotter made planning my European adventure so easy! The AI suggestions were spot-on.",
      rating: 5,
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    {
      name: "Mike Chen",
      role: "Adventure Seeker",
      content: "The collaborative features are amazing! Planning with friends has never been this fun.",
      rating: 5,
      image: "https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    },
    {
      name: "Emma Davis",
      role: "Digital Nomad",
      content: "Perfect for solo travelers! The community features helped me meet amazing people.",
      rating: 5,
      image: "https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Travelers", icon: <Users className="h-6 w-6" />, color: "from-blue-500 to-indigo-500" },
    { number: "100+", label: "Countries", icon: <Globe className="h-6 w-6" />, color: "from-green-500 to-teal-500" },
    { number: "10K+", label: "Trips Planned", icon: <Plane className="h-6 w-6" />, color: "from-purple-500 to-pink-500" },
    { number: "4.9", label: "User Rating", icon: <Star className="h-6 w-6" />, color: "from-orange-500 to-amber-500" }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="relative z-50 bg-white/90 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg group-hover:shadow-xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  boxShadow: [
                    "0 10px 25px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px rgba(59, 130, 246, 0.3)"
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
                className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                GlobeTrotter
              </motion.span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/city-search" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Explore</Link>
              <Link to="/activity-search" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Activities</Link>
              <Link to="/my-trips" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">My Trips</Link>
              <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">Login</Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg">
                  Get Started
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <motion.button 
              className="md:hidden p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl shadow-xl mb-6"
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
              <Rocket className="h-12 w-12 text-white" />
            </motion.div>
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Your Next
              <motion.span 
                className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
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
              <motion.span 
                className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                Awaits
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Plan, explore, and share unforgettable travel experiences with our AI-powered platform
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg text-lg inline-flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Planning Now
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/city-search" className="bg-white/90 text-gray-700 font-semibold px-8 py-4 rounded-2xl hover:bg-white transition-all duration-300 border border-gray-200 inline-flex items-center">
                Explore Destinations
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/90 rounded-3xl shadow-lg border border-white/20 p-8 text-center hover:shadow-xl transition-all duration-300 group"
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <motion.div 
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-white">{stat.icon}</div>
                </motion.div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose GlobeTrotter?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of travel planning with our cutting-edge features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/90 rounded-3xl shadow-lg border border-white/20 overflow-hidden group hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <motion.div 
                    className={`absolute top-4 right-4 p-3 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </motion.div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Popular Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most loved destinations by our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/90 rounded-3xl shadow-lg border border-white/20 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                        <span className="text-white font-semibold">{destination.rating}</span>
                      </div>
                      <span className="text-white/80 text-sm">{destination.trips} trips</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">What Our Travelers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied travelers who've discovered the world with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/90 rounded-3xl shadow-lg border border-white/20 p-8 group hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="flex items-center mb-6">
                  <motion.img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full ring-4 ring-blue-200 mr-4 group-hover:ring-blue-300 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/90 rounded-3xl shadow-xl border border-white/20 p-12 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100/60 to-teal-100/60 rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-100/60 to-green-100/60 rounded-full translate-y-16 -translate-x-16" />
            
            <div className="relative z-10">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl shadow-lg mb-6"
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
                <Target className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join our community of travelers and start planning your next adventure today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/signup" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg text-lg inline-flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/city-search" className="bg-white text-gray-700 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 text-lg inline-flex items-center">
                    Explore Destinations
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/90 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <motion.div 
                  className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Globe className="h-6 w-6 text-white" />
                </motion.div>
                <span className="text-xl font-bold text-white">GlobeTrotter</span>
              </div>
              <p className="text-gray-300 mb-4">
                Your ultimate travel companion for planning unforgettable adventures around the world.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link to="/city-search" className="text-gray-300 hover:text-white transition-colors">Destinations</Link></li>
                <li><Link to="/activity-search" className="text-gray-300 hover:text-white transition-colors">Activities</Link></li>
                <li><Link to="/my-trips" className="text-gray-300 hover:text-white transition-colors">My Trips</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 GlobeTrotter. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default LandingPage;