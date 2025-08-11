const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }, // attraction, restaurant, hotel, transport, activity
    cost: { type: Number, default: 0 },
    duration: { type: Number, default: 60 }, // in minutes
    description: { type: String },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

// Index for efficient queries
activitySchema.index({ cityId: 1, type: 1 });

module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
