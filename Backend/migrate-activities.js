const mongoose = require('mongoose');
const Itinerary = require('./src/models/Itinerary');
const Activity = require('./src/models/Activity');
const City = require('./src/models/City');
require('dotenv').config();

async function migrateActivities() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get default city ID (you may need to adjust this)
    const defaultCity = await City.findOne();
    if (!defaultCity) {
      console.error('No city found in database. Please create a city first.');
      return;
    }

    // Find all itinerary items that have activity data stored in notes
    const itineraryItems = await Itinerary.find({
      notes: { $exists: true, $ne: null, $ne: '' },
      activityId: null
    });

    console.log(`Found ${itineraryItems.length} itinerary items to migrate`);

    for (const item of itineraryItems) {
      try {
        // Parse the activity data from notes
        const activityData = JSON.parse(item.notes);
        
        // Create new activity
        const newActivity = await Activity.create({
          cityId: defaultCity._id,
          name: activityData.title || 'Unknown Activity',
          type: activityData.type || 'activity',
          cost: activityData.cost || 0,
          duration: parseInt(activityData.duration) || 60,
          description: activityData.notes || '',
          imageUrl: ''
        });

        // Update itinerary item to reference the new activity
        await Itinerary.findByIdAndUpdate(item._id, {
          activityId: newActivity._id,
          notes: activityData.notes || '' // Keep only the notes, not the full activity data
        });

        console.log(`Migrated activity: ${activityData.title}`);
      } catch (error) {
        console.error(`Error migrating item ${item._id}:`, error.message);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateActivities();
}

module.exports = migrateActivities;
