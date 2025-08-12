const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Budget = require('../models/Budget');
const PhotoService = require('../lib/photoService');

const router = express.Router();

// Debug environment variables
console.log('🔍 Trips Route: Environment check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
  NODE_ENV: process.env.NODE_ENV
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 Multer: Processing file:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ Multer: File accepted');
      cb(null, true);
    } else {
      console.log('❌ Multer: File rejected - not an image');
      cb(new Error('Only image files are allowed'), false);
    }
  },
}).single('image');

// Wrap multer with error handling
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('❌ Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      console.error('❌ Other upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.use(authenticateToken);

// Test endpoint to verify Cloudinary configuration
router.get('/test-cloudinary', async (req, res) => {
  try {
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
    };
    
    console.log('🔍 Cloudinary config check:', config);
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ 
        message: 'Cloudinary configuration incomplete',
        config 
      });
    }
    
    res.json({ 
      message: 'Cloudinary configuration OK',
      config: {
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret
      }
    });
  } catch (error) {
    console.error('❌ Cloudinary test error:', error);
    res.status(500).json({ message: 'Cloudinary test failed', error: error.message });
  }
});

// Create trip with image upload
router.post('/', uploadMiddleware, async (req, res) => {
  try {
    console.log('📁 Trip Route: POST request received', {
      hasFile: !!req.file,
      fileDetails: req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null,
      body: req.body,
      user: req.user ? { id: req.user.id } : null
    });

    const { 
      title, 
      destination, 
      description, 
      startDate, 
      endDate, 
      travelers, 
      budget, 
      tripType, 
      coverPhoto 
    } = req.body;

    // Validation
    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, destination, startDate, endDate' 
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ 
        message: 'End date must be after start date' 
      });
    }

    if (travelers && travelers < 1) {
      return res.status(400).json({ 
        message: 'Number of travelers must be at least 1' 
      });
    }

    let imageUrl = null;
    let publicId = null;
    
    // Handle image upload if present
    if (req.file) {
      console.log('📁 Trip Route: File received:', {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        bufferLength: req.file.buffer?.length
      });
      
      // Validate file
      if (!req.file.buffer || req.file.buffer.length === 0) {
        console.error('❌ Trip Route: File buffer is empty');
        return res.status(400).json({ 
          message: 'Invalid image file. Please try again.' 
        });
      }
      
      if (!req.file.mimetype.startsWith('image/')) {
        console.error('❌ Trip Route: File is not an image:', req.file.mimetype);
        return res.status(400).json({ 
          message: 'Only image files are allowed.' 
        });
      }
      
      try {
        publicId = PhotoService.generateTripImageId('temp', req.user.id);
        console.log('📁 Trip Route: Generated public ID:', publicId);
        
        const uploadResult = await PhotoService.uploadImage(req.file.buffer, 'trips', publicId);
        imageUrl = uploadResult.secure_url;
        console.log('📁 Trip Route: Image upload successful:', imageUrl);
      } catch (uploadError) {
        console.error('❌ Trip Route: Error uploading image:', uploadError);
        return res.status(500).json({ 
          message: 'Failed to upload image. Please try again.' 
        });
      }
    } else {
      console.log('📁 Trip Route: No file received in request');
    }

    const trip = await Trip.create({
      userId: req.user.id,
      title,
      destination,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      travelers: travelers || 1,
      budget: budget ? parseFloat(budget) : undefined,
      tripType: tripType || 'Adventure',
      coverPhoto,
      imageUrl, // Store the Cloudinary URL
    });

    // Update the public ID with the actual trip ID
    if (imageUrl && req.file && publicId) {
      try {
        const newPublicId = PhotoService.generateTripImageId(trip._id.toString(), req.user.id);
        
        // Re-upload with correct public ID
        const reuploadResult = await PhotoService.uploadImage(req.file.buffer, 'trips', newPublicId);
        
        // Update trip with new image URL
        await Trip.findByIdAndUpdate(trip._id, { 
          imageUrl: reuploadResult.secure_url 
        });
        
        // Delete old image
        await PhotoService.deleteImage(publicId);
        
        // Update the response
        trip.imageUrl = reuploadResult.secure_url;
      } catch (error) {
        console.error('Error updating image public ID:', error);
        // Don't fail the trip creation if image update fails
      }
    }

    res.status(201).json(trip);
  } catch (e) {
    console.error('Error creating trip:', e);
    res.status(500).json({ message: e.message });
  }
});

// List my trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(trips);
  } catch (e) {
    console.error('Error fetching trips:', e);
    res.status(500).json({ message: e.message });
  }
});

// Get a trip with itinerary and budget
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const trip = await Trip.findOne({ _id: id, userId: req.user.id }).lean();
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const itineraries = await Itinerary.find({ tripId: id })
      .populate('cityId')
      .populate('activityId')
      .sort({ date: 1 })
      .lean();
    const budget = await Budget.findOne({ tripId: id }).lean();
    res.json({ ...trip, itineraries, budget });
  } catch (e) {
    console.error('Error fetching trip:', e);
    res.status(500).json({ message: e.message });
  }
});

// Update trip with image upload
router.put('/:id', uploadMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const { 
      title, 
      destination, 
      description, 
      startDate, 
      endDate, 
      travelers, 
      budget, 
      tripType, 
      coverPhoto,
      status 
    } = req.body;

    // Validation
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ 
        message: 'End date must be after start date' 
      });
    }

    if (travelers && travelers < 1) {
      return res.status(400).json({ 
        message: 'Number of travelers must be at least 1' 
      });
    }

    // Get current trip to check if it has an existing image
    const currentTrip = await Trip.findById(id);
    if (!currentTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    let imageUrl = currentTrip.imageUrl; // Keep existing image by default
    
    // Handle new image upload if present
    if (req.file) {
      try {
        // Delete old image if it exists
        if (currentTrip.imageUrl) {
          try {
            // Extract public ID from URL (this is a simplified approach)
            const urlParts = currentTrip.imageUrl.split('/');
            const publicId = urlParts[urlParts.length - 1].split('.')[0];
            await PhotoService.deleteImage(publicId);
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError);
            // Continue with upload even if deletion fails
          }
        }

        // Upload new image
        const newPublicId = PhotoService.generateTripImageId(id, req.user.id);
        const uploadResult = await PhotoService.uploadImage(req.file.buffer, 'trips', newPublicId);
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Error uploading new image:', uploadError);
        return res.status(500).json({ 
          message: 'Failed to upload new image. Please try again.' 
        });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (destination !== undefined) updateData.destination = destination;
    if (description !== undefined) updateData.description = description;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (travelers !== undefined) updateData.travelers = travelers;
    if (budget !== undefined) updateData.budget = budget ? parseFloat(budget) : undefined;
    if (tripType !== undefined) updateData.tripType = tripType;
    if (coverPhoto !== undefined) updateData.coverPhoto = coverPhoto;
    if (status !== undefined) updateData.status = status;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updated = await Trip.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updateData },
      { new: true }
    ).lean();
    
    if (!updated) return res.status(404).json({ message: 'Trip not found' });
    res.json(updated);
  } catch (e) {
    console.error('Error updating trip:', e);
    res.status(500).json({ message: e.message });
  }
});

// Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Trip.deleteOne({ _id: id, userId: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted successfully' });
  } catch (e) {
    console.error('Error deleting trip:', e);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


