import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, Clock, MapPin, Trash2, Edit3, Save, Calendar, ArrowRight, Search } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import ActivityForm from '../components/ActivityForm';

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
  activities: Activity[];
}

interface City {
  _id: string;
  name: string;
  country: string;
  costIndex?: number;
  popularityScore?: number;
}

const ItineraryBuilder: React.FC = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedDay, setSelectedDay] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const [itinerary, setItinerary] = useState<Day[]>([]);

  // Fetch cities for selection
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await api.get('/api/cities/popular/list?limit=20') as City[];
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  // Fetch trip data and generate itinerary days
  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) return;
      
      try {
        setLoading(true);
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
                    id: item._id, // Use itinerary item ID for deletion
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

    fetchTripData();
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

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'attraction': return 'bg-blue-100 border-blue-200';
      case 'restaurant': return 'bg-orange-100 border-orange-200';
      case 'hotel': return 'bg-purple-100 border-purple-200';
      case 'transport': return 'bg-green-100 border-green-200';
      case 'activity': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const updateActivities = (dayIndex: number, newActivities: Activity[]) => {
    setItinerary(prev => {
      const updated = prev.map((day, index) => 
      index === dayIndex ? { ...day, activities: newActivities } : day
      );
      return updated;
    });
  };

  const addActivity = () => {
    if (!selectedCity) {
      setShowCitySelector(true);
      return;
    }
    setShowActivityForm(true);
  };

  const handleActivitySave = async (activityData: Activity) => {
    if (selectedDay >= 0 && selectedDay < itinerary.length && selectedCity) {
      try {
        // First, create the activity in the Activity table
        const activityResponse = await api.post('/api/activities', {
          cityId: selectedCity._id,
          name: activityData.title,
          type: activityData.type,
          cost: activityData.cost || 0,
          duration: parseInt(activityData.duration) || 60,
          description: activityData.notes || '',
          imageUrl: ''
        }) as any;

        // Then, create the itinerary entry linking to the activity
        const itineraryResponse = await api.post('/api/itinerary', {
          tripId,
          cityId: selectedCity._id,
          date: itinerary[selectedDay].date,
          activityId: activityResponse._id,
          orderIndex: itinerary[selectedDay].activities.length,
          notes: activityData.notes || ''
        }) as any;

        // Update local state with the new activity
        const newActivity = {
          id: itineraryResponse._id, // Use itinerary item ID for deletion
          title: activityData.title,
          type: activityData.type,
          time: activityData.time,
          location: selectedCity.name,
          duration: activityData.duration,
          notes: activityData.notes,
          cost: activityData.cost
        };

        const updatedActivities = [...itinerary[selectedDay].activities, newActivity];
        updateActivities(selectedDay, updatedActivities);
        
        setShowActivityForm(false);
        showToast('success', 'Activity Added!', 'Activity has been added to your itinerary.');
      } catch (error) {
        console.error('Error saving activity to database:', error);
        showToast('error', 'Error', 'Failed to save activity to database');
      }
    } else {
      showToast('error', 'Error', 'Please select a city first');
    }
  };

  const removeActivity = async (activityId: string) => {
    try {
      // Delete from database using the itinerary item ID
      await api.delete(`/api/itinerary/${activityId}`);
      
      // Update local state
      const updatedActivities = itinerary[selectedDay].activities.filter(
        activity => activity.id !== activityId
      );
      updateActivities(selectedDay, updatedActivities);
      showToast('success', 'Activity Removed', 'Activity has been removed from your itinerary.');
    } catch (error) {
      console.error('Error removing activity:', error);
      showToast('error', 'Error', 'Failed to remove activity');
    }
  };

  const saveItinerary = async () => {
    if (!tripId) return;
    
    try {
      setSaving(true);
      showToast('success', 'Itinerary Saved!', 'Your itinerary has been saved successfully.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving itinerary:', error);
      showToast('error', 'Error', 'Failed to save itinerary');
    } finally {
      setSaving(false);
    }
  };

  const searchCities = async (query: string) => {
    if (query.length < 2) return;
    
    try {
      const searchResults = await api.get(`/api/cities?q=${encodeURIComponent(query)}&limit=10`) as City[];
      setCities(searchResults);
    } catch (error) {
      console.error('Error searching cities:', error);
    }
  };

  const selectCity = (city: City) => {
    setSelectedCity(city);
    setShowCitySelector(false);
    setCitySearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Itinerary Builder</h1>
            <p className="text-gray-600">
              {tripData.title} - {tripData.destination}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
            </p>
            {selectedCity && (
              <p className="text-sm text-blue-600 mt-1">
                Selected City: {selectedCity.name}, {selectedCity.country}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <>
                <motion.button
                  onClick={saveItinerary}
                  disabled={saving}
                  className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Itinerary'}
                </motion.button>
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Mode
              </motion.button>
            )}
            <Link
              to={`/trip-calendar/${tripId}`}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Link>
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
                  <div className="flex items-center space-x-2">
                    {!selectedCity && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCitySelector(true)}
                        className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Select City
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addActivity}
                      disabled={!selectedCity}
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </motion.button>
                  </div>
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
                                {activity.cost && (
                                  <p className="text-sm text-green-600 mt-1 font-medium">
                                    Cost: ₹{activity.cost}
                                  </p>
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
                    <div className="space-y-2">
                      {!selectedCity && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowCitySelector(true)}
                          className="inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 mr-2"
                        >
                          <MapPin className="h-5 w-5 mr-2" />
                          Select City First
                        </motion.button>
                      )}
                      {selectedCity && (
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
                    </div>
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

      {/* City Selector Modal */}
      <AnimatePresence>
        {showCitySelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Select City</h2>
                <button
                  onClick={() => setShowCitySelector(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => {
                      setCitySearchQuery(e.target.value);
                      searchCities(e.target.value);
                    }}
                    placeholder="Search cities..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <motion.button
                    key={city._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectCity(city)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-600">{city.country}</div>
                    {city.popularityScore && (
                      <div className="text-xs text-blue-600 mt-1">
                        Popularity: {city.popularityScore}/100
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Form Modal */}
      <ActivityForm
        isOpen={showActivityForm}
        onClose={() => setShowActivityForm(false)}
        onSave={handleActivitySave}
        dayDate={itinerary[selectedDay]?.date || ''}
        tripId={tripId || ''}
      />
    </div>
  );
};

export default ItineraryBuilder;