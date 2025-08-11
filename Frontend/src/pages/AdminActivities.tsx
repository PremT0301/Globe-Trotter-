import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Search, Filter, TrendingUp, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface ActivityData {
  _id: string;
  name: string;
  type: string;
  cost: number;
  duration: number;
  cityId: {
    _id: string;
    name: string;
    country: string;
  };
  createdAt: string;
  usageCount?: number;
}

const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { showToast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      console.log('🔍 Fetching activities...');
      const response = await api.get('/api/admin/activities') as any;
      console.log('✅ Activities response:', response);
      setActivities(response.activities || []);
    } catch (error) {
      console.error('❌ Error fetching activities:', error);
      showToast('error', 'Error', 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    // Add null checks for all properties
    if (!activity) return false;
    
    const activityName = activity.name || '';
    const cityName = activity.cityId?.name || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = activityName.toLowerCase().includes(searchLower) ||
                         cityName.toLowerCase().includes(searchLower);
    const matchesType = filterType === 'all' || activity.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    
    switch (type.toLowerCase()) {
      case 'attraction': return 'bg-blue-100 text-blue-800';
      case 'restaurant': return 'bg-green-100 text-green-800';
      case 'hotel': return 'bg-purple-100 text-purple-800';
      case 'transport': return 'bg-orange-100 text-orange-800';
      case 'activity': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalCost = activities.reduce((sum, activity) => {
    const cost = typeof activity?.cost === 'number' ? activity.cost : 0;
    return sum + cost;
  }, 0);
  const averageCost = activities.length > 0 ? totalCost / activities.length : 0;
  const totalDuration = activities.reduce((sum, activity) => sum + (activity?.duration || 0), 0);
  const averageDuration = activities.length > 0 ? totalDuration / activities.length : 0;
  
  // Additional statistics
  const activityTypes = activities.reduce((acc, activity) => {
    const type = activity?.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostPopularType = Object.entries(activityTypes).sort(([,a], [,b]) => b - a)[0];
  const totalUsage = activities.reduce((sum, activity) => sum + (activity?.usageCount || 0), 0);
  const averageUsage = activities.length > 0 ? totalUsage / activities.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-3d">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity Statistics</h1>
              <p className="text-gray-600">Monitor and analyze activity data across the platform</p>
            </div>
          </div>
          
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600 mb-1">Total Activities</p>
                   <p className="text-3xl font-bold text-purple-600">{activities.length}</p>
                 </div>
                 <div className="p-3 bg-purple-100 rounded-lg">
                   <Activity className="h-6 w-6 text-purple-600" />
                 </div>
               </div>
               <div className="mt-4 pt-4 border-t border-gray-100">
                 <p className="text-xs text-gray-500">All platform activities</p>
               </div>
             </div>
             
             <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
               <div className="flex items-center justify-between">
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-gray-600 mb-1">Total Cost</p>
                   <p className="text-2xl font-bold text-green-600 truncate">
                     ₹{totalCost.toLocaleString()}
                   </p>
                 </div>
                 <div className="p-3 bg-green-100 rounded-lg flex-shrink-0 ml-4">
                   <DollarSign className="h-6 w-6 text-green-600" />
                 </div>
               </div>
               <div className="mt-4 pt-4 border-t border-gray-100">
                 <p className="text-xs text-gray-500">Combined activity costs</p>
               </div>
             </div>
             
             <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
               <div className="flex items-center justify-between">
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-gray-600 mb-1">Average Cost</p>
                   <p className="text-2xl font-bold text-blue-600 truncate">
                     ₹{averageCost.toLocaleString()}
                   </p>
                 </div>
                 <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-4">
                   <TrendingUp className="h-6 w-6 text-blue-600" />
                 </div>
               </div>
               <div className="mt-4 pt-4 border-t border-gray-100">
                 <p className="text-xs text-gray-500">Per activity average</p>
               </div>
             </div>
             
             <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600 mb-1">Avg Duration</p>
                   <p className="text-3xl font-bold text-indigo-600">
                     {Math.round(averageDuration)} min
                   </p>
                 </div>
                 <div className="p-3 bg-indigo-100 rounded-lg">
                   <Clock className="h-6 w-6 text-indigo-600" />
                 </div>
               </div>
               <div className="mt-4 pt-4 border-t border-gray-100">
                 <p className="text-xs text-gray-500">Average time per activity</p>
               </div>
                          </div>
           </div>
           
           {/* Additional Statistics Row */}
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="mt-6"
           >
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-600 mb-1">Most Popular Type</p>
                     <p className="text-2xl font-bold text-orange-600 capitalize">
                       {mostPopularType ? mostPopularType[0] : 'N/A'}
                     </p>
                     <p className="text-sm text-gray-500 mt-1">
                       {mostPopularType ? `${mostPopularType[1]} activities` : 'No data'}
                     </p>
                   </div>
                   <div className="p-3 bg-orange-100 rounded-lg">
                     <Star className="h-6 w-6 text-orange-600" />
                   </div>
                 </div>
               </div>
               
               <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-600 mb-1">Total Usage</p>
                     <p className="text-2xl font-bold text-pink-600">
                       {totalUsage.toLocaleString()}
                     </p>
                     <p className="text-sm text-gray-500 mt-1">
                       Times activities were used
                     </p>
                   </div>
                   <div className="p-3 bg-pink-100 rounded-lg">
                     <TrendingUp className="h-6 w-6 text-pink-600" />
                   </div>
                 </div>
               </div>
               
               <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-600 mb-1">Avg Usage</p>
                     <p className="text-2xl font-bold text-teal-600">
                       {Math.round(averageUsage)}
                     </p>
                     <p className="text-sm text-gray-500 mt-1">
                       Per activity average
                     </p>
                   </div>
                   <div className="p-3 bg-teal-100 rounded-lg">
                     <Activity className="h-6 w-6 text-teal-600" />
                   </div>
                 </div>
               </div>
             </div>
           </motion.div>
         </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-3d mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="attraction">Attraction</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="transport">Transport</option>
              <option value="activity">Activity</option>
            </select>
            
            <button
              onClick={fetchActivities}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-3d-lg transform hover:scale-105 transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Activities Table */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-3d overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Activity</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Cost</th>
                  <th className="px-6 py-4 text-left">Duration</th>
                  <th className="px-6 py-4 text-left">Usage</th>
                  <th className="px-6 py-4 text-left">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredActivities.map((activity, index) => (
                  <motion.tr
                    key={activity._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{activity.name || 'Unnamed Activity'}</div>
                          <div className="text-sm text-gray-600">ID: {activity._id?.slice(-8) || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                                         <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type || 'unknown')}`}>
                         {activity.type || 'Unknown'}
                       </span>
                     </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-gray-900">{activity.cityId?.name || 'Unknown City'}</div>
                          <div className="text-sm text-gray-600">{activity.cityId?.country || 'Unknown Country'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-gray-900">
                          ₹{activity.cost?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-900">{activity.duration || 0} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-900">{activity.usageCount || 0}</span>
                      </div>
                    </td>
                                         <td className="px-6 py-4 text-sm text-gray-600">
                       {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'N/A'}
                     </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activities found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminActivities;
