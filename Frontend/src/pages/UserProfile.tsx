import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, Edit3, Bell, Shield, Globe, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Travel enthusiast who loves exploring new cultures and cuisines. Always planning the next adventure!',
    avatar: user?.avatar || ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    tripReminders: true,
    currency: 'USD',
    language: 'English',
    timezone: 'America/Los_Angeles'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'preferences', name: 'Preferences', icon: <Bell className="h-5 w-5" /> },
    { id: 'privacy', name: 'Privacy', icon: <Shield className="h-5 w-5" /> },
    { id: 'account', name: 'Account', icon: <Globe className="h-5 w-5" /> }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const travelStats = [
    { label: 'Countries Visited', value: '12', icon: '🌍' },
    { label: 'Cities Explored', value: '47', icon: '🏙️' },
    { label: 'Trips Completed', value: '8', icon: '✈️' },
    { label: 'Days Traveled', value: '156', icon: '📅' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900">{profileData.name}</h3>
                <p className="text-sm text-gray-600">{profileData.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-3">{tab.name}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            {/* Travel Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 mt-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Travel Stats</h3>
              <div className="space-y-4">
                {travelStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{stat.icon}</span>
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={isSaving}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          isEditing 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        } disabled:opacity-50`}
                      >
                        {isSaving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        ) : isEditing ? (
                          <Save className="h-4 w-4 mr-2" />
                        ) : (
                          <Edit3 className="h-4 w-4 mr-2" />
                        )}
                        {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                      </motion.button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'preferences' && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                    
                    <div className="space-y-8">
                      {/* Notifications */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                        <div className="space-y-4">
                          {[
                            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                            { key: 'pushNotifications', label: 'Push Notifications', description: 'Get notifications on your device' },
                            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional content' },
                            { key: 'tripReminders', label: 'Trip Reminders', description: 'Get reminders about upcoming trips' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.label}</h4>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={preferences[item.key as keyof typeof preferences] as boolean}
                                  onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Regional Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Regional Settings</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <select
                              value={preferences.currency}
                              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="GBP">GBP - British Pound</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                            <select
                              value={preferences.language}
                              onChange={(e) => handlePreferenceChange('language', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="English">English</option>
                              <option value="Spanish">Spanish</option>
                              <option value="French">French</option>
                              <option value="German">German</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                            <select
                              value={preferences.timezone}
                              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="America/Los_Angeles">Pacific Time</option>
                              <option value="America/New_York">Eastern Time</option>
                              <option value="Europe/London">GMT</option>
                              <option value="Asia/Tokyo">Japan Time</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">Data Protection</h3>
                        <p className="text-sm text-blue-800">
                          Your privacy is important to us. We use industry-standard encryption to protect your data.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <h4 className="font-medium text-gray-900">Change Password</h4>
                          <p className="text-sm text-gray-600 mt-1">Update your account password</p>
                        </button>
                        
                        <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                        </button>
                        
                        <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <h4 className="font-medium text-gray-900">Download Your Data</h4>
                          <p className="text-sm text-gray-600 mt-1">Get a copy of all your data</p>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="font-medium text-yellow-900 mb-2">Account Status</h3>
                        <p className="text-sm text-yellow-800">
                          Your account is active and in good standing.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <h4 className="font-medium text-gray-900">Export Account Data</h4>
                          <p className="text-sm text-gray-600 mt-1">Download all your trips and data</p>
                        </button>
                        
                        <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <h4 className="font-medium text-gray-900">Deactivate Account</h4>
                          <p className="text-sm text-gray-600 mt-1">Temporarily disable your account</p>
                        </button>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h3 className="font-medium text-red-900 mb-2 flex items-center">
                            <Trash2 className="h-5 w-5 mr-2" />
                            Danger Zone
                          </h3>
                          <p className="text-sm text-red-800 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;