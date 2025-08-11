const express = require('express');
const Activity = require('../models/Activity');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { cityId, type, q } = req.query;
    const filters = {};
    if (cityId) filters.cityId = cityId;
    if (type) filters.type = { $regex: String(type), $options: 'i' };
    if (q) filters.name = { $regex: String(q), $options: 'i' };

    const activities = await Activity.find(filters).sort({ cost: 1 }).lean();
    res.json(activities);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


