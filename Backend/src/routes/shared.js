const express = require('express');
const { prisma } = require('../lib/prisma');

const router = express.Router();

// Create a public share URL for a trip
router.post('/:tripId', async (req, res) => {
  try {
    const tripId = Number(req.params.tripId);
    const { publicUrl } = req.body;
    const shared = await prisma.sharedTrip.create({ data: { tripId, publicUrl } });
    res.status(201).json(shared);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Publicly fetch a shared itinerary by URL
router.get('/u/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const shared = await prisma.sharedTrip.findUnique({ where: { publicUrl: slug }, include: { trip: { include: { itineraries: { include: { city: true, activity: true } }, budget: true } } } });
    if (!shared) return res.status(404).json({ message: 'Not found' });
    res.json(shared.trip);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


