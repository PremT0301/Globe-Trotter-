const express = require('express');
const { prisma } = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Upsert budget for a trip
router.post('/:tripId', async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } });
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    const data = req.body;
    const budget = await prisma.budget.upsert({
      where: { tripId },
      update: data,
      create: { tripId, ...data }
    });
    res.json(budget);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:tripId', async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } });
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    const budget = await prisma.budget.findUnique({ where: { tripId } });
    res.json(budget);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


