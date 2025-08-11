import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Plus, Edit3 } from 'lucide-react';

const TripCalendar: React.FC = () => {
  const { tripId } = useParams();
  const [selectedDate, setSelectedDate] = useState('2024-06-15');
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  const tripDates = {
    start: '2024-06-15',
    end: '2024-06-30'
  };

  const activities = [
    {
      id: '1',
      date: '2024-06-15',
      time: '10:00',
      title: 'Arrive at Charles de Gaulle Airport',
      location: 'CDG Airport, Paris',
      duration: '1 hour',
      type: 'transport',
      color: 'bg-green-500'
    },
    {
      id: '2',
      date: '2024-06-15',
      time: '14:00',
      title: 'Check-in at Hotel Le Marais',
      location: '12 Rue des Archives, Paris',
      duration: '30 minutes',
      type: 'hotel',
      color: 'bg-purple-500'
    },
    {
      id: '3',
      date: '2024-06-15',
      time: '16:00',
      title: 'Visit Notre-Dame Cathedral',
      location: 'Île de la Cité, Paris',
      duration: '2 hours',
      type: 'attraction',
      color: 'bg-blue-500'
    },
    {
      id: '4',
      date: '2024-06-16',
      time: '09:00',
      title: 'Visit Louvre Museum',
      location: 'Rue de Rivoli, Paris',
      duration: '4 hours',
      type: 'attraction',
      color: 'bg-blue-500'
    },
    {
      id: '5',
      date: '2024-06-16',
      time: '13:30',
      title: 'Lunch at Café de Flore',
      location: '172 Boulevard Saint-Germain, Paris',
      duration: '1.5 hours',
      type: 'restaurant',
      color: 'bg-orange-500'
    },
    {
      id: '6',
      date: '2024-06-17',
      time: '10:00',
      title: 'Visit Eiffel Tower',
      location: 'Champ de Mars, Paris',
      duration: '3 hours',
      type: 'attraction',
      color: 'bg-blue-500'
    }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const start = new Date(tripDates.start);
    const end = new Date(tripDates.end);
    const days = [];
    
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getActivitiesForDate = (date: string) => {
    return activities.filter(activity => activity.date === date);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: string) => {
    return date === new Date().toISOString().split('T')[0];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'transport': return '✈️';
      default: return '📍';
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Calendar</h1>
            <p className="text-gray-600">Visual timeline of your travel itinerary</p>
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
                      June 2024
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
                    {Array.from({ length: new Date(tripDates.start).getDay() }, (_, i) => (
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
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {getActivitiesForDate(selectedDate).map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
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
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}

                    {getActivitiesForDate(selectedDate).length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No activities planned</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2">
                          Add activity
                        </button>
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
                              <div className="flex-1 bg-gray-50 rounded-lg p-4">
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
                                  </div>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-8 text-center py-8 bg-gray-50 rounded-lg">
                          <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Free day - no activities planned</p>
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