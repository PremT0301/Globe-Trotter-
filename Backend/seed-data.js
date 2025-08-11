require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Trip = require('./src/models/Trip');
const City = require('./src/models/City');
const Itinerary = require('./src/models/Itinerary');
const Activity = require('./src/models/Activity');

async function seedData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Trip.deleteMany({});
    await City.deleteMany({});
    await Itinerary.deleteMany({});
    await Activity.deleteMany({});

    // Create sample cities
    console.log('🏙️ Creating sample cities...');
    const cities = await City.create([
      {
        name: 'Paris',
        country: 'France',
        costIndex: 85.5,
        popularityScore: 95.2
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        costIndex: 78.3,
        popularityScore: 92.1
      },
      {
        name: 'New York',
        country: 'USA',
        costIndex: 88.7,
        popularityScore: 89.5
      },
      {
        name: 'London',
        country: 'UK',
        costIndex: 82.1,
        popularityScore: 87.3
      },
      {
        name: 'Barcelona',
        country: 'Spain',
        costIndex: 65.4,
        popularityScore: 84.2
      },
      {
        name: 'Rome',
        country: 'Italy',
        costIndex: 72.8,
        popularityScore: 86.7
      },
      {
        name: 'Amsterdam',
        country: 'Netherlands',
        costIndex: 75.9,
        popularityScore: 81.4
      },
      {
        name: 'Berlin',
        country: 'Germany',
        costIndex: 68.2,
        popularityScore: 79.8
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        costIndex: 45.6,
        popularityScore: 76.3
      },
      {
        name: 'Santorini',
        country: 'Greece',
        costIndex: 58.9,
        popularityScore: 88.1
      }
    ]);

    // Create sample activities for cities
    console.log('🎯 Creating sample activities...');
    const activities = [];
    for (const city of cities) {
      const cityActivities = await Activity.create([
        {
          cityId: city._id,
          name: `${city.name} City Tour`,
          type: 'Sightseeing',
          cost: Math.floor(Math.random() * 50) + 20,
          duration: 120,
          description: `Explore the beautiful city of ${city.name} with a guided tour.`
        },
        {
          cityId: city._id,
          name: `${city.name} Food Experience`,
          type: 'Food',
          cost: Math.floor(Math.random() * 40) + 15,
          duration: 90,
          description: `Taste the local cuisine of ${city.name}.`
        },
        {
          cityId: city._id,
          name: `${city.name} Museum Visit`,
          type: 'Culture',
          cost: Math.floor(Math.random() * 30) + 10,
          duration: 180,
          description: `Visit the famous museums in ${city.name}.`
        }
      ]);
      activities.push(...cityActivities);
    }

    // Create a test user
    console.log('👤 Creating test user...');
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('test123', 12);
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: passwordHash,
      emailVerified: true
    });

    // Create sample trips for the test user
    console.log('✈️ Creating sample trips...');
    const trips = await Trip.create([
      {
        userId: testUser._id,
        tripName: 'European Adventure',
        description: 'Paris, Rome, Barcelona',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-30'),
        coverPhoto: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        userId: testUser._id,
        tripName: 'Tokyo Explorer',
        description: 'Tokyo, Japan',
        startDate: new Date('2024-03-10'),
        endDate: new Date('2024-03-20'),
        coverPhoto: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        userId: testUser._id,
        tripName: 'Bali Retreat',
        description: 'Bali, Indonesia',
        startDate: new Date('2024-08-05'),
        endDate: new Date('2024-08-15'),
        coverPhoto: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        userId: testUser._id,
        tripName: 'New York City',
        description: 'New York, USA',
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-27'),
        coverPhoto: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      }
    ]);

    // Create sample itineraries
    console.log('🗓️ Creating sample itineraries...');
    const itineraries = [];
    for (const trip of trips) {
      const tripCities = cities.slice(0, 3); // Use first 3 cities for each trip
      for (let i = 0; i < tripCities.length; i++) {
        const city = tripCities[i];
        const startDate = new Date(trip.startDate);
        startDate.setDate(startDate.getDate() + i * 2); // Spread activities over trip
        
        const itinerary = await Itinerary.create({
          tripId: trip._id,
          cityId: city._id,
          date: startDate,
          activityId: activities.find(a => a.cityId.toString() === city._id.toString())?._id,
          orderIndex: i
        });
        itineraries.push(itinerary);
      }
    }

    console.log('✅ Seed data created successfully!');
    console.log(`📊 Created ${cities.length} cities`);
    console.log(`🎯 Created ${activities.length} activities`);
    console.log(`👤 Created 1 test user (test@example.com / test123)`);
    console.log(`✈️ Created ${trips.length} trips`);
    console.log(`🗓️ Created ${itineraries.length} itineraries`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed data error:', error);
    process.exit(1);
  }
}

seedData();
