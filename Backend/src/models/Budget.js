const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true },
    totalEstimatedCost: { type: Number },
    transportCost: { type: Number },
    accommodationCost: { type: Number },
    activitiesCost: { type: Number },
    dailyAverageCost: { type: Number },
  },
  { timestamps: false }
);

module.exports = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
