const mongoose = require('mongoose');

const sharedTripSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    publicUrl: { type: String, required: true, unique: true },
    shareDate: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.models.SharedTrip || mongoose.model('SharedTrip', sharedTripSchema);
