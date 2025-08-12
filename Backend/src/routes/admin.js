const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Activity = require('../models/Activity');
const AdminStat = require('../models/AdminStat');
const mongoose = require('mongoose');

const router = express.Router();

// Apply admin middleware to all routes
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

    // Calculate additional stats
    const totalActivities = await Activity.countDocuments();
    const totalBudget = await Trip.aggregate([
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);
    const avgBudget = await Trip.aggregate([
      { $group: { _id: null, avg: { $avg: '$budget' } } }
    ]);

    // Calculate monthly growth (simplified)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const lastMonthTrips = await Trip.countDocuments({ createdAt: { $gte: lastMonth } });
    const lastMonthActivities = await Activity.countDocuments({ createdAt: { $gte: lastMonth } });

    // Get popular activities
    const popularActivities = await Activity.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      activeUsers: totalUsers, // Simplified - assuming all users are active
      totalTrips,
      activeTrips,
      totalActivities,
      totalBudget: totalBudget[0]?.total || 0,
      averageBudget: avgBudget[0]?.avg || 0,
      monthlyGrowth: {
        users: lastMonthUsers,
        trips: lastMonthTrips,
        activities: lastMonthActivities
      },
      topDestinations: topDestinations.map(dest => ({
        destination: dest._id,
        count: dest.count
      })),
      popularActivities: popularActivities.map(act => ({
        type: act._id,
        count: act.count
      })),
      userGrowth,
      tripGrowth
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
router.put('/users/:userId/role', async (req, res) => {
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

// Update user status
router.put('/users/:userId/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    ).select('-passwordHash -emailVerificationToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user, message: 'User status updated successfully' });
  } catch (error) {
    console.error('Admin update user status error:', error);
    res.status(500).json({ message: 'Failed to update user status' });
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

    console.log(`🗑️ Admin: Deleting user ${user.name} (${user._id}) and all related data`);

    // Delete all user's trips (this will cascade to delete itineraries, budgets, etc.)
    const userTrips = await Trip.find({ userId: req.params.userId });
    console.log(`🗑️ Admin: Found ${userTrips.length} trips to delete`);

    for (const trip of userTrips) {
      // Delete trip (cascade will handle related data)
      await Trip.findByIdAndDelete(trip._id);
      console.log(`🗑️ Admin: Deleted trip ${trip.title}`);
    }

    // Delete user
    await User.findByIdAndDelete(req.params.userId);
    console.log(`🗑️ Admin: Deleted user ${user.name}`);

    // Get updated stats
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    
    res.json({ 
      message: 'User and all related data deleted successfully',
      stats: {
        totalUsers,
        totalTrips
      }
    });
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
router.put('/trips/:tripId/status', async (req, res) => {
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
    const trip = await Trip.findById(req.params.tripId).populate('userId', 'name email');
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    console.log(`🗑️ Admin: Deleting trip ${trip.title} (${trip._id}) and all related data`);

    // Delete trip (cascade will handle itineraries, budgets, etc.)
    await Trip.findByIdAndDelete(req.params.tripId);
    console.log(`🗑️ Admin: Deleted trip ${trip.title}`);

    // Get updated stats
    const totalTrips = await Trip.countDocuments();
    const totalUsers = await User.countDocuments();
    
    res.json({ 
      message: 'Trip and all related data deleted successfully',
      deletedTrip: {
        title: trip.title,
        destination: trip.destination,
        user: trip.userId ? `${trip.userId.name} (${trip.userId.email})` : 'Unknown User'
      },
      stats: {
        totalTrips,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Admin delete trip error:', error);
    res.status(500).json({ message: 'Failed to delete trip' });
  }
});

// Get all activities with pagination and search
router.get('/activities', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', type = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (type) {
      query.type = type;
    }
    
    const activities = await Activity.find(query)
      .populate('cityId', 'name country')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Activity.countDocuments(query);
    
    res.json({
      activities,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalActivities: total,
        hasNext: skip + activities.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin activities error:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
});

// Get database statistics
router.get('/database', async (req, res) => {
  try {
    // Get collection counts
    const usersCount = await User.countDocuments();
    const tripsCount = await Trip.countDocuments();
    const activitiesCount = await Activity.countDocuments();
    const citiesCount = await mongoose.model('City').countDocuments();
    const expensesCount = await mongoose.model('Expense').countDocuments();
    const itinerariesCount = await mongoose.model('Itinerary').countDocuments();

    // Get database stats
    const dbStats = await mongoose.connection.db.stats();
    
    // Calculate storage info
    const totalStorage = dbStats.dataSize + dbStats.indexSize;
    const usedStorage = dbStats.storageSize;
    const availableStorage = totalStorage - usedStorage;

    // Get performance metrics (simplified)
    const startTime = Date.now();
    await User.findOne(); // Simple query to measure response time
    const responseTime = Date.now() - startTime;

    res.json({
      collections: {
        users: usersCount,
        trips: tripsCount,
        activities: activitiesCount,
        cities: citiesCount,
        expenses: expensesCount,
        itineraries: itinerariesCount
      },
      storage: {
        total: totalStorage,
        used: usedStorage,
        available: availableStorage
      },
      performance: {
        avgResponseTime: responseTime,
        activeConnections: mongoose.connection.client.topology.s.options.maxPoolSize || 10,
        queriesPerSecond: 0 // Would need more complex monitoring
      },
      health: {
        status: 'healthy',
        lastBackup: new Date().toISOString(), // Simplified
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Admin database stats error:', error);
    res.status(500).json({ message: 'Failed to fetch database statistics' });
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


