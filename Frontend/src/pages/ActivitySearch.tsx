import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Clock, Users, DollarSign, Heart, Plus, Zap, Globe, Mountain, Palette, Wine, Moon, ArrowRight, Target, Sparkles } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
  groupSize: string;
  image: string;
  description: string;
  highlights: string[];
  website: string;
}

const ActivitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [duration, setDuration] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Activities', icon: <Zap className="h-5 w-5" />, color: 'from-blue-500 to-indigo-500' },
    { id: 'outdoor', name: 'Outdoor', icon: <Mountain className="h-5 w-5" />, color: 'from-green-500 to-teal-500' },
    { id: 'cultural', name: 'Cultural', icon: <Globe className="h-5 w-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'adventure', name: 'Adventure', icon: <Zap className="h-5 w-5" />, color: 'from-orange-500 to-amber-500' },
    { id: 'food', name: 'Food & Drink', icon: <Wine className="h-5 w-5" />, color: 'from-red-500 to-pink-500' },
    { id: 'wellness', name: 'Wellness', icon: <Heart className="h-5 w-5" />, color: 'from-indigo-500 to-purple-500' },
    { id: 'nightlife', name: 'Nightlife', icon: <Moon className="h-5 w-5" />, color: 'from-pink-500 to-rose-500' }
  ];

  const popularActivities = [
    {
      name: 'Seine River Cruise',
      image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      price: '€35',
      rating: 4.8,
      category: 'Cultural'
    },
    {
      name: 'Louvre Museum Tour',
      image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      price: '€65',
      rating: 4.7,
      category: 'Cultural'
    },
    {
      name: 'Food Walking Tour',
      image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      price: '€85',
      rating: 4.9,
      category: 'Food'
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      name: 'Seine River Evening Cruise',
      category: 'cultural',
      rating: 4.8,
      reviews: 2340,
      price: 35,
      duration: '2 hours',
      groupSize: '2-50 people',
      image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Romantic evening cruise along the Seine with dinner and live music',
      highlights: ['Dinner included', 'Live music', 'City views', 'Professional guide'],
      website: 'https://www.viator.com/Paris-attractions/Seine-River-Cruise/d479-a2202'
    },
    {
      id: '2',
      name: 'Louvre Skip-the-Line Tour',
      category: 'cultural',
      rating: 4.7,
      reviews: 5670,
      price: 65,
      duration: '3 hours',
      groupSize: '1-15 people',
      image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Expert-guided tour of the world\'s most famous art museum',
      highlights: ['Skip the line', 'Expert guide', 'Small group', 'Mona Lisa viewing'],
      website: 'https://www.getyourguide.com/paris-l16/louvre-museum-skip-the-line-guided-tour-t145961/'
    },
    {
      id: '3',
      name: 'Paris Food Walking Tour',
      category: 'food',
      rating: 4.9,
      reviews: 1890,
      price: 85,
      duration: '4 hours',
      groupSize: '6-12 people',
      image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Taste authentic French cuisine at hidden local gems',
      highlights: ['Local tastings', 'Hidden gems', 'Wine included', 'Small group'],
      website: 'https://www.airbnb.com/experiences/paris-food-tours'
    },
    {
      id: '4',
      name: 'Eiffel Tower Climbing Experience',
      category: 'adventure',
      rating: 4.6,
      reviews: 3450,
      price: 45,
      duration: '2.5 hours',
      groupSize: '1-20 people',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Climb the iconic Eiffel Tower and enjoy breathtaking views',
      highlights: ['Panoramic views', 'Photo opportunities', 'Historical insights', 'Skip the line'],
      website: 'https://www.toureiffel.paris/en/rates-opening-times'
    },
    {
      id: '5',
      name: 'Montmartre Art Workshop',
      category: 'cultural',
      rating: 4.5,
      reviews: 890,
      price: 55,
      duration: '3 hours',
      groupSize: '4-8 people',
      image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Create your own artwork in the artistic heart of Paris',
      highlights: ['Art supplies included', 'Professional artist', 'Take home artwork', 'Scenic location'],
      website: 'https://www.airbnb.com/experiences/paris-art-workshops'
    },
    {
      id: '6',
      name: 'Parisian Spa & Wellness Day',
      category: 'wellness',
      rating: 4.8,
      reviews: 1230,
      price: 120,
      duration: '4 hours',
      groupSize: '1-4 people',
      image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Relaxing spa experience with traditional French treatments',
      highlights: ['Massage therapy', 'Facial treatment', 'Sauna access', 'Refreshments included'],
      website: 'https://www.booking.com/wellness/paris-spas'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'budget' && activity.price <= 50) ||
                        (priceRange === 'mid' && activity.price > 50 && activity.price <= 100) ||
                        (priceRange === 'luxury' && activity.price > 100);
    const matchesDuration = duration === 'all' ||
                           (duration === 'short' && activity.duration.includes('1') || activity.duration.includes('2')) ||
                           (duration === 'medium' && activity.duration.includes('3') || activity.duration.includes('4')) ||
                           (duration === 'long' && activity.duration.includes('5') || activity.duration.includes('6'));
    return matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleBookNow = (website: string) => {
    // Check if website URL is valid
    if (website && website.startsWith('http')) {
      // Show a confirmation dialog before opening external link
      const confirmed = window.confirm(
        'You are about to visit an external booking website. Do you want to continue?\n\nNote: You will be redirected to a third-party booking platform.'
      );
      if (confirmed) {
        window.open(website, '_blank', 'noopener,noreferrer');
      }
    } else {
      // If no valid website, show a more informative message
      showToast('info', 'Booking Information', 'This activity is available for booking. Please contact the activity provider directly or check back later for online booking options.');
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Activities</h1>
          <p className="text-gray-600">Find amazing experiences and adventures around the world</p>
        </motion.div>

        {/* Popular Activities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-gray-900 font-bold text-lg mb-1">{activity.name}</h3>
                  <p className="text-gray-700 text-sm mb-2">{activity.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-gray-900 text-sm">{activity.rating}</span>
                    </div>
                    <span className="text-gray-900 font-bold">{activity.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/90 rounded-3xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="mr-2">{category.icon}</div>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
            >
              <option value="all">All Prices</option>
              <option value="budget">Budget (€0-50)</option>
              <option value="mid">Mid-Range (€50-100)</option>
              <option value="luxury">Luxury (€100+)</option>
            </select>
            
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
            >
              <option value="all">All Durations</option>
              <option value="short">Short (1-2 hours)</option>
              <option value="medium">Medium (3-4 hours)</option>
              <option value="long">Long (5+ hours)</option>
            </select>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Activities</h2>
            <div className="flex items-center">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 4px 12px rgba(59, 130, 246, 0.2)",
                    "0 8px 20px rgba(147, 51, 234, 0.3)",
                    "0 4px 12px rgba(59, 130, 246, 0.2)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
              </motion.div>
              <span className="text-gray-600">{filteredActivities.length} results</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="bg-white/90 rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="relative h-48">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
                  <motion.button
                    onClick={() => toggleFavorite(activity.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        favorites.includes(activity.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </motion.button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-gray-900 font-bold text-lg mb-1">{activity.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-gray-900 text-sm mr-2">{activity.rating}</span>
                      <span className="text-gray-700 text-sm">({activity.reviews.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {activity.groupSize}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-lg font-bold text-gray-900 mb-2">€{activity.price}</div>
                    <div className="flex flex-wrap gap-1">
                      {activity.highlights.slice(0, 2).map((highlight, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <motion.button
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleBookNow(activity.website)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        boxShadow: [
                          "0 4px 12px rgba(59, 130, 246, 0.3)",
                          "0 8px 20px rgba(147, 51, 234, 0.4)",
                          "0 4px 12px rgba(59, 130, 246, 0.3)"
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
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <motion.div 
                className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6"
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
                <Zap className="h-12 w-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ActivitySearch;