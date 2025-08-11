const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const AdminStat = require('../models/AdminStat');

const router = express.Router();
router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    const stats = await AdminStat.find().sort({ date: -1 }).limit(100).lean();
    res.json(stats);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;


