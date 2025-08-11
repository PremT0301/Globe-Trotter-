const express = require('express');
const { prisma } = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Create trip
router.post('/', async (req, res) => {
  try {
    const { tripName, description, startDate, endDate, coverPhoto } = req.body;
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.userId,
        tripName,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        coverPhoto
      }
    });
    res.status(201).json(trip);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// List my trips
router.get('/', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' } });
    res.json(trips);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get a trip with itinerary and budget
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const trip = await prisma.trip.findFirst({
      where: { id, userId: req.user.userId },
      include: {
        itineraries: { include: { city: true, activity: true }, orderBy: { date: 'asc' } },
        budget: true
      }
    });
    if (!trip) return res.status(404).json({ message: 'Not found' });
    res.json(trip);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update trip
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { tripName, description, startDate, endDate, coverPhoto } = req.body;
    const updated = await prisma.trip.update({
      where: { id },
      data: { tripName, description, startDate: startDate ? new Date(startDate) : undefined, endDate: endDate ? new Date(endDate) : undefined, coverPhoto }
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.trip.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


