const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    costIndex: { type: Number },
    popularityScore: { type: Number },
  },
  { timestamps: false }
);

citySchema.index({ name: 1, country: 1 }, { unique: true });

// Middleware to handle cascading deletes
citySchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    // Check if models exist before using them
    if (mongoose.models.Activity) {
      const Activity = mongoose.model('Activity');
      await Activity.deleteMany({ cityId: this._id });
    }
    if (mongoose.models.Itinerary) {
      const Itinerary = mongoose.model('Itinerary');
      await Itinerary.deleteMany({ cityId: this._id });
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Also handle deleteMany operations
citySchema.pre('deleteMany', async function(next) {
  try {
    // Get all city IDs that will be deleted
    const citiesToDelete = await this.model.find(this.getQuery());
    const cityIds = citiesToDelete.map(city => city._id);

    // Check if models exist before using them
    if (mongoose.models.Activity) {
      const Activity = mongoose.model('Activity');
      await Activity.deleteMany({ cityId: { $in: cityIds } });
    }
    if (mongoose.models.Itinerary) {
      const Itinerary = mongoose.model('Itinerary');
      await Itinerary.deleteMany({ cityId: { $in: cityIds } });
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.models.City || mongoose.model('City', citySchema);
