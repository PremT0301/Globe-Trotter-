const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    tags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    clones: [{ 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      clonedAt: { type: Date, default: Date.now }
    }],
    views: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
    status: { 
      type: String, 
      enum: ['active', 'archived', 'deleted'],
      default: 'active'
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ likes: 1 });
communityPostSchema.index({ tags: 1 });
communityPostSchema.index({ isPublic: 1, status: 1 });

module.exports = mongoose.models.CommunityPost || mongoose.model('CommunityPost', communityPostSchema);
