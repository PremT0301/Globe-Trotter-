const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const PhotoService = require('../lib/photoService');
const { authenticateToken: auth } = require('../middleware/auth');
const User = require('../models/User');

// Upload profile photo
router.post('/profile', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo provided' });
    }

    // Get user ID from auth middleware
    const userId = req.user.id;

    // Find user to check if they already have a profile photo
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile photo if it exists
    if (user.profilePhoto) {
      try {
        // Extract public ID from the URL (assuming it's stored as full URL)
        const publicId = user.profilePhoto.split('/').pop().split('.')[0];
        await PhotoService.deletePhoto(publicId);
      } catch (deleteError) {
        console.log('Could not delete old profile photo:', deleteError.message);
      }
    }

    // Upload new photo to Cloudinary
    const uploadResult = await PhotoService.uploadPhoto(
      req.file.buffer,
      'profile-photos',
      `user_${userId}_profile`
    );

    // Update user's profile photo URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: uploadResult.secure_url },
      { new: true }
    );

    res.json({
      message: 'Profile photo uploaded successfully',
      photoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto
      }
    });

  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ error: 'Failed to upload profile photo' });
  }
});

// Upload trip photo
router.post('/trip', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo provided' });
    }

    const userId = req.user.id;
    const { tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({ error: 'Trip ID is required' });
    }

    // Upload photo to Cloudinary
    const uploadResult = await PhotoService.uploadPhoto(
      req.file.buffer,
      'trip-photos',
      `trip_${tripId}_${Date.now()}`
    );

    res.json({
      message: 'Trip photo uploaded successfully',
      photoUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      tripId: tripId
    });

  } catch (error) {
    console.error('Error uploading trip photo:', error);
    res.status(500).json({ error: 'Failed to upload trip photo' });
  }
});

// Delete photo
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const userId = req.user.id;

    // Check if user owns this photo (you might want to add more validation)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete photo from Cloudinary
    const deleteResult = await PhotoService.deletePhoto(publicId);

    // If it was a profile photo, update user model
    if (user.profilePhoto && user.profilePhoto.includes(publicId)) {
      await User.findByIdAndUpdate(userId, { profilePhoto: null });
    }

    res.json({
      message: 'Photo deleted successfully',
      result: deleteResult
    });

  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Get optimized photo URL
router.get('/optimized/:publicId', (req, res) => {
  try {
    const { publicId } = req.params;
    const { width, height, crop, quality } = req.query;

    const options = {};
    if (width) options.width = parseInt(width);
    if (height) options.height = parseInt(height);
    if (crop) options.crop = crop;
    if (quality) options.quality = quality;

    const optimizedUrl = PhotoService.getOptimizedUrl(publicId, options);

    res.json({
      optimizedUrl: optimizedUrl,
      publicId: publicId,
      options: options
    });

  } catch (error) {
    console.error('Error getting optimized URL:', error);
    res.status(500).json({ error: 'Failed to get optimized URL' });
  }
});

module.exports = router;
