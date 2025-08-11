import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, Clock, MapPin, Trash2, Edit3, Save, Calendar } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport';
  duration: string;
  notes?: string;
}

interface Day {
  id: string;
  date: string;
  activities: Activity[];
}

const ItineraryBuilder: React.FC = () => {
  const { tripId } = useParams();
  const [selectedDay, setSelectedDay] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [itinerary, setItinerary] = useState<Day[]>([
    {
      id: '1',
      date: '2024-06-15',
      activities: [
        {
          id: '1',
          title: 'Arrive at Charles de Gaulle Airport',
          time: '10:00',
          location: 'CDG Airport, Paris',
          type: 'transport',
          duration: '1 hour',
          notes: 'Flight AF123 from NYC'
        },
        {
          id: '2',
          title: 'Check-in at Hotel Le Marais',
          time: '14:00',
          location: '12 Rue des Archives, Paris',
          type: 'hotel',
          duration: '30 minutes'
        },
        {
          id: '3',
          title: 'Visit Notre-Dame Cathedral',
          time: '16:00',
          location: 'Île de la Cité, Paris',
          type: 'attraction',
          duration: '2 hours'
        },
        {
          id: '4',
          title: 'Dinner at Le Comptoir du Relais',
          time: '19:30',
          location: '9 Carrefour de l\'Odéon, Paris',
          type: 'restaurant',
          duration: '2 hours'
        }
      ]
    },
    {
      id: '2',
      date: '2024-06-16',
      activities: [
        {
          id: '5',
          title: 'Visit Louvre Museum',
          time: '09:00',
          location: 'Rue de Rivoli, Paris',
          type: 'attraction',
          duration: '4 hours'
        },
        {
          id: '6',
          title: 'Lunch at Café de Flore',
          time: '13:30',
          location: '172 Boulevard Saint-Germain, Paris',
          type: 'restaurant',
          duration: '1.5 hours'
        },
        {
          id: '7',
          title: 'Walk along Seine River',
          time: '15:30',
          location: 'Seine Riverbank, Paris',
          type: 'attraction',
          duration: '2 hours'
        }
      ]
    },
    {
      id: '3',
      date: '2024-06-17',
      activities: [
        {
          id: '8',
          title: 'Visit Eiffel Tower',
          time: '10:00',
          location: 'Champ de Mars, Paris',
          type: 'attraction',
          duration: '3 hours'
        }
      ]
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction': return '🏛️';
      case 'restaurant': return '🍽️';
      case 'hotel': return '🏨';
      case 'transport': return '✈️';
      default: return '📍';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'attraction': return 'bg-blue-100 border-blue-200';
      case 'restaurant': return 'bg-orange-100 border-orange-200';
      case 'hotel': return 'bg-purple-100 border-purple-200';
      case 'transport': return 'bg-green-100 border-green-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const updateActivities = (dayIndex: number, newActivities: Activity[]) => {
    setItinerary(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, activities: newActivities } : day
    ));
  };

  const addActivity = () => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      title: 'New Activity',
      time: '12:00',
      location: 'Location',
      type: 'attraction',
      duration: '1 hour'
    };
    
    const updatedActivities = [...itinerary[selectedDay].activities, newActivity];
    updateActivities(selectedDay, updatedActivities);
  };

  const removeActivity = (activityId: string) => {
    const updatedActivities = itinerary[selectedDay].activities.filter(
      activity => activity.id !== activityId
    );
    updateActivities(selectedDay, updatedActivities);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Itinerary Builder</h1>
            <p className="text-gray-600">Drag and drop to organize your perfect trip</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isEditing 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Mode'}
            </button>
            <Link
              to={`/itinerary/${tripId}`}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Preview
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Day Selector */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Days</h2>
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
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <div>
                        <p className="font-medium">Day {index + 1}</p>
                        <p className="text-sm opacity-75">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs mt-1 opacity-75">
                      {day.activities.length} activities
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Activities List */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Day {selectedDay + 1} - {new Date(itinerary[selectedDay].date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h2>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addActivity}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </motion.button>
                )}
              </div>

              <Reorder.Group
                axis="y"
                values={itinerary[selectedDay].activities}
                onReorder={(newActivities) => updateActivities(selectedDay, newActivities)}
                className="space-y-4"
              >
                <AnimatePresence>
                  {itinerary[selectedDay].activities.map((activity) => (
                    <Reorder.Item
                      key={activity.id}
                      value={activity}
                      dragListener={isEditing}
                      className={`${getActivityColor(activity.type)} border-2 rounded-lg p-4 ${
                        isEditing ? 'cursor-grab active:cursor-grabbing' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        {isEditing && (
                          <GripVertical className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
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
                              </div>
                            </div>
                            
                            {isEditing && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeActivity(activity.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>

              {itinerary[selectedDay].activities.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 mb-4">
                    <Calendar className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activities planned</h3>
                  <p className="text-gray-600 mb-6">Start building your itinerary for this day</p>
                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addActivity}
                      className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add First Activity
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid md:grid-cols-4 gap-4"
        >
          <Link
            to="/city-search"
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">🏛️</div>
            <h3 className="font-medium text-gray-900">Find Attractions</h3>
            <p className="text-sm text-gray-600">Discover places to visit</p>
          </Link>
          
          <Link
            to="/activity-search"
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-medium text-gray-900">Find Activities</h3>
            <p className="text-sm text-gray-600">Explore things to do</p>
          </Link>
          
          <Link
            to={`/trip-budget/${tripId}`}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-medium text-gray-900">Manage Budget</h3>
            <p className="text-sm text-gray-600">Track expenses</p>
          </Link>
          
          <Link
            to={`/trip-calendar/${tripId}`}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-center"
          >
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-medium text-gray-900">Calendar View</h3>
            <p className="text-sm text-gray-600">Timeline overview</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ItineraryBuilder;