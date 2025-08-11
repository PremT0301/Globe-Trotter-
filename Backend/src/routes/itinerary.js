const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Itinerary = require('../models/Itinerary');
const Trip = require('../models/Trip');

const router = express.Router();
router.use(authenticateToken);

// Add itinerary entry
router.post('/', async (req, res) => {
  try {
    const { tripId, cityId, date, activityId, orderIndex } = req.body;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    const item = await Itinerary.create({
      tripId,
      cityId,
      date: new Date(date),
      activityId: activityId || null,
      orderIndex: Number(orderIndex) || 0,
    });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:tripId', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    const items = await Itinerary.find({ tripId })
      .populate('cityId')
      .populate('activityId')
      .sort({ date: 1, orderIndex: 1 })
      .lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Itinerary.findById(id).populate({ path: 'tripId', select: 'userId' });
    if (!item || String(item.tripId.userId) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await Itinerary.deleteOne({ _id: id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


