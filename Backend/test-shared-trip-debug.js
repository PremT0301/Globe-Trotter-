const mongoose = require('mongoose');
require('dotenv').config();

// Import all models to register them
require('./src/models/User');
require('./src/models/Trip');
require('./src/models/SharedTrip');
require('./src/models/CommunityPost');
require('./src/models/Itinerary');
require('./src/models/Budget');
require('./src/models/Activity');
require('./src/models/City');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const SharedTrip = require('./src/models/SharedTrip');
const CommunityPost = require('./src/models/CommunityPost');

async function debugSharedTrips() {
  try {
    console.log('\n🔍 Checking Shared Trips...');
    const sharedTrips = await SharedTrip.find().populate('tripId', 'title destination');
    
    console.log(`📊 Found ${sharedTrips.length} shared trips:`);
    sharedTrips.forEach(st => {
      console.log(`  - Trip: "${st.tripId.title}" (${st.tripId.destination})`);
      console.log(`    Trip ID: ${st.tripId._id}`);
      console.log(`    Public URL: ${st.publicUrl}`);
      console.log('');
    });

    console.log('\n🔍 Checking Community Posts...');
    const communityPosts = await CommunityPost.find().populate('tripId', 'title destination');
    
    console.log(`📊 Found ${communityPosts.length} community posts:`);
    communityPosts.forEach(cp => {
      console.log(`  - Post: "${cp.title}"`);
      console.log(`    Trip: "${cp.tripId.title}" (${cp.tripId.destination})`);
      console.log(`    Trip ID: ${cp.tripId._id}`);
      console.log('');
    });

    // Check for mismatches
    console.log('\n🔍 Checking for mismatches...');
    const sharedTripIds = sharedTrips.map(st => st.tripId._id.toString());
    const communityTripIds = communityPosts.map(cp => cp.tripId._id.toString());

    communityPosts.forEach(cp => {
      const hasSharedTrip = sharedTripIds.includes(cp.tripId._id.toString());
      console.log(`  - Post "${cp.title}": ${hasSharedTrip ? '✅ Has shared trip' : '❌ No shared trip'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugSharedTrips();
