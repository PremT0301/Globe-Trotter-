const express = require('express');
const { prisma } = require('../lib/prisma');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { cityId, type, q } = req.query;
    const where = {
      AND: [
        cityId ? { cityId: Number(cityId) } : {},
        type ? { type: { equals: String(type), mode: 'insensitive' } } : {},
        q ? { name: { contains: String(q), mode: 'insensitive' } } : {}
      ]
    };
    const activities = await prisma.activity.findMany({ where, orderBy: [{ cost: 'asc' }] });
    res.json(activities);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


