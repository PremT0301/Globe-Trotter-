const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    destination: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: { type: Number, required: true, min: 1, default: 1 },
    budget: { type: Number },
    tripType: { 
      type: String, 
      enum: ['Adventure', 'Romantic', 'Cultural', 'Relaxation'],
      default: 'Adventure'
    },
    coverPhoto: { type: String },
    status: { 
      type: String, 
      enum: ['Planning', 'Active', 'Completed', 'Cancelled'],
      default: 'Planning'
    }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Middleware to handle cascading deletes
tripSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    // Check if models exist before using them
    if (mongoose.models.Itinerary) {
      const Itinerary = mongoose.model('Itinerary');
      await Itinerary.deleteMany({ tripId: this._id });
    }
    if (mongoose.models.Budget) {
      const Budget = mongoose.model('Budget');
      await Budget.deleteMany({ tripId: this._id });
    }
    if (mongoose.models.SharedTrip) {
      const SharedTrip = mongoose.model('SharedTrip');
      await SharedTrip.deleteMany({ tripId: this._id });
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Also handle deleteMany operations
tripSchema.pre('deleteMany', async function(next) {
  try {
    // Get all trip IDs that will be deleted
    const tripsToDelete = await this.model.find(this.getQuery());
    const tripIds = tripsToDelete.map(trip => trip._id);

    // Check if models exist before using them
    if (mongoose.models.Itinerary) {
      const Itinerary = mongoose.model('Itinerary');
      await Itinerary.deleteMany({ tripId: { $in: tripIds } });
    }
    if (mongoose.models.Budget) {
      const Budget = mongoose.model('Budget');
      await Budget.deleteMany({ tripId: { $in: tripIds } });
    }
    if (mongoose.models.SharedTrip) {
      const SharedTrip = mongoose.model('SharedTrip');
      await SharedTrip.deleteMany({ tripId: { $in: tripIds } });
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
