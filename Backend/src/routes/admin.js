const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Trip = require('../models/Trip');
const AdminStat = require('../models/AdminStat');
const mongoose = require('mongoose');

const router = express.Router();
router.use(requireAdmin);

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const activeTrips = await Trip.countDocuments({ status: 'active' });
    const completedTrips = await Trip.countDocuments({ status: 'completed' });
    
    // Get user growth data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get trip creation data (last 6 months)
    const tripGrowth = await Trip.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get top destinations
    const topDestinations = await Trip.aggregate([
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalTrips,
        activeTrips,
        completedTrips
      },
      userGrowth,
      tripGrowth,
      topDestinations
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin statistics' });
  }
});

// Get all users with pagination and search
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const users = await User.find(query)
      .select('-passwordHash -emailVerificationToken')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get user details
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-passwordHash -emailVerificationToken')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's trips
    const trips = await Trip.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ user, trips });
  } catch (error) {
    console.error('Admin user details error:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// Update user role
router.patch('/users/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-passwordHash -emailVerificationToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user, message: 'User role updated successfully' });
  } catch (error) {
    console.error('Admin update user role error:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    
    await User.findByIdAndDelete(req.params.userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Get all trips with pagination and search
router.get('/trips', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { destination: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (status) {
      query.status = status;
    }
    
    const trips = await Trip.find(query)
      .populate('userId', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Trip.countDocuments(query);
    
    res.json({
      trips,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalTrips: total,
        hasNext: skip + trips.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin trips error:', error);
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
});

// Get trip details
router.get('/trips/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('userId', 'name email')
      .lean();
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    res.json({ trip });
  } catch (error) {
    console.error('Admin trip details error:', error);
    res.status(500).json({ message: 'Failed to fetch trip details' });
  }
});

// Update trip status
router.patch('/trips/:tripId/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['planning', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const trip = await Trip.findByIdAndUpdate(
      req.params.tripId,
      { status },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    res.json({ trip, message: 'Trip status updated successfully' });
  } catch (error) {
    console.error('Admin update trip status error:', error);
    res.status(500).json({ message: 'Failed to update trip status' });
  }
});

// Delete trip
router.delete('/trips/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    await Trip.findByIdAndDelete(req.params.tripId);
    
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Admin delete trip error:', error);
    res.status(500).json({ message: 'Failed to delete trip' });
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // User registration analytics
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Trip creation analytics
    const tripCreations = await Trip.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Trip status distribution
    const tripStatusDistribution = await Trip.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Top destinations
    const topDestinations = await Trip.aggregate([
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.json({
      userRegistrations,
      tripCreations,
      tripStatusDistribution,
      topDestinations
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

module.exports = router;


