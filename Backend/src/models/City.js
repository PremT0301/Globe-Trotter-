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

module.exports = mongoose.models.City || mongoose.model('City', citySchema);
