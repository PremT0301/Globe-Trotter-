require('dotenv').config();
const mongoose = require('mongoose');

async function testTrip() {
  try {
    console.log('🧪 Testing Trip model...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear database
    await mongoose.connection.db.dropDatabase();
    console.log('🧹 Cleared database');

    // Clear Mongoose model cache (only if models exist)
    try {
      mongoose.deleteModel('Trip');
    } catch (e) {}
    try {
      mongoose.deleteModel('User');
    } catch (e) {}

    // Import models
    const User = require('./src/models/User');
    const Trip = require('./src/models/Trip');

    // Create a test user
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash('test123', 12);
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      passwordHash: passwordHash,
      emailVerified: true
    });
    console.log('👤 Created test user');

    // Test creating a trip
    const tripData = {
      userId: testUser._id,
      title: 'Test Trip',
      destination: 'Test Destination',
      description: 'Test description',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-30'),
      travelers: 2,
      budget: 5000,
      tripType: 'Adventure',
      status: 'Planning'
    };

    console.log('Trip data:', JSON.stringify(tripData, null, 2));
    
    const trip = await Trip.create(tripData);
    console.log('✅ Trip created successfully:', trip.title);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testTrip();
