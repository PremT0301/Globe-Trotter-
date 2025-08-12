import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign, Camera, ArrowRight, ArrowLeft, Plane, Heart, Globe, Zap, Star, Target, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';

interface City {
  id: number;
  name: string;
  country: string;
  image?: string;
  popularityScore?: number;
}



const CreateTrip: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    description: '',
    tripType: 'Adventure' as 'Adventure' | 'Romantic' | 'Cultural' | 'Relaxation',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [createdTripId, setCreatedTripId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

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



  const steps = [
    { number: 1, title: 'Basic Info', icon: <MapPin className="h-5 w-5" />, color: 'from-blue-500 to-indigo-500' },
    { number: 2, title: 'Details', icon: <Calendar className="h-5 w-5" />, color: 'from-purple-500 to-pink-500' },
    { number: 3, title: 'Preferences', icon: <Users className="h-5 w-5" />, color: 'from-green-500 to-teal-500' }
  ];

  // Popular destinations based on backend data (top 4)
  const popularDestinations = cities
    .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
    .slice(0, 4)
    .map(city => ({
      name: `${city.name}, ${city.country}`,
      image: city.image || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      description: `Explore ${city.name}`
    }));

  const tripTypes = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: 'Adventure',
      description: 'Thrilling outdoor activities',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Romantic',
      description: 'Perfect for couples',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Cultural',
      description: 'Immerse in local culture',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Relaxation',
      description: 'Peaceful and calming',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTripTypeSelect = (tripType: 'Adventure' | 'Romantic' | 'Cultural' | 'Relaxation') => {
    setFormData(prev => ({ ...prev, tripType }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/trips', formData) as any;
      showToast('success', 'Trip Created!', 'Your trip has been successfully created.');
      setCreatedTripId(response._id);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error creating trip:', error);
      showToast('error', 'Error', 'Failed to create trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleShareToCommunity = async () => {
    if (!createdTripId) return;
    
    try {
      const response = await api.post('/api/community/posts', {
        tripId: createdTripId,
        title: formData.title,
        description: formData.description,
        tags: [formData.destination.toLowerCase(), formData.tripType.toLowerCase()]
      });
      
      showToast('success', 'Shared to Community!', 'Your trip is now visible to the community');
      setShowShareModal(false);
      navigate('/community');
    } catch (error) {
      console.error('Error sharing to community:', error);
      showToast('error', 'Error', 'Failed to share to community');
    }
  };

  const handleContinueToItinerary = () => {
    setShowShareModal(false);
    navigate(`/itinerary-builder/${createdTripId}`);
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Trip</h1>
          <p className="text-gray-600">Plan your next adventure with ease</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.number
                      ? `bg-gradient-to-r ${step.color} text-white`
                      : 'bg-gray-200 text-gray-500'
                  } transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {step.icon}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-2 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                  } transition-all duration-300`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8 mt-2">
            {steps.map((step) => (
              <span
                key={step.number}
                className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
          
          {/* Selected Trip Type Display */}
          {currentStep === 3 && formData.tripType && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-4"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                <span className="text-sm font-medium">Selected Trip Type:</span>
                <span className="text-sm font-bold">{formData.tripType}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/90 rounded-3xl shadow-lg border border-white/20 p-8"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Title</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                    placeholder="Enter your trip title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Destination</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                    placeholder="Where are you going?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Popular Destinations</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularDestinations.map((destination, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                        className="relative overflow-hidden rounded-xl cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setFormData(prev => ({ ...prev, destination: destination.name }))}
                      >
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <h3 className="text-white font-semibold text-sm">{destination.name}</h3>
                          <p className="text-white/80 text-xs">{destination.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Travelers</label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      type="number"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                    />
                  </div>
                  <div>
                                         <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (₹)</label>
                     <motion.input
                       whileFocus={{ scale: 1.02 }}
                       whileHover={{ scale: 1.01 }}
                       type="number"
                       name="budget"
                       value={formData.budget}
                       onChange={handleInputChange}
                       placeholder="Enter your budget in INR"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                     />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Description</label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80 resize-none"
                    placeholder="Describe your trip..."
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Trip Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tripTypes.map((type, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 group relative ${
                          formData.tripType === type.title
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-blue-500'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleTripTypeSelect(type.title as 'Adventure' | 'Romantic' | 'Cultural' | 'Relaxation')}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            className={`p-3 rounded-xl bg-gradient-to-r ${type.color}`}
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <div className="text-white">{type.icon}</div>
                          </motion.div>
                          <div>
                            <h3 className={`font-semibold transition-colors ${
                              formData.tripType === type.title
                                ? 'text-blue-600'
                                : 'text-gray-900 group-hover:text-blue-600'
                            }`}>
                              {type.title}
                            </h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                        {formData.tripType === type.title && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Cover Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <motion.img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="space-y-2">
                          <motion.div 
                            className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Camera className="h-6 w-6 text-white" />
                          </motion.div>
                          <p className="text-gray-600">Click to upload an image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </motion.button>

            {currentStep === 3 ? (
              <motion.button
                onClick={handleSubmit}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 10px 25px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px rgba(59, 130, 246, 0.3)"
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
                Create Trip
                <ArrowRight className="h-5 w-5 ml-2" />
              </motion.button>
            ) : (
              <motion.button
                onClick={nextStep}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 10px 25px rgba(59, 130, 246, 0.3)",
                    "0 20px 40px rgba(147, 51, 234, 0.4)",
                    "0 10px 25px rgba(59, 130, 246, 0.3)"
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
                Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Share to Community Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trip Created Successfully!</h3>
                <p className="text-gray-600 mb-6">Would you like to share your trip with the community?</p>
                
                <div className="space-y-3">
                  <button
                    onClick={handleShareToCommunity}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Share to Community
                  </button>
                  <button
                    onClick={handleContinueToItinerary}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Continue to Itinerary
                  </button>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default CreateTrip;