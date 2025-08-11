import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Save, Lock, Mail, Phone, MapPin, Calendar, Globe, Heart, Plane, Zap, Shield, Bell, Eye, EyeOff, Star, Target, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth || '',
    preferences: user?.preferences || {
      notifications: true,
      emailUpdates: true,
      publicProfile: false
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (key: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key as keyof typeof prev.preferences]
      }
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Mock API call - in real app, this would update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context
      if (updateUser) {
        updateUser({
          ...user!,
          ...formData
        });
      }
      
      setIsEditing(false);
      showToast('success', 'Profile Updated', 'Your profile has been successfully updated.');
    } catch (error) {
      showToast('error', 'Update Failed', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'Password Mismatch', 'New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('error', 'Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - in real app, this would change the password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showToast('success', 'Password Changed', 'Your password has been successfully updated.');
    } catch (error) {
      showToast('error', 'Password Change Failed', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock avatar upload - in real app, this would upload to a server
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatarUrl = event.target?.result as string;
        if (updateUser) {
          updateUser({
            ...user!,
            avatar: avatarUrl
          });
        }
        showToast('success', 'Avatar Updated', 'Your profile picture has been updated.');
      };
      reader.readAsDataURL(file);
    }
  };

  const travelStats = [
    { label: 'Countries Visited', value: '12', icon: <Globe className="h-5 w-5" />, color: 'from-blue-500 to-indigo-500' },
    { label: 'Trips Completed', value: '8', icon: <Plane className="h-5 w-5" />, color: 'from-green-500 to-teal-500' },
    { label: 'Days Traveling', value: '45', icon: <Calendar className="h-5 w-5" />, color: 'from-purple-500 to-pink-500' },
    { label: 'Favorite Destinations', value: '6', icon: <Heart className="h-5 w-5" />, color: 'from-orange-500 to-amber-500' }
  ];

  // Enhanced background particles with more variety
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 3,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 8,
    type: ['star', 'circle', 'square', 'triangle'][Math.floor(Math.random() * 4)],
    color: ['blue', 'purple', 'pink', 'indigo', 'green', 'orange'][Math.floor(Math.random() * 6)]
  }));

  // Floating icons
  const floatingIcons = [
    { icon: <Star className="h-4 w-4" />, color: "text-yellow-400", delay: 0 },
    { icon: <Heart className="h-4 w-4" />, color: "text-red-400", delay: 2 },
    { icon: <Zap className="h-4 w-4" />, color: "text-blue-400", delay: 4 },
    { icon: <Target className="h-4 w-4" />, color: "text-green-400", delay: 6 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/90 rounded-3xl shadow-lg border border-white/20 p-8 sticky top-8">
              {/* Avatar Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <motion.div
                    className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-blue-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.label
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full cursor-pointer shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </motion.label>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </motion.button>
              </div>

              {/* Travel Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Stats</h3>
                {travelStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} mr-3`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-white">{stat.icon}</div>
                      </motion.div>
                      <span className="text-gray-700">{stat.label}</span>
                    </div>
                    <span className="font-bold text-gray-900">{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Profile Information */}
            <div className="bg-white/90 rounded-3xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 4px 12px rgba(59, 130, 246, 0.2)",
                      "0 8px 20px rgba(147, 51, 234, 0.3)",
                      "0 4px 12px rgba(59, 130, 246, 0.2)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="h-6 w-6 text-blue-500" />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80 disabled:bg-gray-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80 disabled:bg-gray-50 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 flex justify-end"
                >
                  <motion.button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        "0 10px 25px rgba(59, 130, 246, 0.3)",
                        "0 20px 40px rgba(147, 51, 234, 0.4)",
                        "0 10px 25px rgba(59, 130, 246, 0.3)"
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white/90 rounded-3xl shadow-lg border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h3>
              <div className="space-y-4">
                {Object.entries(formData.preferences).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 mr-3"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-white">
                          {key === 'notifications' && <Bell className="h-4 w-4" />}
                          {key === 'emailUpdates' && <Mail className="h-4 w-4" />}
                          {key === 'publicProfile' && <Globe className="h-4 w-4" />}
                        </div>
                      </motion.div>
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600">
                          {key === 'notifications' && 'Receive push notifications'}
                          {key === 'emailUpdates' && 'Get email updates about your trips'}
                          {key === 'publicProfile' && 'Make your profile visible to other travelers'}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handlePreferenceChange(key)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        value ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                        animate={{ x: value ? 26 : 2 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white/90 rounded-3xl shadow-lg border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                    />
                    <motion.button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                    />
                    <motion.button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80"
                    />
                    <motion.button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-end"
                >
                  <motion.button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        "0 10px 25px rgba(34, 197, 94, 0.3)",
                        "0 20px 40px rgba(20, 184, 166, 0.4)",
                        "0 10px 25px rgba(34, 197, 94, 0.3)"
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Change Password
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
