import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Clock, Users, DollarSign, Heart, Plus, Zap, Globe, Mountain, Palette, Wine, Moon, ArrowRight } from 'lucide-react';

const ActivitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [duration, setDuration] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Activities', icon: <Zap className="h-5 w-5" />, color: 'from-primary-500 to-primary-600' },
    { id: 'outdoor', name: 'Outdoor', icon: <Mountain className="h-5 w-5" />, color: 'from-secondary-500 to-secondary-600' },
    { id: 'cultural', name: 'Cultural', icon: <Globe className="h-5 w-5" />, color: 'from-accent-500 to-accent-600' },
    { id: 'adventure', name: 'Adventure', icon: <Zap className="h-5 w-5" />, color: 'from-success-500 to-success-600' },
    { id: 'food', name: 'Food & Drink', icon: <Wine className="h-5 w-5" />, color: 'from-primary-500 to-secondary-600' },
    { id: 'wellness', name: 'Wellness', icon: <Heart className="h-5 w-5" />, color: 'from-accent-500 to-success-600' },
    { id: 'nightlife', name: 'Nightlife', icon: <Moon className="h-5 w-5" />, color: 'from-secondary-500 to-accent-600' }
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

  const activities = [
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
      highlights: ['Dinner included', 'Live music', 'City views', 'Professional guide']
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
      highlights: ['Skip the line', 'Expert guide', 'Small group', 'Mona Lisa viewing']
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
      highlights: ['Local tastings', 'Hidden gems', 'Wine included', 'Small group']
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
      highlights: ['Panoramic views', 'Photo opportunities', 'Historical insights', 'Skip the line']
    },
    {
      id: '5',
      name: 'Montmartre Art Workshop',
      category: 'cultural',
      rating: 4.5,
      reviews: 890,
      price: 55,
      duration: '3 hours',
      groupSize: '4-10 people',
      image: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Create your own masterpiece in the artistic heart of Paris',
      highlights: ['Art supplies included', 'Professional artist', 'Take home artwork', 'Historic location']
    },
    {
      id: '6',
      name: 'Paris Bike Tour',
      category: 'outdoor',
      rating: 4.4,
      reviews: 2100,
      price: 40,
      duration: '3.5 hours',
      groupSize: '8-15 people',
      image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Explore Paris landmarks on a guided bicycle tour',
      highlights: ['Bike included', 'Multiple stops', 'Photo opportunities', 'Local guide']
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'low' && activity.price <= 50) ||
      (priceRange === 'medium' && activity.price > 50 && activity.price <= 100) ||
      (priceRange === 'high' && activity.price > 100);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Discover <span className="gradient-text">Activities</span>
              </h1>
              <p className="text-gray-600 mt-1">Find amazing experiences and adventures</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under €50</option>
                  <option value="medium">€50 - €100</option>
                  <option value="high">Over €100</option>
                </select>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Durations</option>
                  <option value="short">1-2 hours</option>
                  <option value="medium">3-4 hours</option>
                  <option value="long">5+ hours</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 group ${
                      selectedCategory === category.id
                        ? `border-primary-500 bg-gradient-to-r ${category.color} text-white shadow-lg`
                        : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`p-2 rounded-lg ${
                        selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {category.icon}
                      </div>
                      <span className="text-xs font-medium text-center">{category.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Activities Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  className="card overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(activity.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                        favorites.includes(activity.id)
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${favorites.includes(activity.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700">
                        {activity.category}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white/90 backdrop-blur-sm text-gray-900">
                        €{activity.price}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-700">{activity.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {activity.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {activity.groupSize}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {activity.highlights.slice(0, 3).map((highlight, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                          >
                            {highlight}
                          </span>
                        ))}
                        {activity.highlights.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{activity.highlights.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 group">
                      <span className="font-semibold">Book Now</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredActivities.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No activities found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Activities */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Activities</h3>
              <div className="space-y-4">
                {popularActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h4 className="text-white font-semibold text-sm">{activity.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-white/80 text-xs">{activity.category}</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs ml-1">{activity.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-white/80 text-xs">{activity.price}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Tips */}
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Activity Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Book popular activities in advance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Check weather conditions for outdoor activities
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Read recent reviews for current information
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Consider group size for better experience
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySearch;