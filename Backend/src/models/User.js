const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profilePhoto: { type: String },
    languagePref: { type: String },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, unique: true, sparse: true },
    emailVerificationExpires: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
