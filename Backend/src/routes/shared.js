const express = require('express');
const SharedTrip = require('../models/SharedTrip');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Budget = require('../models/Budget');

const router = express.Router();

// Create a public share URL for a trip
router.post('/:tripId', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const { publicUrl } = req.body;
    const shared = await SharedTrip.create({ tripId, publicUrl });
    res.status(201).json(shared);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Publicly fetch a shared itinerary by URL
router.get('/u/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const shared = await SharedTrip.findOne({ publicUrl: slug }).lean();
    if (!shared) return res.status(404).json({ message: 'Not found' });

    const trip = await Trip.findById(shared.tripId).lean();
    if (!trip) return res.status(404).json({ message: 'Not found' });
    const itineraries = await Itinerary.find({ tripId: shared.tripId })
      .populate('cityId')
      .populate('activityId')
      .sort({ date: 1 })
      .lean();
    const budget = await Budget.findOne({ tripId: shared.tripId }).lean();
    res.json({ ...trip, itineraries, budget });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


