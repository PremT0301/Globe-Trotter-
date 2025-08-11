import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign, Camera, ArrowRight, ArrowLeft, Plane, Heart, Globe, Zap } from 'lucide-react';
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
    { number: 1, title: 'Basic Info', icon: <MapPin className="h-5 w-5" />, color: 'from-primary-500 to-primary-600' },
    { number: 2, title: 'Details', icon: <Calendar className="h-5 w-5" />, color: 'from-secondary-500 to-secondary-600' },
    { number: 3, title: 'Preferences', icon: <Users className="h-5 w-5" />, color: 'from-accent-500 to-accent-600' }
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
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Romantic',
      description: 'Perfect for couples',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Cultural',
      description: 'Immerse in local culture',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Relaxation',
      description: 'Peaceful and calming',
      color: 'from-success-500 to-success-600'
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
    // In a real app, this would save the trip data
    console.log('Trip data:', formData);
    showToast('success', 'Trip created!', 'Your new trip has been created successfully.');
    navigate('/my-trips');
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Create New <span className="gradient-text">Trip</span>
              </h1>
              <p className="text-gray-600 mt-1">Let's plan your next adventure together</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${
                          currentStep >= step.number
                            ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                            : 'bg-gray-200 text-gray-600'
                        } transition-all duration-300`}
                      >
                        {step.icon}
                      </motion.div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-1 mx-4 ${
                          currentStep > step.number ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gray-200'
                        } transition-colors duration-300`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  {steps.map((step) => (
                    <span
                      key={step.number}
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form Steps */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trip Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                        placeholder="e.g., European Adventure 2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Destination
                      </label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                        placeholder="e.g., Paris, France"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Travelers
                      </label>
                      <input
                        type="number"
                        name="travelers"
                        value={formData.travelers}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Budget (USD)
                      </label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                        placeholder="e.g., 5000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trip Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors resize-none"
                        placeholder="Describe your dream trip..."
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        Trip Type
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {tripTypes.map((type, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 cursor-pointer transition-all duration-300 group"
                          >
                            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
                              <div className="text-white">{type.icon}</div>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{type.title}</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Trip Cover Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Click to upload an image</p>
                        </label>
                      </div>
                      {imagePreview && (
                        <div className="mt-4">
                          <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-primary-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl hover:from-success-600 hover:to-success-700 transition-all duration-300"
                  >
                    Create Trip
                    <Plane className="h-4 w-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Destinations */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Destinations</h3>
              <div className="space-y-4">
                {popularDestinations.map((destination, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setFormData(prev => ({ ...prev, destination: destination.name }))}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h4 className="text-white font-semibold text-sm">{destination.name}</h4>
                        <p className="text-white/80 text-xs">{destination.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trip Tips */}
            <div className="card p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Trip Planning Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Start planning at least 3 months in advance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Research local customs and weather
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Book flights and accommodation early
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Create a flexible itinerary
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;