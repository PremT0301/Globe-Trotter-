const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    date: { type: Date, required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    orderIndex: { type: Number, required: true, default: 0 },
  },
  { timestamps: false }
);

itinerarySchema.index({ tripId: 1, date: 1, orderIndex: 1 }, { unique: true });

module.exports = mongoose.models.Itinerary || mongoose.model('Itinerary', itinerarySchema);
