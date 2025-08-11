const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Itinerary = require('../models/Itinerary');
const Trip = require('../models/Trip');
const Activity = require('../models/Activity');
const City = require('../models/City');

const router = express.Router();
router.use(authenticateToken);

// Get itinerary for a trip
router.get('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Get itinerary items with populated data
    const itineraryItems = await Itinerary.find({ tripId })
      .populate('cityId', 'name country')
      .populate('activityId')
      .sort({ date: 1, orderIndex: 1 })
      .lean();

    console.log('Fetched itinerary items:', itineraryItems.length);
    
    res.json(itineraryItems);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ message: 'Failed to fetch itinerary' });
  }
});

// Add itinerary entry
router.post('/', async (req, res) => {
  try {
    const { tripId, cityId, date, activityId, orderIndex, notes } = req.body;
    
    // Validate required fields
    if (!tripId || !cityId || !date) {
      return res.status(400).json({ 
        message: 'Missing required fields: tripId, cityId, date' 
      });
    }

    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify city exists
    const city = await City.findById(cityId).lean();
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    // Verify activity exists if provided
    if (activityId) {
      const activity = await Activity.findById(activityId).lean();
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
    }

    // Create itinerary item
    const itineraryItem = await Itinerary.create({
      tripId,
      cityId,
      date: new Date(date),
      activityId: activityId || null,
      orderIndex: Number(orderIndex) || 0,
      notes: notes || '',
    });

    // Populate the created item
    const populatedItem = await Itinerary.findById(itineraryItem._id)
      .populate('cityId', 'name country')
      .populate('activityId')
      .lean();

    console.log('Created itinerary item:', populatedItem);
    res.status(201).json(populatedItem);
  } catch (error) {
    console.error('Error creating itinerary item:', error);
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Duplicate itinerary entry for this date and order' 
      });
    }
    res.status(500).json({ message: 'Failed to create itinerary item' });
  }
});

// Update itinerary entry
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cityId, date, activityId, orderIndex, notes } = req.body;

    // Find itinerary item and verify ownership
    const itineraryItem = await Itinerary.findById(id)
      .populate({ path: 'tripId', select: 'userId' })
      .lean();

    if (!itineraryItem) {
      return res.status(404).json({ message: 'Itinerary item not found' });
    }

    if (String(itineraryItem.tripId.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update fields
    const updateData = {};
    if (cityId !== undefined) updateData.cityId = cityId;
    if (date !== undefined) updateData.date = new Date(date);
    if (activityId !== undefined) updateData.activityId = activityId;
    if (orderIndex !== undefined) updateData.orderIndex = Number(orderIndex);
    if (notes !== undefined) updateData.notes = notes;

    // Update the item
    const updatedItem = await Itinerary.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    .populate('cityId', 'name country')
    .populate('activityId')
    .lean();

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating itinerary item:', error);
    res.status(500).json({ message: 'Failed to update itinerary item' });
  }
});

// Delete itinerary entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find itinerary item and verify ownership
    const itineraryItem = await Itinerary.findById(id)
      .populate({ path: 'tripId', select: 'userId' })
      .lean();

    if (!itineraryItem) {
      return res.status(404).json({ message: 'Itinerary item not found' });
    }

    if (String(itineraryItem.tripId.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete the item
    await Itinerary.findByIdAndDelete(id);
    res.json({ message: 'Itinerary item deleted successfully' });
  } catch (error) {
    console.error('Error deleting itinerary item:', error);
    res.status(500).json({ message: 'Failed to delete itinerary item' });
  }
});

// Get itinerary summary for a trip
router.get('/:tripId/summary', async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Get itinerary items grouped by date
    const itineraryItems = await Itinerary.find({ tripId })
      .populate('cityId', 'name country')
      .populate('activityId')
      .sort({ date: 1, orderIndex: 1 })
      .lean();

    // Group by date
    const groupedByDate = itineraryItems.reduce((acc, item) => {
      const dateKey = item.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {});

    // Create summary
    const summary = {
      totalDays: Object.keys(groupedByDate).length,
      totalActivities: itineraryItems.length,
      daysWithActivities: Object.keys(groupedByDate).map(date => ({
        date,
        activities: groupedByDate[date].length,
        cities: [...new Set(groupedByDate[date].map(item => item.cityId?.name))].filter(Boolean)
      })),
      cities: [...new Set(itineraryItems.map(item => item.cityId?.name))].filter(Boolean)
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching itinerary summary:', error);
    res.status(500).json({ message: 'Failed to fetch itinerary summary' });
  }
});

module.exports = router;


