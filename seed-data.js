require('dotenv').config();
const mongoose = require('mongoose');

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear Mongoose model cache to ensure fresh models (only if they exist)
    try { mongoose.deleteModel('Trip'); } catch (e) {}
    try { mongoose.deleteModel('User'); } catch (e) {}
    try { mongoose.deleteModel('City'); } catch (e) {}
    try { mongoose.deleteModel('Activity'); } catch (e) {}
    try { mongoose.deleteModel('Itinerary'); } catch (e) {}

    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('🧹 Cleared existing data');

    // Import models after clearing cache
    const User = require('./src/models/User');
    const City = require('./src/models/City');
    const Activity = require('./src/models/Activity');

    // Create test user first
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('test123', 12);
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: passwordHash, // password: test123
      emailVerified: true
    });
    console.log('👤 Created test user');

    // Create sample cities
    const sampleCities = [
      {
        name: 'Paris',
        country: 'France',
        description: 'The City of Light',
        imageUrl: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        description: 'Modern meets Traditional',
        imageUrl: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        description: 'Island Paradise',
        imageUrl: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      },
      {
        name: 'New York',
        country: 'USA',
        description: 'The Big Apple',
        imageUrl: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      }
    ];

    const createdCities = await City.insertMany(sampleCities);
    console.log('🏙️ Created sample cities');

    // Create sample activities
    const sampleActivities = [
      {
        name: 'Eiffel Tower Visit',
        activityType: 'Sightseeing',
        description: 'Visit the iconic Eiffel Tower',
        cityId: createdCities[0]._id, // Paris
        duration: 2,
        cost: 30,
        imageUrl: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      },
      {
        name: 'Louvre Museum',
        activityType: 'Cultural',
        description: 'Explore the world-famous art museum',
        cityId: createdCities[0]._id, // Paris
        duration: 3,
        cost: 20,
        imageUrl: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      },
      {
        name: 'Shibuya Crossing',
        activityType: 'Sightseeing',
        description: 'Experience the famous pedestrian crossing',
        cityId: createdCities[1]._id, // Tokyo
        duration: 1,
        cost: 0,
        imageUrl: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      },
      {
        name: 'Beach Relaxation',
        activityType: 'Relaxation',
        description: 'Relax on beautiful Bali beaches',
        cityId: createdCities[2]._id, // Bali
        duration: 4,
        cost: 0,
        imageUrl: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      }
    ];

    console.log('Sample activities data:', JSON.stringify(sampleActivities, null, 2));
    const createdActivities = await Activity.insertMany(sampleActivities);
    console.log('🎯 Created sample activities');

    console.log('About to create trips...');
    
    // Import Trip model after other models are created
    const Trip = require('./src/models/Trip');
    
    // Create sample trips
    const sampleTrips = [
      {
        userId: testUser._id,
        title: 'European Adventure 2024',
        destination: 'Paris, France',
        description: 'Exploring the beautiful cities of Europe including Paris, Rome, and Barcelona.',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-30'),
        travelers: 2,
        budget: 5000,
        tripType: 'Cultural',
        status: 'Planning',
        coverPhoto: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      },
      {
        userId: testUser._id,
        title: 'Tokyo Exploration',
        destination: 'Tokyo, Japan',
        description: 'Discovering the modern and traditional aspects of Tokyo.',
        startDate: new Date('2024-08-10'),
        endDate: new Date('2024-08-20'),
        travelers: 1,
        budget: 3000,
        tripType: 'Adventure',
        status: 'Planning',
        coverPhoto: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      },
      {
        userId: testUser._id,
        title: 'Bali Paradise',
        destination: 'Bali, Indonesia',
        description: 'Relaxing beach vacation in the beautiful island of Bali.',
        startDate: new Date('2024-09-05'),
        endDate: new Date('2024-09-15'),
        travelers: 2,
        budget: 4000,
        tripType: 'Relaxation',
        status: 'Planning',
        coverPhoto: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
      }
    ];

    console.log('Sample trips data:', JSON.stringify(sampleTrips, null, 2));
    
    // Create trips one by one to identify the issue
    const createdTrips = [];
    for (let i = 0; i < sampleTrips.length; i++) {
      try {
        console.log(`Creating trip ${i + 1}:`, sampleTrips[i].title);
        const trip = await Trip.create(sampleTrips[i]);
        createdTrips.push(trip);
        console.log(`✅ Created trip: ${trip.title}`);
      } catch (error) {
        console.error(`❌ Failed to create trip ${i + 1}:`, error.message);
        throw error;
      }
    }
    console.log('✈️ Created sample trips');

    // Import Itinerary model after trips are created
    const Itinerary = require('./src/models/Itinerary');
    
    // Create sample itineraries
    const sampleItineraries = [
      {
        tripId: createdTrips[0]._id,
        cityId: createdCities[0]._id, // Paris
        activityId: createdActivities[0]._id, // Eiffel Tower
        date: new Date('2024-06-16'),
        orderIndex: 0
      },
      {
        tripId: createdTrips[0]._id,
        cityId: createdCities[0]._id, // Paris
        activityId: createdActivities[1]._id, // Louvre
        date: new Date('2024-06-17'),
        orderIndex: 1
      },
      {
        tripId: createdTrips[1]._id,
        cityId: createdCities[1]._id, // Tokyo
        activityId: createdActivities[2]._id, // Shibuya Crossing
        date: new Date('2024-08-11'),
        orderIndex: 0
      },
      {
        tripId: createdTrips[2]._id,
        cityId: createdCities[2]._id, // Bali
        activityId: createdActivities[3]._id, // Beach Relaxation
        date: new Date('2024-09-06'),
        orderIndex: 0
      }
    ];

    await Itinerary.insertMany(sampleItineraries);
    console.log('📅 Created sample itineraries');

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created: ${await User.countDocuments()} users, ${await Trip.countDocuments()} trips, ${await City.countDocuments()} cities, ${await Activity.countDocuments()} activities, ${await Itinerary.countDocuments()} itineraries`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed data error:', error);
    process.exit(1);
  }
}

seedData();



