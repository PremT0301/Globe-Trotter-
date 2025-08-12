const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'share', 'clone'],
      required: true
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    },
    communityPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityPost'
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { 
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    indexes: [
      { recipientId: 1, isRead: 1 },
      { recipientId: 1, createdAt: -1 }
    ]
  }
);

// Create compound index for efficient queries
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
