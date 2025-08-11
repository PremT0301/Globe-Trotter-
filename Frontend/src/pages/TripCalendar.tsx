import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Plus, Edit3, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface Activity {
  id: string;
  title: string;
  time: string;
  location: string;
  duration: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'activity';
  notes?: string;
  cost?: number;
  color: string;
  date: string;
}

interface DayActivities {
  date: string;
  activities: Activity[];
}

const TripCalendar: React.FC = () => {
  const { tripId } = useParams();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
  const [tripData, setTripData] = useState<any>(null);
  const [itineraryData, setItineraryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch trip and itinerary data
  useEffect(() => {
    const fetchData = async () => {
      if (!tripId) return;
      
      try {
        setLoading(true);
        
        // Fetch trip data
        const trip = await api.get(`/api/trips/${tripId}`) as any;
        setTripData(trip);
        setSelectedDate(trip.startDate);
        
        // Fetch itinerary data
        const itinerary = await api.get(`/api/itinerary/${tripId}`) as any[];
        console.log('Fetched itinerary data:', itinerary);
        setItineraryData(itinerary);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('error', 'Error', 'Failed to load trip data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, showToast]);

  // Helper functions
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'transport': return '✈️';
      case 'activity': return '🎯';
      default: return '📍';
    }
  };

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'attraction': return 'bg-blue-500';
      case 'restaurant': return 'bg-orange-500';
      case 'hotel': return 'bg-purple-500';
      case 'transport': return 'bg-green-500';
      case 'activity': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityColorLight = (type: string): string => {
    switch (type) {
      case 'attraction': return 'bg-blue-100 border-blue-200';
      case 'restaurant': return 'bg-orange-100 border-orange-200';
      case 'hotel': return 'bg-purple-100 border-purple-200';
      case 'transport': return 'bg-green-100 border-green-200';
      case 'activity': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  // Convert itinerary data to activities format
  const convertItineraryToActivities = (): Activity[] => {
    return itineraryData.map((item) => {
      const date = new Date(item.date).toISOString().split('T')[0];
      
      // If activityId exists, use the populated activity data
      if (item.activityId) {
        return {
          id: item._id,
          title: item.activityId.name,
          type: item.activityId.type,
          time: '12:00', // Default time since it's not stored in Activity model
          location: item.cityId?.name || 'Unknown Location',
          duration: `${item.activityId.duration} minutes`,
          notes: item.notes || item.activityId.description,
          cost: item.activityId.cost,
          color: getActivityColor(item.activityId.type),
          date: date
        };
      } else {
        // Fallback for legacy data stored in notes
        try {
          const parsedData = JSON.parse(item.notes);
          return {
            id: item._id,
            title: parsedData.title || 'Activity',
            type: parsedData.type || 'attraction',
            time: parsedData.time || '12:00',
            location: parsedData.location || 'Location',
            duration: parsedData.duration || '1 hour',
            notes: parsedData.notes || '',
            cost: parsedData.cost || 0,
            color: getActivityColor(parsedData.type || 'attraction'),
            date: date
          };
        } catch (error) {
          console.error('Error parsing activity data:', error);
          return {
            id: item._id,
            title: 'Activity',
            type: 'attraction',
            time: '12:00',
            location: 'Location',
            duration: '1 hour',
            notes: '',
            cost: 0,
            color: getActivityColor('attraction'),
            date: date
          };
        }
      }
    });
  };

  const activities = convertItineraryToActivities();

  // Generate calendar days
  const generateCalendarDays = () => {
    if (!tripData) return [];
    
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const days = [];
    
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getActivitiesForDate = (date: string): Activity[] => {
    return activities.filter(activity => activity.date === date);
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: string): boolean => {
    return date === new Date().toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip calendar...</p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center mb-2">
              <Link to={`/itinerary-builder/${tripId}`} className="mr-4">
                <motion.button
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Builder
                </motion.button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Calendar</h1>
            <p className="text-gray-600">
              {tripData.title} - {tripData.destination}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {activities.length} activities planned across {calendarDays.length} days
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  viewMode === 'calendar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  viewMode === 'timeline'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Calendar Grid */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {new Date(tripData.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <ChevronRight className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before trip start */}
                    {Array.from({ length: new Date(tripData.startDate).getDay() }, (_, i) => (
                      <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg opacity-50" />
                    ))}
                    
                    {calendarDays.map((day) => {
                      const dateStr = formatDate(day);
                      const dayActivities = getActivitiesForDate(dateStr);
                      const isSelected = selectedDate === dateStr;
                      const isTodayDate = isToday(dateStr);

                      return (
                        <motion.button
                          key={dateStr}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`h-24 p-2 rounded-lg border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : isTodayDate
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="text-left">
                            <div className={`text-sm font-medium ${
                              isSelected ? 'text-blue-900' : isTodayDate ? 'text-green-900' : 'text-gray-900'
                            }`}>
                              {day.getDate()}
                            </div>
                            <div className="mt-1 space-y-1">
                              {dayActivities.slice(0, 2).map((activity) => (
                                <div
                                  key={activity.id}
                                  className={`w-full h-1.5 rounded-full ${activity.color}`}
                                  title={`${activity.title} - ${activity.time}`}
                                />
                              ))}
                              {dayActivities.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{dayActivities.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected Day Details */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <Link to={`/itinerary-builder/${tripId}`}>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Plus className="h-5 w-5" />
                      </button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {selectedDate && getActivitiesForDate(selectedDate).map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityColorLight(activity.type)}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${activity.color} text-white`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {activity.time} • {activity.duration}
                          </div>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {activity.location}
                          </div>
                          {activity.cost && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              ₹{activity.cost}
                            </div>
                          )}
                        </div>
                        <Link to={`/itinerary-builder/${tripId}`}>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </Link>
                      </motion.div>
                    ))}

                    {selectedDate && getActivitiesForDate(selectedDate).length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No activities planned</p>
                        <Link to={`/itinerary-builder/${tripId}`}>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">
                            Add activity
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Timeline</h2>
              
              <div className="space-y-8">
                {calendarDays.map((day) => {
                  const dateStr = formatDate(day);
                  const dayActivities = getActivitiesForDate(dateStr);

                  return (
                    <motion.div
                      key={dateStr}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 w-24">
                          <div className="text-lg font-semibold text-gray-900">
                            Day {calendarDays.indexOf(day) + 1}
                          </div>
                          <div className="text-sm text-gray-600">
                            {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="flex-1 h-px bg-gray-200 ml-4" />
                      </div>

                      {dayActivities.length > 0 ? (
                        <div className="ml-8 space-y-4">
                          {dayActivities.map((activity, index) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-4 relative"
                            >
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${activity.color}`}>
                                  {getActivityIcon(activity.type)}
                                </div>
                                {index < dayActivities.length - 1 && (
                                  <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                                )}
                              </div>
                              <div className={`flex-1 rounded-lg p-4 border ${getActivityColorLight(activity.type)}`}>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {activity.time} • {activity.duration}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      {activity.location}
                                    </div>
                                    {activity.notes && (
                                      <p className="text-sm text-gray-600 mt-2 italic">{activity.notes}</p>
                                    )}
                                    {activity.cost && (
                                      <div className="text-sm text-green-600 font-medium mt-1">
                                        Cost: ₹{activity.cost}
                                      </div>
                                    )}
                                  </div>
                                  <Link to={`/itinerary-builder/${tripId}`}>
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <Edit3 className="h-4 w-4" />
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-8 text-center py-8 bg-gray-50 rounded-lg">
                          <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Free day - no activities planned</p>
                          <Link to={`/itinerary-builder/${tripId}`}>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">
                              Add activity
                            </button>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TripCalendar;