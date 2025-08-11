const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true, index: true },
    name: { type: String, required: true },
    activityType: { type: String, required: true },
    cost: { type: Number },
    duration: { type: Number },
    description: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: false }
);

module.exports = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
