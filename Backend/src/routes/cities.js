const express = require('express');
const City = require('../models/City');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public listing and search
router.get('/', async (req, res) => {
  try {
    const { q, country, limit = 50 } = req.query;
    const filters = {};
    
    if (q) {
      filters.$or = [
        { name: { $regex: String(q), $options: 'i' } },
        { country: { $regex: String(q), $options: 'i' } },
      ];
    }
    
    if (country) {
      filters.country = { $regex: String(country), $options: 'i' };
    }

    const cities = await City.find(filters)
      .sort({ popularityScore: -1, name: 1 })
      .limit(parseInt(limit))
      .lean();
      
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
});

// Get city by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id).lean();
    
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    
    res.json(city);
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ message: 'Failed to fetch city' });
  }
});

// Get popular cities
router.get('/popular/list', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularCities = await City.find({ 
      popularityScore: { $exists: true, $ne: null } 
    })
      .sort({ popularityScore: -1 })
      .limit(parseInt(limit))
      .lean();
      
    res.json(popularCities);
  } catch (error) {
    console.error('Error fetching popular cities:', error);
    res.status(500).json({ message: 'Failed to fetch popular cities' });
  }
});

// Get cities by country
router.get('/country/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const { limit = 50 } = req.query;
    
    const cities = await City.find({ 
      country: { $regex: country, $options: 'i' } 
    })
      .sort({ popularityScore: -1, name: 1 })
      .limit(parseInt(limit))
      .lean();
      
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities by country:', error);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
});

// Admin add city (requires authentication)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, country, costIndex, popularityScore, image } = req.body;
    
    // Validate required fields
    if (!name || !country) {
      return res.status(400).json({ 
        message: 'Name and country are required' 
      });
    }
    
    // Check if city already exists
    const existingCity = await City.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      country: { $regex: new RegExp(`^${country}$`, 'i') }
    }).lean();
    
    if (existingCity) {
      return res.status(409).json({ 
        message: 'City already exists' 
      });
    }
    
    const city = await City.create({ 
      name, 
      country, 
      costIndex: costIndex || 50, 
      popularityScore: popularityScore || 50,
      image: image || null
    });
    
    res.status(201).json(city);
  } catch (error) {
    console.error('Error creating city:', error);
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'City already exists' 
      });
    }
    res.status(500).json({ message: 'Failed to create city' });
  }
});

// Admin update city
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country, costIndex, popularityScore, image } = req.body;
    
    const city = await City.findByIdAndUpdate(
      id,
      { name, country, costIndex, popularityScore, image },
      { new: true }
    ).lean();
    
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    
    res.json(city);
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ message: 'Failed to update city' });
  }
});

// Admin delete city
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const city = await City.findByIdAndDelete(id);
    
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    console.error('Error deleting city:', error);
    res.status(500).json({ message: 'Failed to delete city' });
  }
});

module.exports = router;


