import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, MapPin, Users, Clock, Heart, ExternalLink, Globe, Plane, Compass, Zap } from 'lucide-react';
import { api } from '../lib/api';

const CitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('paris');
  const [favorites, setFavorites] = useState<string[]>([]);

  const [cities, setCities] = useState<{ id: number; name: string; country: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<{ id: number; name: string; country: string }[]>('/api/cities');
        setCities(data);
        if (data.length > 0) setSelectedCity(data[0].name.toLowerCase());
      } catch (e) {
        // no-op for now
      }
    })();
  }, []);

  const categories = [
    { id: 'all', name: 'All', icon: <Globe className="h-5 w-5" />, color: 'from-primary-500 to-primary-600' },
    { id: 'attractions', name: 'Attractions', icon: <Star className="h-5 w-5" />, color: 'from-secondary-500 to-secondary-600' },
    { id: 'restaurants', name: 'Restaurants', icon: <Heart className="h-5 w-5" />, color: 'from-accent-500 to-accent-600' },
    { id: 'hotels', name: 'Hotels', icon: <MapPin className="h-5 w-5" />, color: 'from-success-500 to-success-600' },
    { id: 'activities', name: 'Activities', icon: <Zap className="h-5 w-5" />, color: 'from-primary-500 to-secondary-600' },
    { id: 'shopping', name: 'Shopping', icon: <Plane className="h-5 w-5" />, color: 'from-accent-500 to-success-600' }
  ];

  const popularCities = [
    {
      name: 'Paris, France',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'The City of Light',
      attractions: 150,
      rating: 4.8
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Modern meets Traditional',
      attractions: 200,
      rating: 4.7
    },
    {
      name: 'New York, USA',
      image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'The Big Apple',
      attractions: 180,
      rating: 4.6
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: 'Island Paradise',
      attractions: 120,
      rating: 4.9
    }
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
        description: 'Famous avenue known for luxury shopping and cafes'
      }
    ]
  };

  const filteredAttractions = attractions[selectedCity as keyof typeof attractions]?.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || attraction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

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
              <Compass className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Explore <span className="gradient-text">Destinations</span>
              </h1>
              <p className="text-gray-600 mt-1">Discover amazing places and plan your next adventure</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search attractions, restaurants, hotels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  />
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                >
                  <option value="paris">Paris, France</option>
                  <option value="tokyo">Tokyo, Japan</option>
                  <option value="newyork">New York, USA</option>
                  <option value="bali">Bali, Indonesia</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Attractions Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAttractions.map((attraction, index) => (
                <motion.div
                  key={attraction.id}
                  variants={itemVariants}
                  className="card overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(attraction.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                        favorites.includes(attraction.id)
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${favorites.includes(attraction.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700">
                        {attraction.category}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">{attraction.rating}</span>
                          <span className="text-xs ml-1">({attraction.reviews.toLocaleString()})</span>
                        </div>
                        <span className="text-sm font-medium">{attraction.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {attraction.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{attraction.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {attraction.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {attraction.reviews.toLocaleString()} reviews
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 group">
                      <span className="font-semibold">View Details</span>
                      <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredAttractions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No attractions found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Cities */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Cities</h3>
              <div className="space-y-4">
                {popularCities.map((city, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h4 className="text-white font-semibold text-sm">{city.name}</h4>
                        <p className="text-white/80 text-xs">{city.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-white/80 text-xs">{city.attractions} attractions</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-white text-xs ml-1">{city.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Travel Tips */}
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Travel Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Book popular attractions in advance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Check local weather and events
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Read recent reviews for updates
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Consider off-peak hours for better prices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySearch;