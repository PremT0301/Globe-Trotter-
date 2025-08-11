const mongoose = require('mongoose');

const adminStatSchema = new mongoose.Schema(
  {
    metricName: { type: String, required: true, index: true },
    metricValue: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: false }
);

adminStatSchema.index({ metricName: 1, date: 1 });

module.exports = mongoose.models.AdminStat || mongoose.model('AdminStat', adminStatSchema);
