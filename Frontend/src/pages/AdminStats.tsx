import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Plane, Activity, DollarSign, Calendar, BarChart3, PieChart, MapPin } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalTrips: number;
  activeTrips: number;
  totalActivities: number;
  totalBudget: number;
  averageBudget: number;
  monthlyGrowth: {
    users: number;
    trips: number;
    activities: number;
  };
  topDestinations: Array<{
    destination: string;
    count: number;
  }>;
  popularActivities: Array<{
    type: string;
    count: number;
  }>;
}

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/stats') as any;
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      showToast('error', 'Error', 'Failed to fetch system statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No statistics available</p>
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
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Statistics</h1>
              <p className="text-gray-600">Comprehensive analytics and platform insights</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
                <p className="text-sm text-green-600">+{stats.monthlyGrowth.users}% this month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalTrips}</p>
                <p className="text-sm text-green-600">+{stats.monthlyGrowth.trips}% this month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalActivities}</p>
                <p className="text-sm text-green-600">+{stats.monthlyGrowth.activities}% this month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-3xl font-bold text-indigo-600">₹{stats.totalBudget.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Avg: ₹{stats.averageBudget.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Destinations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-3d"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Top Destinations</h2>
            </div>
            
            <div className="space-y-4">
              {stats.topDestinations.map((destination, index) => (
                <div key={destination.destination} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{destination.destination}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                        style={{ width: `${(destination.count / Math.max(...stats.topDestinations.map(d => d.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{destination.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Popular Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-3d"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Popular Activities</h2>
            </div>
            
            <div className="space-y-4">
              {stats.popularActivities.map((activity, index) => (
                <div key={activity.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900 capitalize">{activity.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(activity.count / Math.max(...stats.popularActivities.map(a => a.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{activity.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
            <p className="text-sm text-gray-600">Currently active</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Active Trips</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.activeTrips}</p>
            <p className="text-sm text-gray-600">Currently ongoing</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round((stats.monthlyGrowth.users + stats.monthlyGrowth.trips + stats.monthlyGrowth.activities) / 3)}%
            </p>
            <p className="text-sm text-gray-600">Average monthly growth</p>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={fetchStats}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-3d-lg transform hover:scale-105 transition-all duration-300"
          >
            Refresh Statistics
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminStats;
