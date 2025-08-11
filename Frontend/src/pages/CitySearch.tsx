import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, MapPin, Users, Clock, Heart, ExternalLink } from 'lucide-react';

const CitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('paris');
  const [favorites, setFavorites] = useState<string[]>([]);

  const cities = [
    { id: 'paris', name: 'Paris', country: 'France' },
    { id: 'tokyo', name: 'Tokyo', country: 'Japan' },
    { id: 'rome', name: 'Rome', country: 'Italy' },
    { id: 'barcelona', name: 'Barcelona', country: 'Spain' },
    { id: 'london', name: 'London', country: 'UK' }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'attractions', name: 'Attractions', icon: '🏛️' },
    { id: 'restaurants', name: 'Restaurants', icon: '🍽️' },
    { id: 'hotels', name: 'Hotels', icon: '🏨' },
    { id: 'activities', name: 'Activities', icon: '🎯' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' }
  ];

  const attractions = {
    paris: [
      {
        id: '1',
        name: 'Eiffel Tower',
        category: 'attractions',
        rating: 4.6,
        reviews: 125420,
        price: '€25',
        duration: '2-3 hours',
        image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Iconic iron lattice tower and symbol of Paris'
      },
      {
        id: '2',
        name: 'Louvre Museum',
        category: 'attractions',
        rating: 4.5,
        reviews: 89340,
        price: '€17',
        duration: '3-4 hours',
        image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'World\'s largest art museum and historic monument'
      },
      {
        id: '3',
        name: 'Le Comptoir du Relais',
        category: 'restaurants',
        rating: 4.4,
        reviews: 2340,
        price: '€€€',
        duration: '1-2 hours',
        image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Traditional French bistro with authentic cuisine'
      },
      {
        id: '4',
        name: 'Hotel Le Marais',
        category: 'hotels',
        rating: 4.3,
        reviews: 1890,
        price: '€180/night',
        duration: 'Stay',
        image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Boutique hotel in the historic Marais district'
      },
      {
        id: '5',
        name: 'Seine River Cruise',
        category: 'activities',
        rating: 4.2,
        reviews: 5670,
        price: '€15',
        duration: '1 hour',
        image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Scenic boat tour along the Seine River'
      },
      {
        id: '6',
        name: 'Champs-Élysées',
        category: 'shopping',
        rating: 4.1,
        reviews: 12340,
        price: 'Free',
        duration: '2-3 hours',
        image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Famous avenue for shopping and dining'
      }
    ]
  };

  const filteredAttractions = (attractions[selectedCity as keyof typeof attractions] || []).filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || attraction.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
          <p className="text-gray-600">Discover amazing places, restaurants, and activities</p>
        </motion.div>

        {/* City Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCity === city.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {city.name}, {city.country}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search attractions, restaurants, hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
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
        </motion.div>

        {/* Results */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredAttractions.map((attraction) => (
              <motion.div
                key={attraction.id}
                variants={cardVariants}
                layout
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(attraction.id)}
                    className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-200"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(attraction.id)
                          ? 'text-red-500 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {categories.find(c => c.id === attraction.category)?.icon} {attraction.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{attraction.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{attraction.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-900">{attraction.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({attraction.reviews.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {attraction.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">{attraction.price}</span>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Add to Trip
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredAttractions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;