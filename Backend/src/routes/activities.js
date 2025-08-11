const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Activity = require('../models/Activity');
const City = require('../models/City');

const router = express.Router();
router.use(authenticateToken);

// Get all activities for a city
router.get('/city/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const activities = await Activity.find({ cityId })
      .populate('cityId', 'name country')
      .sort({ name: 1 })
      .lean();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activities by type
router.get('/city/:cityId/type/:type', async (req, res) => {
  try {
    const { cityId, type } = req.params;
    const activities = await Activity.find({ cityId, type })
      .populate('cityId', 'name country')
      .sort({ name: 1 })
      .lean();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new activity
router.post('/', async (req, res) => {
  try {
    const { cityId, name, type, cost, duration, description, imageUrl } = req.body;
    console.log('Backend: Creating activity:', { cityId, name, type, cost, duration, description, imageUrl });
    
    // Verify city exists
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    const activity = await Activity.create({
      cityId,
      name,
      type,
      cost: cost || 0,
      duration: duration || 60,
      description,
      imageUrl
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate('cityId', 'name country')
      .lean();

    console.log('Backend: Created activity:', populatedActivity);
    res.status(201).json(populatedActivity);
  } catch (error) {
    console.error('Backend: Error creating activity:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update an activity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, cost, duration, description, imageUrl } = req.body;

    const activity = await Activity.findByIdAndUpdate(
      id,
      {
        name,
        type,
        cost,
        duration,
        description,
        imageUrl
      },
      { new: true }
    ).populate('cityId', 'name country');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an activity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByIdAndDelete(id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activity by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id)
      .populate('cityId', 'name country')
      .lean();

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


