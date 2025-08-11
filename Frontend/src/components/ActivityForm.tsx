import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, DollarSign, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/api';

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: any) => void;
  dayDate: string;
  tripId: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ isOpen, onClose, onSave, dayDate, tripId }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    type: 'attraction',
    time: '12:00',
    location: '',
    duration: '1 hour',
    notes: '',
    cost: '',
    expenseCategory: 'activities'
  });
  const [loading, setLoading] = useState(false);

  const activityTypes = [
    { value: 'attraction', label: 'Attraction', icon: '🏛️' },
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'transport', label: 'Transport', icon: '✈️' },
    { value: 'activity', label: 'Activity', icon: '🎯' }
  ];

  const expenseCategories = [
    { value: 'activities', label: 'Activities', icon: '🎯' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { value: 'Food&Dining', label: 'Food & Dining', icon: '🍽️' },
    { value: 'flights', label: 'Flights', icon: '✈️' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' }
  ];

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showToast('error', 'Error', 'Please enter an activity title');
      return;
    }

    setLoading(true);
    
    try {
      // Create the activity object
      const activity = {
        id: Date.now().toString(),
        title: formData.title,
        type: formData.type,
        time: formData.time,
        location: formData.location,
        duration: formData.duration,
        notes: formData.notes,
        cost: formData.cost ? parseFloat(formData.cost) : 0
      };

      // If cost is provided, create an expense record
      if (formData.cost && parseFloat(formData.cost) > 0) {
        try {
          await api.post(`/api/expenses/${tripId}`, {
            category: formData.expenseCategory,
            amount: parseFloat(formData.cost),
            description: formData.title,
            date: dayDate,
            location: formData.location,
            notes: `Activity: ${formData.title}`
          });
        } catch (error) {
          console.error('Error saving expense:', error);
          // Continue with activity creation even if expense fails
        }
      }

      onSave(activity);
      setFormData({
        title: '',
        type: 'attraction',
        time: '12:00',
        location: '',
        duration: '1 hour',
        notes: '',
        cost: '',
        expenseCategory: 'activities'
      });
      onClose();
    } catch (error) {
      console.error('Error adding activity:', error);
      showToast('error', 'Error', 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: 'attraction',
      time: '12:00',
      location: '',
      duration: '1 hour',
      notes: '',
      cost: '',
      expenseCategory: 'activities'
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add Activity</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Activity Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Visit Eiffel Tower"
                  required
                />
              </div>

              {/* Activity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2 hours"
                  />
                </div>
              </div>

                             {/* Location */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   <MapPin className="h-4 w-4 inline mr-1" />
                   Location
                 </label>
                 <input
                   type="text"
                   value={formData.location}
                   onChange={(e) => handleLocationChange(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Enter location (e.g., Eiffel Tower, Paris)"
                 />
               </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes about this activity..."
                />
              </div>

              {/* Expense Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Expense Tracking
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.expenseCategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, expenseCategory: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {expenseCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ActivityForm;
