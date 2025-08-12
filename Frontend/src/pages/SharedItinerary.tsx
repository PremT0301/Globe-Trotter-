import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, MapPin, Calendar, Users, Clock, Copy, Check } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
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

interface TripData {
  _id: string;
  title: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  travelers: number;
  tripType: string;
  coverPhoto?: string;
  createdBy: {
    name: string;
    profilePhoto?: string;
  };
}

const SharedItinerary: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itinerary, setItinerary] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCloning, setIsCloning] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);

  // Debug slug parameter
  useEffect(() => {
    console.log('SharedItinerary component mounted with slug:', slug);
    if (!slug) {
      setError('No trip slug provided');
      setLoading(false);
    }
  }, [slug]);

  // Test backend connectivity
  const testBackendConnection = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      console.log('Testing backend connection to:', baseUrl);
      
      const response = await fetch(`${baseUrl}/health`);
      console.log('Backend health check response:', response.status, response.statusText);
      
      if (response.ok) {
        const healthData = await response.json();
        console.log('Backend health data:', healthData);
        return true;
      } else {
        console.error('Backend health check failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchSharedTrip = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching shared trip with slug:', slug);
        
        // Test backend connectivity first
        const backendConnected = await testBackendConnection();
        if (!backendConnected) {
          throw new Error('Backend server is not accessible. Please check if the backend is running on port 4000.');
        }
        
        // Construct the API URL
        const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/shared/u/${slug}`;
        console.log('🌐 API URL:', apiUrl);
        
        // Fetch shared trip data without authentication
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Response error text:', errorText);
          
          if (response.status === 404) {
            throw new Error(`Shared trip not found. The trip with slug "${slug}" may not exist or may have been deleted.`);
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
          }
        }
        
        const data = await response.json();
        console.log('✅ API Response data:', data);
        console.log('✅ Trip data:', data.trip);
        console.log('✅ Itineraries data:', data.itineraries);
        console.log('✅ Budget data:', data.budget);
        
        if (!data || !data.trip) {
          throw new Error('Invalid response format: missing trip data');
        }
        
        const { trip, itineraries: itineraryData } = data;
        
        console.log('📅 Trip dates:', { startDate: trip.startDate, endDate: trip.endDate });
        console.log('🎯 Trip destination:', trip.destination);
        
        setTripData(trip);
        
        // Generate dynamic day names based on actual dates
        const generatedItinerary = generateItineraryDays(trip.startDate, trip.endDate, itineraryData || [], trip.destination);
        console.log('📋 Generated itinerary:', generatedItinerary);
        setItinerary(generatedItinerary);
        
        // If no itinerary data, create empty days for the trip duration
        if (!itineraryData || itineraryData.length === 0) {
          console.log('⚠️ No itinerary data found, creating empty days');
          const emptyItinerary = generateEmptyItineraryDays(trip.startDate, trip.endDate, trip.destination);
          setItinerary(emptyItinerary);
        }
        
      } catch (error) {
        console.error('❌ Error fetching shared trip:', error);
        let errorMessage = 'Unknown error occurred';
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to connect to the server. Please check if the backend is running.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(`Failed to load shared trip: ${errorMessage}`);
        showToast('error', 'Error', `Failed to load shared trip: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTrip();
  }, [slug, showToast]);

  const generateItineraryDays = (startDate: string, endDate: string, itineraryData: any[], destination: string): Day[] => {
    console.log('🔧 Generating itinerary days with:', { startDate, endDate, itineraryData, destination });
    console.log('📊 Itinerary data length:', itineraryData.length);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: Day[] = [];
    
    console.log('📅 Date range:', { start: start.toISOString(), end: end.toISOString() });
    
    const currentDate = new Date(start);
    let dayIndex = 1;
    
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      console.log(`📆 Processing day ${dayIndex} for date: ${dateString}`);
      
      // Find activities for this date
      const dayActivities = itineraryData
        .filter(item => {
          const itemDate = new Date(item.date).toISOString().split('T')[0];
          const matches = itemDate === dateString;
          console.log(`🔍 Checking item date ${itemDate} vs ${dateString}: ${matches}`);
          return matches;
        })
        .map(item => {
          console.log('🎯 Processing itinerary item:', item);
          const processedItem = {
            id: item._id,
            title: item.activity?.name || item.activityId?.name || item.title || 'Activity',
            time: item.time || '12:00',
            location: item.city?.name || item.cityId?.name || item.location || 'Location',
            type: item.activity?.type || item.activityId?.type || item.type || 'activity',
            duration: item.activity?.duration ? `${item.activity.duration} minutes` : item.duration || '1 hour',
            notes: item.notes,
            cost: item.activity?.cost || item.activityId?.cost || item.cost
          };
          console.log('✅ Processed item:', processedItem);
          return processedItem;
        });

      console.log(`📋 Day ${dayIndex} activities:`, dayActivities);

      // Generate dynamic day name
      const dayName = generateDayName(currentDate, dayIndex, destination);
      console.log(`🏷️ Generated day name: ${dayName}`);
      
      days.push({
        id: dayIndex.toString(),
        date: dateString,
        dayName,
        activities: dayActivities
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
      dayIndex++;
    }
    
    console.log('🎉 Final generated days:', days);
    return days;
  };

  const generateEmptyItineraryDays = (startDate: string, endDate: string, destination: string): Day[] => {
    console.log('Generating empty itinerary days for:', { startDate, endDate, destination });
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: Day[] = [];
    const currentDate = new Date(start);
    let dayIndex = 1;

    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      const dayName = generateDayName(currentDate, dayIndex, destination);
      days.push({
        id: dayIndex.toString(),
        date: dateString,
        dayName,
        activities: []
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayIndex++;
    }
    return days;
  };

  const generateDayName = (date: Date, dayNumber: number, destination: string): string => {
    const dayNames = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ];
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    const dayOfMonth = date.getDate();
    
    // Create descriptive day names based on the day number and destination
    let description = '';
    if (dayNumber === 1) {
      description = `Arrival in ${destination}`;
    } else if (dayNumber === 2) {
      description = `${destination} Exploration`;
    } else {
      description = `${destination} Adventure`;
    }
    
    return `${dayName}, ${monthName} ${dayOfMonth} - ${description}`;
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

  const handleCloneTrip = async () => {
    if (!slug) return;
    
    setIsCloning(true);
    try {
      const response = await api.post(`/api/shared/clone/${slug}`);
      setCloneSuccess(true);
      showToast('success', 'Trip Cloned!', 'Trip has been cloned to your account successfully!');
      setTimeout(() => {
        navigate('/my-trips');
      }, 2000);
    } catch (error: any) {
      console.error('Error cloning trip:', error);
      const errorMessage = error.message || 'Failed to clone trip. Please try again.';
      showToast('error', 'Error', errorMessage);
    } finally {
      setIsCloning(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-blue-600 to-purple-600">
        <div
          className="absolute inset-0 bg-cover bg-center bg-blend-overlay"
          style={{ backgroundImage: `url(${tripData?.coverPhoto || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1'})` }}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{tripData?.title || 'Loading...'}</h1>
            <p className="text-xl mb-4">{tripData?.description || ''}</p>
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {tripData?.destination || 'Loading...'}
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {tripData?.startDate && tripData?.endDate ? `${new Date(tripData.startDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })} - ${new Date(tripData.endDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}` : 'Loading...'}
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {tripData?.travelers || 0} travelers
              </div>
            </div>
            <p className="text-sm mt-4 opacity-75">Created by {tripData?.createdBy?.name || 'Loading...'}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Clone Trip Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                         <div>
               <h2 className="text-lg font-semibold text-gray-900 mb-2">Want to use this itinerary?</h2>
               <p className="text-gray-600">
                 {isAuthenticated 
                   ? 'Clone this trip to your account and customize dates, activities, and details for your own adventure'
                   : 'Sign in to clone this trip to your account and customize dates, activities, and details for your own adventure'
                 }
               </p>
             </div>
            
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloneTrip}
                disabled={isCloning}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  cloneSuccess 
                    ? 'bg-green-500 text-white cursor-default'
                    : isCloning
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                                 {cloneSuccess ? (
                   <>
                     <Check className="h-5 w-5 mr-2" />
                     Cloned! Redirecting...
                   </>
                 ) : isCloning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500 mr-2"></div>
                    Cloning...
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Clone to My Trips
                  </>
                )}
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
                         )}
           </div>
           {isAuthenticated && (
             <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
               <p className="text-sm text-blue-700">
                 💡 <strong>Tip:</strong> The cloned trip will be saved as a draft. You can edit dates, modify activities, and customize all details in your My Trips page.
               </p>
             </div>
           )}
         </motion.div>

        {/* Itinerary Content */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
              <p>Loading itinerary...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Shared Trip Not Found</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              
              {/* Helpful guidance for users */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
                <h4 className="font-semibold text-blue-900 mb-3">How to Share a Trip:</h4>
                <ol className="text-left text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <span>Go to <strong>My Trips</strong> and select a trip you want to share</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <span>Click <strong>View Itinerary</strong> to open the trip details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <span>Click the <strong>Share Trip</strong> button to generate a shareable link</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    <span>Copy the generated link and share it with others</span>
                  </li>
                </ol>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/my-trips"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Go to My Trips
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Return Home
                </Link>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p className="font-semibold mb-2">Troubleshooting:</p>
                <ul className="text-left space-y-1">
                  <li>• Check if the backend server is running on port 4000</li>
                  <li>• Verify the trip URL is correct</li>
                  <li>• Make sure the trip has been shared before accessing the link</li>
                  <li>• Check the browser console for detailed error messages</li>
                </ul>
              </div>
            </div>
          ) : itinerary.length === 0 ? (
            <div className="text-center py-12">
              <p>No itinerary data available for this trip.</p>
            </div>
          ) : (
            itinerary.map((day, dayIndex) => (
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
                    {day.activities.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No activities planned for this day</p>
                      </div>
                    ) : (
                      day.activities.map((activity, index) => (
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
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
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