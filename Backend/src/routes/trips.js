const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Budget = require('../models/Budget');

const router = express.Router();

router.use(authenticateToken);

// Create trip
router.post('/', async (req, res) => {
  try {
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
    });

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

// Update trip
router.put('/:id', async (req, res) => {
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


