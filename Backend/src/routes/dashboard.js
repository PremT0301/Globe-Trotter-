const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Trip = require('../models/Trip');
const City = require('../models/City');
const Itinerary = require('../models/Itinerary');

const router = express.Router();
router.use(authenticateToken);

// Get dashboard stats for the authenticated user
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's trips
    const userTrips = await Trip.find({ userId }).lean();
    
    // Calculate stats
    const totalTrips = userTrips.length;
    
    // Get unique countries from trips (via itineraries)
    const tripIds = userTrips.map(trip => trip._id);
    const itineraries = await Itinerary.find({ tripId: { $in: tripIds } })
      .populate('cityId', 'country')
      .lean();
    
    const countriesVisited = new Set(itineraries.map(item => item.cityId?.country)).size;
    
    // Count upcoming trips (start date > today)
    const today = new Date();
    const upcomingTrips = userTrips.filter(trip => new Date(trip.startDate) > today).length;
    
    // Calculate total travel days
    const travelDays = userTrips.reduce((total, trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);

    res.json({
      totalTrips,
      countriesVisited,
      upcomingTrips,
      travelDays
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Get recent trips for the authenticated user
router.get('/recent-trips', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;

    const trips = await Trip.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Calculate trip status and progress
    const today = new Date();
    const tripsWithStatus = trips.map(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      let status = 'planning';
      let progress = 0;
      
      if (today > endDate) {
        status = 'completed';
        progress = 100;
      } else if (today >= startDate && today <= endDate) {
        status = 'ongoing';
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        progress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
      } else if (today < startDate) {
        status = 'upcoming';
        progress = 0;
      }

      return {
        id: trip._id,
        title: trip.tripName,
        destination: trip.description || 'Multiple destinations',
        dates: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        image: trip.coverPhoto || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
        status,
        collaborators: 1, // Default for now, can be enhanced later
        progress
      };
    });

    res.json(tripsWithStatus);
  } catch (error) {
    console.error('Recent trips error:', error);
    res.status(500).json({ message: 'Failed to fetch recent trips' });
  }
});

// Get popular destinations (cities with highest popularity scores)
router.get('/popular-destinations', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;

    const popularCities = await City.find({ popularityScore: { $exists: true, $ne: null } })
      .sort({ popularityScore: -1 })
      .limit(limit)
      .lean();

    const destinations = popularCities.map(city => ({
      name: `${city.name}, ${city.country}`,
      image: `https://images.pexels.com/photos/161901/santorini-greece-island-161901.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1`, // Default image
      rating: (city.popularityScore / 100 * 5).toFixed(1), // Convert popularity score to 5-star rating
      trips: Math.floor(city.popularityScore * 10), // Generate trip count based on popularity
      price: `$${Math.floor(city.costIndex * 100)}` // Generate price based on cost index
    }));

    res.json(destinations);
  } catch (error) {
    console.error('Popular destinations error:', error);
    res.status(500).json({ message: 'Failed to fetch popular destinations' });
  }
});

// Get comprehensive dashboard data (all in one endpoint)
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's trips
    const userTrips = await Trip.find({ userId }).lean();
    
    // Calculate stats
    const totalTrips = userTrips.length;
    
    // Get unique countries from trips (via itineraries)
    const tripIds = userTrips.map(trip => trip._id);
    const itineraries = await Itinerary.find({ tripId: { $in: tripIds } })
      .populate('cityId', 'country')
      .lean();
    
    const countriesVisited = new Set(itineraries.map(item => item.cityId?.country)).size;
    
    // Count upcoming trips (start date > today)
    const today = new Date();
    const upcomingTrips = userTrips.filter(trip => new Date(trip.startDate) > today).length;
    
    // Calculate total travel days
    const travelDays = userTrips.reduce((total, trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);

    // Get recent trips with status
    const recentTrips = userTrips
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(trip => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);
        
        let status = 'planning';
        let progress = 0;
        
        if (today > endDate) {
          status = 'completed';
          progress = 100;
        } else if (today >= startDate && today <= endDate) {
          status = 'ongoing';
          const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
          const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
          progress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));
        } else if (today < startDate) {
          status = 'upcoming';
          progress = 0;
        }

        return {
          id: trip._id,
          title: trip.tripName,
          destination: trip.description || 'Multiple destinations',
          dates: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
          image: trip.coverPhoto || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
          status,
          collaborators: 1,
          progress
        };
      });

    // Get popular destinations
    const popularCities = await City.find({ popularityScore: { $exists: true, $ne: null } })
      .sort({ popularityScore: -1 })
      .limit(4)
      .lean();

    const popularDestinations = popularCities.map(city => ({
      name: `${city.name}, ${city.country}`,
      image: `https://images.pexels.com/photos/161901/santorini-greece-island-161901.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1`,
      rating: (city.popularityScore / 100 * 5).toFixed(1),
      trips: Math.floor(city.popularityScore * 10),
      price: `$${Math.floor(city.costIndex * 100)}`
    }));

    res.json({
      stats: {
        totalTrips,
        countriesVisited,
        upcomingTrips,
        travelDays
      },
      recentTrips,
      popularDestinations
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
