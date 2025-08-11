const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profilePhoto: { 
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          return v === null || (typeof v === 'string' && v.length > 0);
        },
        message: 'Profile photo must be a valid URL string or null'
      }
    },
    languagePref: { type: String },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, unique: true, sparse: true },
    emailVerificationExpires: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

// Middleware to handle cascading deletes
userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    // Check if models exist before using them
    if (mongoose.models.Trip) {
      const Trip = mongoose.model('Trip');
      await Trip.deleteMany({ userId: this._id });
    }
    if (mongoose.models.Budget) {
      const Budget = mongoose.model('Budget');
      await Budget.deleteMany({ userId: this._id });
    }
    if (mongoose.models.SharedTrip) {
      const SharedTrip = mongoose.model('SharedTrip');
      await SharedTrip.deleteMany({ userId: this._id });
    }
    if (mongoose.models.AdminStat) {
      const AdminStat = mongoose.model('AdminStat');
      await AdminStat.deleteMany({ userId: this._id });
    }
    if (mongoose.models.Itinerary && mongoose.models.Trip) {
      const Itinerary = mongoose.model('Itinerary');
      const Trip = mongoose.model('Trip');
      const userTrips = await Trip.find({ userId: this._id });
      const tripIds = userTrips.map(trip => trip._id);
      await Itinerary.deleteMany({ tripId: { $in: tripIds } });
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Also handle deleteMany operations
userSchema.pre('deleteMany', async function(next) {
  try {
    // Get all user IDs that will be deleted
    const usersToDelete = await this.model.find(this.getQuery());
    const userIds = usersToDelete.map(user => user._id);

    // Check if models exist before using them
    if (mongoose.models.Trip) {
      const Trip = mongoose.model('Trip');
      await Trip.deleteMany({ userId: { $in: userIds } });
    }
    if (mongoose.models.Budget) {
      const Budget = mongoose.model('Budget');
      await Budget.deleteMany({ userId: { $in: userIds } });
    }
    if (mongoose.models.SharedTrip) {
      const SharedTrip = mongoose.model('SharedTrip');
      await SharedTrip.deleteMany({ userId: { $in: userIds } });
    }
    if (mongoose.models.AdminStat) {
      const AdminStat = mongoose.model('AdminStat');
      await AdminStat.deleteMany({ userId: { $in: userIds } });
    }
    if (mongoose.models.Itinerary && mongoose.models.Trip) {
      const Itinerary = mongoose.model('Itinerary');
      const Trip = mongoose.model('Trip');
      const userTrips = await Trip.find({ userId: { $in: userIds } });
      const tripIds = userTrips.map(trip => trip._id);
      await Itinerary.deleteMany({ tripId: { $in: tripIds } });
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
