import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, HardDrive, Server, Activity, Users, Plane, Settings, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface DatabaseStats {
  collections: {
    users: number;
    trips: number;
    activities: number;
    cities: number;
    expenses: number;
    itineraries: number;
  };
  storage: {
    total: number;
    used: number;
    available: number;
  };
  performance: {
    avgResponseTime: number;
    activeConnections: number;
    queriesPerSecond: number;
  };
  health: {
    status: 'healthy' | 'warning' | 'error';
    lastBackup: string;
    uptime: number;
  };
}

const AdminDatabase: React.FC = () => {
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/api/admin/database') as any;
      setDbStats(response);
    } catch (error) {
      console.error('Error fetching database stats:', error);
      showToast('error', 'Error', 'Failed to fetch database statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'error': return <AlertTriangle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading database statistics...</p>
        </div>
      </div>
    );
  }

  if (!dbStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No database statistics available</p>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-3d">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Database Management</h1>
                <p className="text-gray-600">Monitor database performance and health</p>
              </div>
            </div>
            <button
              onClick={fetchDatabaseStats}
              disabled={refreshing}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-3d-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </motion.div>

        {/* Database Health */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Database Health</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthColor(dbStats.health.status)}`}>
                {dbStats.health.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{dbStats.health.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">{formatUptime(dbStats.health.uptime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Backup:</span>
                <span className="font-medium">{new Date(dbStats.health.lastBackup).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span className="font-medium">{dbStats.performance.avgResponseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Connections:</span>
                <span className="font-medium">{dbStats.performance.activeConnections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Queries/sec:</span>
                <span className="font-medium">{dbStats.performance.queriesPerSecond}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-3d">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <HardDrive className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Storage</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Used:</span>
                <span className="font-medium">{formatBytes(dbStats.storage.used)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium">{formatBytes(dbStats.storage.available)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{formatBytes(dbStats.storage.total)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                  style={{ width: `${(dbStats.storage.used / dbStats.storage.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Collection Statistics */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-3d mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Collection Statistics</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{dbStats.collections.users}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{dbStats.collections.trips}</div>
              <div className="text-sm text-gray-600">Trips</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600">{dbStats.collections.activities}</div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Server className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{dbStats.collections.cities}</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <HardDrive className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-pink-600">{dbStats.collections.expenses}</div>
              <div className="text-sm text-gray-600">Expenses</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-indigo-600">{dbStats.collections.itineraries}</div>
              <div className="text-sm text-gray-600">Itineraries</div>
            </div>
          </div>
        </motion.div>

        {/* Database Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-3d"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Database Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-center">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-3">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Backup Database</h3>
              <p className="text-sm text-gray-600">Create a backup of all data</p>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-center">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-3">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Optimize Database</h3>
              <p className="text-sm text-gray-600">Optimize performance and indexes</p>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 text-center">
              <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Health Check</h3>
              <p className="text-sm text-gray-600">Run comprehensive health check</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDatabase;
