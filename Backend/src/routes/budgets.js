const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Budget = require('../models/Budget');
const Trip = require('../models/Trip');

const router = express.Router();
router.use(authenticateToken);

// Upsert budget for a trip
router.post('/:tripId', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    const data = req.body;
    const budget = await Budget.findOneAndUpdate(
      { tripId },
      { $set: { ...data, tripId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    res.json(budget);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:tripId', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    const budget = await Budget.findOne({ tripId }).lean();
    res.json(budget);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


