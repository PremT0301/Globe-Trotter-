import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Share2, Download, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface Activity {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'activity';
  duration: string;
  notes?: string;
  cost?: number;
}

interface Day {
  id: string;
  date: string;
  dayName: string;
  activities: Activity[];
}

const ItineraryView: React.FC = () => {
  const { tripId } = useParams();
  const { showToast } = useToast();
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);
  const [itinerary, setItinerary] = useState<Day[]>([]);

  // Fetch trip and itinerary data
  useEffect(() => {
    const fetchData = async () => {
      if (!tripId) return;
      
      try {
        setLoading(true);
        
        // Fetch trip data
        const trip = await api.get(`/api/trips/${tripId}`) as any;
        setTripData(trip);
        
        // Generate itinerary days based on trip dates
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        const days: Day[] = [];
        
        const currentDate = new Date(startDate);
        let dayIndex = 1;
        
        while (currentDate <= endDate) {
          days.push({
            id: dayIndex.toString(),
            date: currentDate.toISOString().split('T')[0],
            dayName: `Day ${dayIndex}`,
            activities: []
          });
          currentDate.setDate(currentDate.getDate() + 1);
          dayIndex++;
        }
        
        setItinerary(days);

        // Fetch existing itinerary data
        try {
          const itineraryData = await api.get(`/api/itinerary/${tripId}`) as any[];
          console.log('Fetched itinerary data:', itineraryData);
          
          // Populate activities from database
          const updatedDays = days.map(day => {
            const dayActivities = itineraryData
              .filter(item => {
                const itemDate = new Date(item.date).toISOString().split('T')[0];
                return itemDate === day.date;
              })
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map(item => {
                // If activityId exists, the activity data is in the populated activity
                if (item.activityId) {
                  return {
                    id: item._id,
                    title: item.activityId.name,
                    type: item.activityId.type,
                    time: '12:00', // Default time since it's not stored in Activity model
                    location: item.cityId?.name || 'Unknown Location',
                    duration: `${item.activityId.duration} minutes`,
                    notes: item.notes || item.activityId.description,
                    cost: item.activityId.cost
                  };
                } else {
                  // Fallback for legacy data stored in notes
                  try {
                    const parsedData = JSON.parse(item.notes);
                    return {
                      id: item._id,
                      ...parsedData
                    };
                  } catch (error) {
                    console.error('Error parsing activity data:', error);
                    return null;
                  }
                }
              })
              .filter(activity => activity !== null);
            
            return {
              ...day,
              activities: dayActivities
            };
          });
          
          console.log('Updated days with activities:', updatedDays);
          setItinerary(updatedDays);
        } catch (error) {
          console.error('Error fetching itinerary data:', error);
          // Continue with empty activities if fetch fails
        }
      } catch (error) {
        console.error('Error fetching trip data:', error);
        showToast('error', 'Error', 'Failed to load trip data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, showToast]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'transport': return '✈️';
      case 'activity': return '🎯';
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

  const handleShareTrip = async () => {
    try {
      const response = await api.post(`/api/shared/${tripId}`);
      const shareUrl = response.shareUrl;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      showToast('success', 'Trip Shared!', 'Trip shared successfully and added to community! Share link copied to clipboard');
    } catch (error: any) {
      console.error('Error sharing trip:', error);
      const errorMessage = error.response?.data?.message || 'Failed to share trip';
      showToast('error', 'Error', errorMessage);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Trip not found</p>
          <Link to="/my-trips" className="text-blue-600 hover:text-blue-700">
            Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <div
          className="absolute inset-0 bg-cover bg-center bg-blend-overlay"
          style={{ 
            backgroundImage: tripData.coverPhoto 
              ? `url(${tripData.coverPhoto})` 
              : 'url(https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1)' 
          }}
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
                {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {tripData.travelers || 1} travelers
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
            <button 
              onClick={handleShareTrip}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Trip
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
                      {itinerary[selectedDay]?.dayName || `Day ${selectedDay + 1}`}
                    </h2>
                    <p className="text-blue-100">
                      {itinerary[selectedDay] && new Date(itinerary[selectedDay].date).toLocaleDateString('en-US', { 
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
                    {itinerary[selectedDay]?.activities.map((activity, index) => (
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
                          {index < (itinerary[selectedDay]?.activities.length || 0) - 1 && (
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
                              {activity.cost && (
                                <p className="text-sm text-green-600 font-medium mb-3">
                                  Cost: ₹{activity.cost}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {!itinerary[selectedDay]?.activities || itinerary[selectedDay].activities.length === 0 && (
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