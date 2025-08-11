const mongoose = require('mongoose');
const City = require('./src/models/City');
require('dotenv').config();

async function checkCities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const cities = await City.find().lean();
    console.log('Cities in database:', cities);

    if (cities.length === 0) {
      console.log('No cities found. Creating a default city...');
      const defaultCity = await City.create({
        name: 'Default City',
        country: 'Default Country',
        costIndex: 1.0,
        popularityScore: 1.0
      });
      console.log('Created default city:', defaultCity);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkCities();
