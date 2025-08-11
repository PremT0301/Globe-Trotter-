const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['activities', 'transport', 'accommodation', 'Food&Dining', 'flights', 'shopping']
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
