import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfilePhotoUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ isOpen, onClose }) => {
  const { user, uploadProfilePhoto } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      await uploadProfilePhoto(file);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-3d-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Update Profile Photo</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Current Photo Display */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-bright-blue to-bright-purple flex items-center justify-center">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-bright-blue bg-bright-blue/5'
                  : 'border-gray-300 hover:border-bright-blue hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-bright-blue/10 rounded-full">
                    <Upload className="h-8 w-8 text-bright-blue" />
                  </div>
                </div>

                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {dragActive ? 'Drop your image here' : 'Upload a new photo'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Drag and drop or click to browse
                  </p>
                </div>

                <button
                  onClick={openFileDialog}
                  disabled={isUploading}
                  className="btn-neon px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4" />
                      <span>Choose Photo</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* File Requirements */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, GIF • Max size: 5MB
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfilePhotoUpload;
