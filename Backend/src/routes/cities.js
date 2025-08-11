const express = require('express');
const City = require('../models/City');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public listing and search
router.get('/', async (req, res) => {
  try {
    const { q, country } = req.query;
    const filters = {};
    if (q) {
      filters.$or = [
        { name: { $regex: String(q), $options: 'i' } },
        { country: { $regex: String(q), $options: 'i' } },
      ];
    }
    if (country) filters.country = { $regex: String(country), $options: 'i' };

    const cities = await City.find(filters).sort({ popularityScore: -1, name: 1 }).lean();
    res.json(cities);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin add city
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, country, costIndex, popularityScore } = req.body;
    const city = await City.create({ name, country, costIndex, popularityScore });
    res.status(201).json(city);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


