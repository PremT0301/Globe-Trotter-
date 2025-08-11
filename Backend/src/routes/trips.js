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
    const { tripName, description, startDate, endDate, coverPhoto } = req.body;
    const trip = await Trip.create({
      userId: req.user.id,
      tripName,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      coverPhoto,
    });
    res.status(201).json(trip);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// List my trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(trips);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get a trip with itinerary and budget
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const trip = await Trip.findOne({ _id: id, userId: req.user.id }).lean();
    if (!trip) return res.status(404).json({ message: 'Not found' });

    const itineraries = await Itinerary.find({ tripId: id })
      .populate('cityId')
      .populate('activityId')
      .sort({ date: 1 })
      .lean();
    const budget = await Budget.findOne({ tripId: id }).lean();
    res.json({ ...trip, itineraries, budget });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update trip
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { tripName, description, startDate, endDate, coverPhoto } = req.body;
    const updated = await Trip.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $set: {
          ...(tripName !== undefined && { tripName }),
          ...(description !== undefined && { description }),
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
          ...(coverPhoto !== undefined && { coverPhoto }),
        },
      },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Trip.deleteOne({ _id: id, userId: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


