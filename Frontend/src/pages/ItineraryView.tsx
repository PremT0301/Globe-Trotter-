import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Share2, Download, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';

const ItineraryView: React.FC = () => {
  const { tripId } = useParams();
  const [selectedDay, setSelectedDay] = useState(0);

  const tripData = {
    title: 'European Adventure',
    destination: 'Paris, Rome, Barcelona',
    dates: 'June 15 - June 30, 2024',
    travelers: 3,
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1'
  };

  const itinerary = [
    {
      id: '1',
      date: '2024-06-15',
      dayName: 'Day 1',
      activities: [
        {
          id: '1',
          title: 'Arrive at Charles de Gaulle Airport',
          time: '10:00',
          location: 'CDG Airport, Paris',
          type: 'transport',
          duration: '1 hour',
          notes: 'Flight AF123 from NYC',
          image: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        },
        {
          id: '2',
          title: 'Check-in at Hotel Le Marais',
          time: '14:00',
          location: '12 Rue des Archives, Paris',
          type: 'hotel',
          duration: '30 minutes',
          image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        },
        {
          id: '3',
          title: 'Visit Notre-Dame Cathedral',
          time: '16:00',
          location: 'Île de la Cité, Paris',
          type: 'attraction',
          duration: '2 hours',
          image: 'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        },
        {
          id: '4',
          title: 'Dinner at Le Comptoir du Relais',
          time: '19:30',
          location: '9 Carrefour de l\'Odéon, Paris',
          type: 'restaurant',
          duration: '2 hours',
          image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        }
      ]
    },
    {
      id: '2',
      date: '2024-06-16',
      dayName: 'Day 2',
      activities: [
        {
          id: '5',
          title: 'Visit Louvre Museum',
          time: '09:00',
          location: 'Rue de Rivoli, Paris',
          type: 'attraction',
          duration: '4 hours',
          image: 'https://images.pexels.com/photos/2675266/pexels-photo-2675266.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        },
        {
          id: '6',
          title: 'Lunch at Café de Flore',
          time: '13:30',
          location: '172 Boulevard Saint-Germain, Paris',
          type: 'restaurant',
          duration: '1.5 hours',
          image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        },
        {
          id: '7',
          title: 'Walk along Seine River',
          time: '15:30',
          location: 'Seine Riverbank, Paris',
          type: 'attraction',
          duration: '2 hours',
          image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        }
      ]
    },
    {
      id: '3',
      date: '2024-06-17',
      dayName: 'Day 3',
      activities: [
        {
          id: '8',
          title: 'Visit Eiffel Tower',
          time: '10:00',
          location: 'Champ de Mars, Paris',
          type: 'attraction',
          duration: '3 hours',
          image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
        },
        {
          id: '9',
          title: 'Seine River Cruise',
          time: '14:00',
          location: 'Port de la Bourdonnais, Paris',
          type: 'attraction',
          duration: '1.5 hours',
          image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
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

  const nextDay = () => {
    if (selectedDay < itinerary.length - 1) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const prevDay = () => {
    if (selectedDay > 0) {
      setSelectedDay(selectedDay - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div
          className="absolute inset-0 bg-cover bg-center bg-blend-overlay"
          style={{ backgroundImage: `url(${tripData.image})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <h1 className="text-4xl font-bold mb-2">{tripData.title}</h1>
            <div className="flex items-center space-x-6 text-lg">
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
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center space-x-4">
            <Link
              to={`/itinerary-builder/${tripId}`}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Itinerary
            </Link>
            <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
              <Share2 className="h-4 w-4 mr-2" />
              Share Trip
            </button>
            <button className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Day Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Timeline</h2>
              <div className="space-y-2">
                {itinerary.map((day, index) => (
                  <motion.button
                    key={day.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDay(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedDay === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{day.dayName}</p>
                        <p className="text-sm opacity-75">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <span className="text-xs opacity-75">
                        {day.activities.length} activities
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Day Details */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {itinerary[selectedDay].dayName}
                    </h2>
                    <p className="text-blue-100">
                      {new Date(itinerary[selectedDay].date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevDay}
                      disabled={selectedDay === 0}
                      className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextDay}
                      disabled={selectedDay === itinerary.length - 1}
                      className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Activities Timeline */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {itinerary[selectedDay].activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4"
                      >
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                            {getActivityIcon(activity.type)}
                          </div>
                          {index < itinerary[selectedDay].activities.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                          )}
                        </div>

                        {/* Activity Details */}
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                {activity.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Clock className="h-4 w-4 mr-1" />
                                {activity.time} • {activity.duration}
                              </div>
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <MapPin className="h-4 w-4 mr-1" />
                                {activity.location}
                              </div>
                              {activity.notes && (
                                <p className="text-sm text-gray-600 italic mb-3">
                                  {activity.notes}
                                </p>
                              )}
                            </div>
                            {activity.image && (
                              <img
                                src={activity.image}
                                alt={activity.title}
                                className="w-24 h-16 object-cover rounded-lg ml-4"
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {itinerary[selectedDay].activities.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Calendar className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No activities planned
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This day is free for spontaneous adventures!
                    </p>
                    <Link
                      to={`/itinerary-builder/${tripId}`}
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Edit3 className="h-5 w-5 mr-2" />
                      Add Activities
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;