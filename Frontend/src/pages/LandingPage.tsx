import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, MapPin, Users, Star, ArrowRight, Plane, Compass, Heart, Zap, Sparkles, Rocket, Target } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Plane className="h-8 w-8" />,
      title: "Smart Trip Planning",
      description: "AI-powered suggestions for perfect itineraries",
      color: "from-bright-blue to-bright-indigo",
      image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Collaborative Travel",
      description: "Plan trips with friends and family",
      color: "from-bright-pink to-bright-purple",
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Community",
      description: "Connect with travelers worldwide",
      color: "from-bright-green to-bright-teal",
      image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1"
    }
  ];

  const destinations = [
    {
      name: "Paris, France",
      image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      rating: 4.9,
      trips: 1250,
      color: "from-bright-blue to-bright-indigo"
    },
    {
      name: "Tokyo, Japan",
      image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      rating: 4.8,
      trips: 980,
      color: "from-bright-pink to-bright-purple"
    },
    {
      name: "Bali, Indonesia",
      image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      rating: 4.7,
      trips: 750,
      color: "from-bright-green to-bright-teal"
    },
    {
      name: "New York, USA",
      image: "https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      rating: 4.6,
      trips: 1100,
      color: "from-bright-orange to-bright-amber"
    }
  ];

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
    { number: "50K+", label: "Happy Travelers", icon: <Users className="h-6 w-6" />, color: "from-bright-blue to-bright-indigo" },
    { number: "100+", label: "Countries", icon: <Globe className="h-6 w-6" />, color: "from-bright-green to-bright-teal" },
    { number: "10K+", label: "Trips Planned", icon: <Plane className="h-6 w-6" />, color: "from-bright-pink to-bright-purple" },
    { number: "4.9", label: "User Rating", icon: <Star className="h-6 w-6" />, color: "from-bright-orange to-bright-amber" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bright-blue via-bright-purple to-bright-pink overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-bright-yellow/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-bright-green/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-bright-orange/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-bright-cyan/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/10 backdrop-blur-md shadow-3d border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-3 bg-gradient-to-r from-bright-blue to-bright-purple rounded-2xl shadow-3d group-hover:shadow-3d-lg transform group-hover:scale-110 transition-all duration-300">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">GlobeTrotter</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/city-search" className="nav-link-3d text-white font-medium">Explore</Link>
              <Link to="/activity-search" className="nav-link-3d text-white font-medium">Activities</Link>
              <Link to="/my-trips" className="nav-link-3d text-white font-medium">My Trips</Link>
              <Link to="/login" className="nav-link-3d text-white font-medium">Login</Link>
              <Link to="/signup" className="btn-neon">Get Started</Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-bright-blue to-bright-purple rounded-3xl shadow-3d-lg mb-6 floating-3d">
              <Rocket className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 text-shadow-lg">
              Your Next
              <span className="block gradient-text-2">Adventure</span>
              <span className="block gradient-text-3">Awaits</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Plan, explore, and share unforgettable travel experiences with our AI-powered platform
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup" className="btn-neon text-lg px-8 py-4">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Planning Now
            </Link>
            <Link to="/city-search" className="glass text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300">
              Explore Destinations
              <ArrowRight className="h-5 w-5 ml-2 inline" />
            </Link>
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
            className="responsive-grid"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-3d text-center p-8"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 shadow-3d`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold gradient-text mb-6">Why Choose GlobeTrotter?</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experience the future of travel planning with our cutting-edge features
            </p>
          </motion.div>

          <div className="responsive-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-3d overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className={`absolute top-4 right-4 p-3 bg-gradient-to-r ${feature.color} rounded-2xl shadow-3d`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
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
            <h2 className="text-5xl font-bold gradient-text mb-6">Popular Destinations</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover the most loved destinations by our community
            </p>
          </motion.div>

          <div className="responsive-grid">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-3d overflow-hidden group cursor-pointer"
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
                        <Star className="h-5 w-5 text-bright-yellow fill-current mr-1" />
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold gradient-text mb-6">What Our Travelers Say</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands of satisfied travelers who've discovered the world with us
            </p>
          </motion.div>

          <div className="responsive-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-3d p-8"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full ring-4 ring-bright-blue/20 mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-bright-yellow fill-current" />
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
            className="card-3d p-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-bright-green to-bright-teal rounded-3xl shadow-3d-lg mb-6 floating-3d">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of travelers and start planning your next adventure today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-neon text-lg px-8 py-4">
                <Sparkles className="h-5 w-5 mr-2" />
                Get Started Free
              </Link>
              <Link to="/city-search" className="btn-secondary text-lg px-8 py-4">
                Explore Destinations
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-bright-blue to-bright-purple rounded-xl">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">GlobeTrotter</span>
              </div>
              <p className="text-white/70 mb-4">
                Your ultimate travel companion for planning unforgettable adventures around the world.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link to="/city-search" className="text-white/70 hover:text-white transition-colors">Destinations</Link></li>
                <li><Link to="/activity-search" className="text-white/70 hover:text-white transition-colors">Activities</Link></li>
                <li><Link to="/my-trips" className="text-white/70 hover:text-white transition-colors">My Trips</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/50">&copy; 2024 GlobeTrotter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;