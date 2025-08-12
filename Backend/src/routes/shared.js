const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const SharedTrip = require('../models/SharedTrip');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Budget = require('../models/Budget');
const Activity = require('../models/Activity');
const City = require('../models/City');
const CommunityPost = require('../models/CommunityPost');
const NotificationService = require('../lib/notificationService');

const router = express.Router();

// Generate a unique slug for sharing
const generateUniqueSlug = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let slug;
  let isUnique = false;
  
  while (!isUnique) {
    slug = '';
    for (let i = 0; i < 8; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const existing = await SharedTrip.findOne({ publicUrl: slug });
    if (!existing) {
      isUnique = true;
    }
  }
  
  return slug;
};

// Create a public share URL for a trip
router.post('/:tripId', authenticateToken, async (req, res) => {
  try {
    const tripId = req.params.tripId;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Check if already shared
    const existingShare = await SharedTrip.findOne({ tripId });
    if (existingShare) {
      return res.json({
        message: 'Trip already shared',
        sharedTrip: existingShare,
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${existingShare.publicUrl}`
      });
    }
    
    // Check if community post already exists for this trip
    const existingPost = await CommunityPost.findOne({ tripId, status: 'active' });
    if (existingPost) {
      return res.status(400).json({ 
        message: 'Trip already has an active community post. Please delete the existing post first.' 
      });
    }
    
    // Generate unique slug
    const publicUrl = await generateUniqueSlug();
    
    // Create shared trip
    const shared = await SharedTrip.create({ 
      tripId, 
      publicUrl,
      shareDate: new Date()
    });
    
    // Create community post for the shared trip
    const communityPost = await CommunityPost.create({
      userId: req.user.id,
      tripId: tripId,
      title: trip.title,
      description: trip.description || `Check out my amazing trip to ${trip.destination}!`,
      coverImage: trip.coverPhoto,
      tags: [
        trip.destination,
        trip.tripType,
        'shared-trip',
        'travel-inspiration'
      ].filter(Boolean), // Remove any undefined values
      isPublic: true,
      status: 'active'
    });
    
    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${publicUrl}`;
    
    res.status(201).json({
      message: 'Trip shared successfully and added to community',
      sharedTrip: shared,
      communityPost: communityPost,
      shareUrl: shareUrl
    });
  } catch (error) {
    console.error('Error sharing trip:', error);
    res.status(500).json({ message: 'Failed to share trip' });
  }
});

// Get all shared trips for explore page
router.get('/explore', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query for search
    let query = {};
    if (search) {
      query = {
        $or: [
          { 'trip.title': { $regex: search, $options: 'i' } },
          { 'trip.destination': { $regex: search, $options: 'i' } },
          { 'trip.description': { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const sharedTrips = await SharedTrip.find(query)
      .populate({
        path: 'tripId',
        select: 'title destination description startDate endDate travelers tripType imageUrl',
        match: { status: { $ne: 'draft' } } // Only show completed/active trips
      })
      .sort({ shareDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Filter out trips where tripId is null (deleted trips)
    const validSharedTrips = sharedTrips.filter(st => st.tripId);
    
    // Get community posts for these shared trips
    const tripIds = validSharedTrips.map(st => st.tripId._id);
    const communityPosts = await CommunityPost.find({
      tripId: { $in: tripIds },
      status: 'active'
    }).lean();
    
    // Create a map of tripId to community post
    const postMap = {};
    communityPosts.forEach(post => {
      postMap[post.tripId.toString()] = post;
    });
    
    // Add community post info to shared trips
    const sharedTripsWithPosts = validSharedTrips.map(st => ({
      ...st,
      communityPost: postMap[st.tripId._id.toString()]
    }));
    
    // Get total count for pagination
    const total = await SharedTrip.countDocuments(query);
    
    res.json({
      sharedTrips: sharedTripsWithPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching shared trips:', error);
    res.status(500).json({ message: 'Failed to fetch shared trips' });
  }
});

// Get shared trip statistics
router.get('/stats', async (req, res) => {
  try {
    const totalShared = await SharedTrip.countDocuments();
    const recentShares = await SharedTrip.countDocuments({
      shareDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });
    
    // Get community posts linked to shared trips
    const sharedTripIds = await SharedTrip.distinct('tripId');
    const communityPostsCount = await CommunityPost.countDocuments({
      tripId: { $in: sharedTripIds },
      status: 'active'
    });
    
    res.json({
      totalShared,
      recentShares,
      communityPostsCount,
      popularDestinations: [] // TODO: Implement popular destinations logic
    });
  } catch (error) {
    console.error('Error fetching share stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Publicly fetch a shared itinerary by URL
router.get('/u/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const shared = await SharedTrip.findOne({ publicUrl: slug }).lean();
    
    if (!shared) {
      return res.status(404).json({ message: 'Shared trip not found' });
    }

    const trip = await Trip.findById(shared.tripId).lean();
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    // Get itinerary with populated data
    const itineraries = await Itinerary.find({ tripId: shared.tripId })
      .populate('cityId', 'name country')
      .populate('activityId')
      .sort({ date: 1, orderIndex: 1 })
      .lean();
    
    // Get budget
    const budget = await Budget.findOne({ tripId: shared.tripId }).lean();
    
    // Process itinerary data for better display
    const processedItineraries = itineraries.map(item => {
      if (item.activityId) {
        return {
          ...item,
          activity: {
            name: item.activityId.name,
            type: item.activityId.type,
            duration: item.activityId.duration,
            cost: item.activityId.cost,
            description: item.activityId.description
          },
          city: {
            name: item.cityId?.name || 'Unknown',
            country: item.cityId?.country || ''
          }
        };
      } else {
        // Handle legacy data
        try {
          const parsedData = JSON.parse(item.notes || '{}');
          return {
            ...item,
            activity: {
              name: parsedData.title || 'Activity',
              type: parsedData.type || 'attraction',
              duration: parsedData.duration || '1 hour',
              cost: parsedData.cost || 0,
              description: parsedData.notes || ''
            },
            city: {
              name: parsedData.location || 'Unknown',
              country: ''
            }
          };
        } catch (error) {
          return {
            ...item,
            activity: {
              name: 'Activity',
              type: 'attraction',
              duration: '1 hour',
              cost: 0,
              description: ''
            },
            city: {
              name: 'Unknown',
              country: ''
            }
          };
        }
      }
    });
    
    res.json({
      trip: {
        ...trip,
        shareDate: shared.shareDate
      },
      itineraries: processedItineraries,
      budget,
      shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${slug}`
    });
  } catch (error) {
    console.error('Error fetching shared trip:', error);
    res.status(500).json({ message: 'Failed to fetch shared trip' });
  }
});

// Clone a shared trip to user's trips (available to all authenticated users - both 'user' and 'admin' roles)
router.post('/clone/:slug', authenticateToken, async (req, res) => {
  try {
    const slug = req.params.slug;
    
    // Find the shared trip
    const shared = await SharedTrip.findOne({ publicUrl: slug });
    if (!shared) {
      return res.status(404).json({ message: 'Shared trip not found' });
    }

    // Get the original trip data
    const originalTrip = await Trip.findById(shared.tripId).lean();
    if (!originalTrip) {
      return res.status(404).json({ message: 'Original trip not found' });
    }

    // Create a new trip for the current user
    const newTrip = await Trip.create({
      userId: req.user.id,
      title: `${originalTrip.title} (Copy)`,
      destination: originalTrip.destination,
      description: originalTrip.description,
      startDate: originalTrip.startDate,
      endDate: originalTrip.endDate,
      travelers: originalTrip.travelers,
      budget: originalTrip.budget,
      tripType: originalTrip.tripType,
      coverPhoto: originalTrip.coverPhoto,
      status: 'draft' // Start as draft so user can modify dates, activities, and all details
    });

    // Clone the itinerary
    const originalItineraries = await Itinerary.find({ tripId: shared.tripId }).lean();
    for (const itinerary of originalItineraries) {
      await Itinerary.create({
        tripId: newTrip._id,
        cityId: itinerary.cityId,
        activityId: itinerary.activityId,
        date: itinerary.date,
        orderIndex: itinerary.orderIndex,
        notes: itinerary.notes
      });
    }

    // Clone the budget
    const originalBudget = await Budget.findOne({ tripId: shared.tripId }).lean();
    if (originalBudget) {
      await Budget.create({
        tripId: newTrip._id,
        totalBudget: originalBudget.totalBudget,
        currency: originalBudget.currency,
        categories: originalBudget.categories
      });
    }

    res.status(201).json({
      message: 'Trip cloned successfully',
      trip: newTrip
    });
  } catch (error) {
    console.error('Error cloning trip:', error);
    res.status(500).json({ message: 'Failed to clone trip' });
  }
});

// Unshare a trip
router.delete('/:tripId', authenticateToken, async (req, res) => {
  try {
    const tripId = req.params.tripId;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    const deleted = await SharedTrip.findOneAndDelete({ tripId });
    if (!deleted) {
      return res.status(404).json({ message: 'Shared trip not found' });
    }
    
    // Archive the corresponding community post when trip is unshared
    await CommunityPost.findOneAndUpdate(
      { tripId: tripId },
      { status: 'archived' },
      { new: true }
    );
    
    res.json({ message: 'Trip unshared successfully and removed from community' });
  } catch (error) {
    console.error('Error unsharing trip:', error);
    res.status(500).json({ message: 'Failed to unshare trip' });
  }
});

// Get community posts for shared trips
router.get('/community-posts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Get all shared trip IDs
    const sharedTripIds = await SharedTrip.distinct('tripId');
    
    // Get community posts for shared trips
    const posts = await CommunityPost.find({
      tripId: { $in: sharedTripIds },
      status: 'active',
      isPublic: true
    })
      .populate('userId', 'name email profilePhoto')
      .populate('tripId', 'title destination description startDate endDate travelers tripType coverPhoto')
      .populate('comments.userId', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await CommunityPost.countDocuments({
      tripId: { $in: sharedTripIds },
      status: 'active',
      isPublic: true
    });
    
    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching community posts for shared trips:', error);
    res.status(500).json({ message: 'Failed to fetch community posts' });
  }
});

module.exports = router;


