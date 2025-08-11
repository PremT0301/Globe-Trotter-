const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

const router = express.Router();
router.use(authenticateToken);

// Get all expenses for a trip
router.get('/:tripId', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    
    const expenses = await Expense.find({ tripId }).sort({ date: -1 }).lean();
    res.json(expenses);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Add a new expense
router.post('/:tripId', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    
    const expense = new Expense({
      ...req.body,
      tripId
    });
    await expense.save();
    res.json(expense);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId).populate('tripId');
    
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (expense.tripId.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      req.body,
      { new: true }
    );
    res.json(updatedExpense);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId).populate('tripId');
    
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (expense.tripId.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await Expense.findByIdAndDelete(expenseId);
    res.json({ message: 'Expense deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get expense summary for a trip
router.get('/:tripId/summary', async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id }).lean();
    if (!trip) return res.status(403).json({ message: 'Forbidden' });
    
    const expenses = await Expense.find({ tripId }).lean();
    
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const spendingByCategory = {};
    
    expenses.forEach(expense => {
      if (!spendingByCategory[expense.category]) {
        spendingByCategory[expense.category] = 0;
      }
      spendingByCategory[expense.category] += expense.amount;
    });
    
    res.json({
      totalSpent,
      spendingByCategory,
      totalBudget: trip.budget || 0,
      remaining: (trip.budget || 0) - totalSpent
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
