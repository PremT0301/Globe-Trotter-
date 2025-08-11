import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign, Camera, ArrowRight, ArrowLeft, Plane, Heart, Globe, Zap, Star, Target, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const CreateTrip: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    description: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const steps = [
    { number: 1, title: 'Basic Info', icon: <MapPin className="h-5 w-5" />, color: 'from-blue-500 to-indigo-500' },
    { number: 2, title: 'Details', icon: <Calendar className="h-5 w-5" />, color: 'from-purple-500 to-pink-500' },
    { number: 3, title: 'Preferences', icon: <Users className="h-5 w-5" />, color: 'from-green-500 to-teal-500' }
  ];

  const popularDestinations = [
    {
      name: 'Paris, France',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      description: 'The City of Light'
    },
    {
      name: 'Tokyo, Japan',
      image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      description: 'Modern meets Traditional'
    },
    {
      name: 'Bali, Indonesia',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      description: 'Island Paradise'
    },
    {
      name: 'New York, USA',
      image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      description: 'The Big Apple'
    }
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    showToast('success', 'Trip Created!', 'Your trip has been successfully created.');
    navigate('/my-trips');
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
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating gradient orbs with more complex animations */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 80, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 60, -40, 0],
            scale: [1, 0.8, 1.3, 1],
            rotate: [0, -180, 360, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.3, 0.7, 1],
            rotate: [0, 90, 270, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
          className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -40, 70, 0],
            y: [0, 80, -30, 0],
            scale: [1, 0.9, 1.4, 1],
            rotate: [0, -90, 180, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-40 right-1/3 w-20 h-20 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full"
        />

        {/* Animated particles with different shapes */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${particle.color}-400/50`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 360, 720],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          >
            {particle.type === 'star' && <Star className="w-full h-full" />}
            {particle.type === 'circle' && <div className="w-full h-full rounded-full bg-current" />}
            {particle.type === 'square' && <div className="w-full h-full bg-current transform rotate-45" />}
            {particle.type === 'triangle' && <div className="w-full h-full bg-current clip-path-triangle" />}
          </motion.div>
        ))}

        {/* Geometric shapes with enhanced animations */}
        <motion.div
          animate={{
            rotate: [0, 360, 720],
            scale: [1, 1.2, 0.8, 1],
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-blue-300/30 rounded-lg"
        />
        <motion.div
          animate={{
            rotate: [360, 0, -360],
            scale: [1, 0.9, 1.3, 1],
            x: [0, -15, 15, 0],
            y: [0, 15, -15, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 8
          }}
          className="absolute bottom-1/4 right-1/4 w-12 h-12 border-2 border-purple-300/30 rounded-full"
        />

        {/* Floating icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.color}`}
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + index * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Trip</h1>
          <p className="text-gray-600">Plan your next adventure step by step</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${
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
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                  } transition-all duration-300`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                      placeholder="e.g., $2000"
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
                        className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
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
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {type.title}
                            </h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
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
    </div>
  );
};

export default CreateTrip;