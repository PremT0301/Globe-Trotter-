const express = require('express');
const { prisma } = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// Add or update an itinerary entry
router.post('/', async (req, res) => {
  try {
    const { tripId, cityId, date, activityId, orderIndex } = req.body;
    const trip = await prisma.trip.findFirst({ where: { id: Number(tripId), userId: req.user.userId } });
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    const item = await prisma.itinerary.create({
      data: {
        tripId: Number(tripId),
        cityId: Number(cityId),
        date: new Date(date),
        activityId: activityId ? Number(activityId) : null,
        orderIndex: Number(orderIndex) || 0
      }
    });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:tripId', async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    const trip = await prisma.trip.findFirst({ where: { id: tripId, userId: req.user.userId } });
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    const items = await prisma.itinerary.findMany({ where: { tripId }, include: { city: true, activity: true }, orderBy: [{ date: 'asc' }, { orderIndex: 'asc' }] });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Ensure the itinerary belongs to the user
    const item = await prisma.itinerary.findUnique({ where: { id }, include: { trip: true } });
    if (!item || item.trip.userId !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    await prisma.itinerary.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


