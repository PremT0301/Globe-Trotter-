import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, MapPin, Users, Clock, Heart, ExternalLink, Globe, Plane, Compass, Zap, Target, Sparkles, MessageCircle, Share2, User, ThumbsUp } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  likedBy: string[];
  comments: number;
  createdAt: string;
  location: string;
  category: string;
}

const CitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('paris');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'explore' | 'community'>('explore');
  const { showToast } = useToast();

  const [cities, setCities] = useState<{ id: number; name: string; country: string; image?: string; popularityScore?: number }[]>([]);

  useEffect(() => {
    fetchCities();
    fetchPosts();
  }, []);

  const fetchCities = async () => {
    try {
      const data = await api.get<{ id: number; name: string; country: string; image?: string; popularityScore?: number }[]>('/api/cities');
      setCities(data);
      if (data.length > 0) setSelectedCity(data[0].name.toLowerCase());
    } catch (e) {
      console.error('Failed to fetch cities:', e);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get<Post[]>('/api/posts');
      setPosts(response);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      showToast('error', 'Failed to load posts', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await api.post(`/api/posts/${postId}/like`);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes('current-user-id'); // Replace with actual user ID
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked 
              ? post.likedBy.filter(id => id !== 'current-user-id')
              : [...post.likedBy, 'current-user-id']
          };
        }
        return post;
      }));
      showToast('success', 'Post updated!', 'Your like has been recorded.');
    } catch (error) {
      showToast('error', 'Failed to like post', 'Please try again.');
    }
  };

  const categories = [
    { id: 'all', name: 'All', icon: <Globe className="h-5 w-5" />, color: 'from-blue-500 to-indigo-500' },
    { id: 'attractions', name: 'Attractions', icon: <Star className="h-5 w-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'restaurants', name: 'Restaurants', icon: <Heart className="h-5 w-5" />, color: 'from-green-500 to-teal-500' },
    { id: 'hotels', name: 'Hotels', icon: <MapPin className="h-5 w-5" />, color: 'from-orange-500 to-amber-500' },
    { id: 'activities', name: 'Activities', icon: <Zap className="h-5 w-5" />, color: 'from-red-500 to-pink-500' },
    { id: 'shopping', name: 'Shopping', icon: <Plane className="h-5 w-5" />, color: 'from-indigo-500 to-purple-500' }
  ];

  // Popular cities based on backend data (top 4)
  const popularCities = cities
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, 4)
    .map(city => ({
      name: `${city.name}, ${city.country}`,
      image: city.image || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      description: `Explore ${city.name}`,
      attractions: Math.floor(Math.random() * 200) + 50,
      rating: 4.5 + Math.random() * 0.5,
      likes: Math.floor(Math.random() * 1000) + 200
    }));

  const attractions = {
    paris: [
      {
        id: '1',
        name: 'Eiffel Tower',
        category: 'attractions',
        rating: 4.6,
        reviews: 125420,
        price: '₹2,500',
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
        price: '₹1,700',
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
        price: '₹₹₹',
        duration: '1-2 hours',
        image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Traditional French bistro with authentic cuisine'
      },
      {
        id: '4',
        name: 'Hotel Ritz Paris',
        category: 'hotels',
        rating: 4.8,
        reviews: 1240,
        price: '₹₹₹₹',
        duration: 'Overnight',
        image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Luxury hotel in the heart of Paris'
      },
      {
        id: '5',
        name: 'Seine River Cruise',
        category: 'activities',
        rating: 4.3,
        reviews: 5670,
        price: '₹1,500',
        duration: '1 hour',
        image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Scenic boat tour along the Seine River'
      },
      {
        id: '6',
        name: 'Galeries Lafayette',
        category: 'shopping',
        rating: 4.2,
        reviews: 890,
        price: '₹₹',
        duration: '2-3 hours',
        image: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        description: 'Famous department store with luxury brands'
      }
    ]
  };

  const filteredAttractions = attractions[selectedCity as keyof typeof attractions]?.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || attraction.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
          <p className="text-gray-600">Discover amazing places and experiences around the world</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/90 rounded-2xl shadow-lg border border-white/20 p-2">
            <div className="flex space-x-2">
              {[
                { id: 'explore', label: 'Explore', icon: <Compass className="h-5 w-5" /> },
                { id: 'community', label: 'Community', icon: <Users className="h-5 w-5" /> }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'explore' | 'community')}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="mr-2">{tab.icon}</div>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Popular Cities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Cities (Most Liked)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCity(city.name.split(',')[0].toLowerCase())}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1">
                  <div className="flex items-center text-sm">
                    <ThumbsUp className="h-4 w-4 text-red-500 mr-1" />
                    <span className="font-semibold">{city.likes}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg mb-1">{city.name}</h3>
                  <p className="text-white/80 text-sm mb-2">{city.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white text-sm">{city.rating}</span>
                    </div>
                    <span className="text-white/80 text-sm">{city.attractions} attractions</span>
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
                placeholder={activeTab === 'explore' ? "Search attractions, restaurants, hotels..." : "Search community posts..."}
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
        </motion.div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'explore' ? (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} Attractions
                </h2>
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
                  <span className="text-gray-600">{filteredAttractions.length} results</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttractions.map((attraction, index) => (
                  <motion.div
                    key={attraction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="bg-white/90 rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="relative h-48">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <motion.button
                        onClick={() => toggleFavorite(attraction.id)}
                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart 
                          className={`h-5 w-5 ${
                            favorites.includes(attraction.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </motion.button>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg mb-1">{attraction.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-white text-sm mr-2">{attraction.rating}</span>
                          <span className="text-white/80 text-sm">({attraction.reviews.toLocaleString()} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-2">{attraction.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {attraction.duration}
                        </div>
                        <div className="text-lg font-bold text-gray-900">{attraction.price}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <motion.button
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </motion.button>
                        
                        <motion.button
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Book Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Community Posts</h2>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-gray-600">{filteredPosts.length} posts</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="bg-white/90 rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="relative h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 left-4 flex items-center">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                        <span className="text-white text-sm font-medium ml-2">{post.author.name}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg mb-1">{post.title}</h3>
                        <div className="flex items-center text-white/80 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {post.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Heart 
                              className={`h-5 w-5 ${
                                post.likedBy.includes('current-user-id') 
                                  ? 'text-red-500 fill-current' 
                                  : ''
                              }`} 
                            />
                            <span>{post.likes}</span>
                          </motion.button>
                          
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MessageCircle className="h-5 w-5" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        
                        <motion.button
                          className="text-blue-600 hover:text-blue-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Share2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(filteredAttractions.length === 0 && activeTab === 'explore') && (
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
              <Compass className="h-12 w-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {filteredPosts.length === 0 && activeTab === 'community' && (
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
              <Users className="h-12 w-12 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No community posts found</h3>
            <p className="text-gray-600">Be the first to share your travel experience!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;