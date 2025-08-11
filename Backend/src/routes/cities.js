const express = require('express');
const { prisma } = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public listing and search
router.get('/', async (req, res) => {
  try {
    const { q, country } = req.query;
    const where = {
      AND: [
        q ? { OR: [{ name: { contains: String(q), mode: 'insensitive' } }, { country: { contains: String(q), mode: 'insensitive' } }] } : {},
        country ? { country: { equals: String(country), mode: 'insensitive' } } : {}
      ]
    };
    const cities = await prisma.city.findMany({ where, orderBy: [{ popularityScore: 'desc' }, { name: 'asc' }] });
    res.json(cities);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin add city (optional: protect with auth later)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, country, costIndex, popularityScore } = req.body;
    const city = await prisma.city.create({ data: { name, country, costIndex, popularityScore } });
    res.status(201).json(city);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


