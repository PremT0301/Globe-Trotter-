import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Copy, Download, Calendar, MapPin, Users, Clock, Globe, Check } from 'lucide-react';

const SharedItinerary: React.FC = () => {
  const { tripId } = useParams();
  const [copied, setCopied] = useState(false);

  const tripData = {
    title: 'European Adventure',
    destination: 'Paris, Rome, Barcelona',
    dates: 'June 15 - June 30, 2024',
    travelers: 3,
    createdBy: 'John Doe',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1',
    description: 'A wonderful journey through Europe\'s most beautiful cities, exploring art, culture, and cuisine.'
  };

  const itinerary = [
    {
      id: '1',
      date: '2024-06-15',
      dayName: 'Day 1 - Arrival in Paris',
      activities: [
        {
          id: '1',
          title: 'Arrive at Charles de Gaulle Airport',
          time: '10:00',
          location: 'CDG Airport, Paris',
          duration: '1 hour',
          type: 'transport'
        },
        {
          id: '2',
          title: 'Check-in at Hotel Le Marais',
          time: '14:00',
          location: '12 Rue des Archives, Paris',
          duration: '30 minutes',
          type: 'hotel'
        },
        {
          id: '3',
          title: 'Visit Notre-Dame Cathedral',
          time: '16:00',
          location: 'Île de la Cité, Paris',
          duration: '2 hours',
          type: 'attraction'
        },
        {
          id: '4',
          title: 'Dinner at Le Comptoir du Relais',
          time: '19:30',
          location: '9 Carrefour de l\'Odéon, Paris',
          duration: '2 hours',
          type: 'restaurant'
        }
      ]
    },
    {
      id: '2',
      date: '2024-06-16',
      dayName: 'Day 2 - Paris Exploration',
      activities: [
        {
          id: '5',
          title: 'Visit Louvre Museum',
          time: '09:00',
          location: 'Rue de Rivoli, Paris',
          duration: '4 hours',
          type: 'attraction'
        },
        {
          id: '6',
          title: 'Lunch at Café de Flore',
          time: '13:30',
          location: '172 Boulevard Saint-Germain, Paris',
          duration: '1.5 hours',
          type: 'restaurant'
        },
        {
          id: '7',
          title: 'Walk along Seine River',
          time: '15:30',
          location: 'Seine Riverbank, Paris',
          duration: '2 hours',
          type: 'attraction'
        }
      ]
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'transport': return '✈️';
      default: return '📍';
    }
  };

  const shareUrl = window.location.href;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleExportPDF = async () => {
    try {
      const slug = window.location.pathname.split('/').pop();
      const link = document.createElement('a');
      link.href = `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/pdf/shared/${slug}`;
      link.download = `${tripData?.title || 'shared_trip'}_itinerary.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('success', 'PDF Downloaded!', 'Your itinerary PDF has been downloaded');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showToast('error', 'Error', 'Failed to export PDF');
    }
  };

  const shareOptions = [
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
    { name: 'Twitter', icon: '🐦', color: 'bg-sky-500' },
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500' },
    { name: 'Email', icon: '📧', color: 'bg-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-600">
        <div
          className="absolute inset-0 bg-cover bg-center bg-blend-overlay"
          style={{ backgroundImage: `url(${tripData.image})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-3xl"
          >
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 mr-3" />
              <span className="text-xl font-semibold">GlobeTrotter</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{tripData.title}</h1>
            <p className="text-xl mb-4">{tripData.description}</p>
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {tripData.destination}
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {tripData.dates}
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {tripData.travelers} travelers
              </div>
            </div>
            <p className="text-sm mt-4 opacity-75">Created by {tripData.createdBy}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Share Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Share this itinerary</h2>
              <p className="text-gray-600">Let others discover this amazing trip</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Copy Link */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </motion.button>

              {/* PDF Export */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </motion.button>

              {/* Social Share Buttons */}
              {shareOptions.map((option) => (
                <motion.button
                  key={option.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center ${option.color} text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200`}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.name}
                </motion.button>
              ))}

              {/* Download PDF */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Itinerary Content */}
        <div className="space-y-8">
          {itinerary.map((day, dayIndex) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
                <h2 className="text-2xl font-bold">{day.dayName}</h2>
                <p className="text-blue-100 mt-1">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Activities */}
              <div className="p-6">
                <div className="space-y-6">
                  {day.activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (dayIndex * 0.1) + (index * 0.05) }}
                      className="flex items-start space-x-4"
                    >
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                          {getActivityIcon(activity.type)}
                        </div>
                        {index < day.activities.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                        )}
                      </div>

                      {/* Activity Details */}
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                          {activity.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          {activity.time} • {activity.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {activity.location}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white mt-12"
        >
          <Globe className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-4">Create Your Own Adventure</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Inspired by this itinerary? Start planning your own unforgettable journey with GlobeTrotter's 
            intelligent travel planning tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Start Planning Free
            </Link>
            <Link
              to="/"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-500">
          <p>Powered by <span className="font-semibold text-blue-600">GlobeTrotter</span></p>
          <p className="text-sm mt-2">The intelligent way to plan your travels</p>
        </div>
      </div>
    </div>
  );
};

export default SharedItinerary;