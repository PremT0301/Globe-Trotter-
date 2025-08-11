import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Clock, Users, DollarSign, Heart, Plus } from 'lucide-react';

const ActivitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [duration, setDuration] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Activities', icon: '🌟' },
    { id: 'outdoor', name: 'Outdoor', icon: '🏔️' },
    { id: 'cultural', name: 'Cultural', icon: '🎭' },
    { id: 'adventure', name: 'Adventure', icon: '🎢' },
    { id: 'food', name: 'Food & Drink', icon: '🍷' },
    { id: 'wellness', name: 'Wellness', icon: '🧘' },
    { id: 'nightlife', name: 'Nightlife', icon: '🌙' }
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
    },
    {
      id: '7',
      name: 'Spa Day at Le Bristol',
      category: 'wellness',
      rating: 4.8,
      reviews: 560,
      price: 180,
      duration: '4 hours',
      groupSize: '1-2 people',
      image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Luxury spa experience at one of Paris\' finest hotels',
      highlights: ['Luxury treatments', 'Pool access', 'Refreshments', 'Premium products']
    },
    {
      id: '8',
      name: 'Latin Quarter Pub Crawl',
      category: 'nightlife',
      rating: 4.3,
      reviews: 1670,
      price: 25,
      duration: '4 hours',
      groupSize: '10-30 people',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Experience Paris nightlife with locals and fellow travelers',
      highlights: ['4 venues', 'Welcome drink', 'Local guide', 'Meet new people']
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
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Activities</h1>
          <p className="text-gray-600">Find unique experiences and unforgettable adventures</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="budget">Budget (Under $50)</option>
                <option value="mid">Mid-range ($50-$100)</option>
                <option value="luxury">Luxury ($100+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Any Duration</option>
                <option value="short">Short (1-2 hours)</option>
                <option value="medium">Medium (3-4 hours)</option>
                <option value="long">Long (5+ hours)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredActivities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={cardVariants}
                layout
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-48 object-cover transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleFavorite(activity.id)}
                    className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(activity.id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {categories.find(c => c.id === activity.category)?.icon} {activity.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{activity.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-900">{activity.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({activity.reviews})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.duration}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Users className="h-4 w-4 mr-1" />
                    {activity.groupSize}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Highlights</h4>
                    <div className="flex flex-wrap gap-1">
                      {activity.highlights.slice(0, 3).map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {highlight}
                        </span>
                      ))}
                      {activity.highlights.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{activity.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
                      <span className="text-xl font-bold text-gray-900">${activity.price}</span>
                      <span className="text-sm text-gray-500 ml-1">per person</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Trip
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredActivities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActivitySearch;