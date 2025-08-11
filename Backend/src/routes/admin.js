const express = require('express');
const { prisma } = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/stats', async (req, res) => {
  try {
    const stats = await prisma.adminStat.findMany({ orderBy: { date: 'desc' }, take: 100 });
    res.json(stats);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


