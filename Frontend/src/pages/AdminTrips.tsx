import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Search, Filter, TrendingUp, Calendar, MapPin, Users, DollarSign, Trash2 } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

interface Trip {
  _id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const AdminTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; tripId: string; tripTitle: string } | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      console.log('🔍 Fetching trips...');
      const response = await api.get('/api/admin/trips') as any;
      console.log('✅ Trips response:', response);
      setTrips(response.trips || []);
    } catch (error) {
      console.error('❌ Error fetching trips:', error);
      showToast('error', 'Error', 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const updateTripStatus = async (tripId: string, newStatus: string) => {
    try {
      await api.put(`/api/admin/trips/${tripId}/status`, { status: newStatus });
      showToast('success', 'Success', 'Trip status updated successfully');
      fetchTrips();
    } catch (error) {
      console.error('Error updating trip status:', error);
      showToast('error', 'Error', 'Failed to update trip status');
    }
  };

  const deleteTrip = async (tripId: string, tripTitle: string) => {
    setDeleteConfirm({ show: true, tripId, tripTitle });
  };

  const confirmDeleteTrip = async () => {
    if (!deleteConfirm) return;

    try {
      await api.delete(`/api/admin/trips/${deleteConfirm.tripId}`);
      showToast('success', 'Success', `Trip "${deleteConfirm.tripTitle}" deleted successfully`);
      fetchTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      showToast('error', 'Error', 'Failed to delete trip');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const cancelDeleteTrip = () => {
    setDeleteConfirm(null);
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.userId.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
  const averageBudget = trips.length > 0 ? totalBudget / trips.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trips...</p>
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
              <Plane className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trip Analytics</h1>
              <p className="text-gray-600">Monitor and manage user trips and travel data</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-3d">
              <div className="text-2xl font-bold text-purple-600">{trips.length}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-3d">
              <div className="text-2xl font-bold text-green-600">
                ₹{totalBudget.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Budget</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-3d">
              <div className="text-2xl font-bold text-blue-600">
                ₹{averageBudget.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Average Budget</div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-3d">
              <div className="text-2xl font-bold text-indigo-600">
                {trips.filter(t => t.status === 'ongoing').length}
              </div>
              <div className="text-sm text-gray-600">Active Trips</div>
            </div>
          </div>
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
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <button
              onClick={fetchTrips}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-3d-lg transform hover:scale-105 transition-all duration-300"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Trips Table */}
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
                  <th className="px-6 py-4 text-left">Trip</th>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Destination</th>
                  <th className="px-6 py-4 text-left">Dates</th>
                  <th className="px-6 py-4 text-left">Budget</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTrips.map((trip, index) => (
                  <motion.tr
                    key={trip._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{trip.title}</div>
                          <div className="text-sm text-gray-600">
                            Created {new Date(trip.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{trip.userId.name}</div>
                        <div className="text-sm text-gray-600">{trip.userId.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{trip.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="text-sm">
                          <div>{new Date(trip.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">to</div>
                          <div>{new Date(trip.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-gray-900">
                          ₹{trip.budget?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <select
                          value={trip.status}
                          onChange={(e) => updateTripStatus(trip._id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="planning">Planning</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => deleteTrip(trip._id, trip.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Trip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTrips.length === 0 && (
            <div className="text-center py-12">
              <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No trips found matching your criteria</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={cancelDeleteTrip}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-3d-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Trip</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete trip <strong>"{deleteConfirm.tripTitle}"</strong>? 
              This action cannot be undone and will also delete all associated itineraries, budgets, and expenses.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteTrip}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTrip}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete Trip
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminTrips;
