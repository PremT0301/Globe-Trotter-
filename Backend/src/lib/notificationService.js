const Notification = require('../models/Notification');
const User = require('../models/User');
const Trip = require('../models/Trip');

class NotificationService {
  /**
   * Create a notification for a user
   */
  static async createNotification(data) {
    try {
      const { recipientId, senderId, type, tripId, communityPostId, message, metadata = {} } = data;

      // Don't create notification if sender is the same as recipient
      if (senderId.toString() === recipientId.toString()) {
        return null;
      }

      const notification = await Notification.create({
        recipientId,
        senderId,
        type,
        tripId,
        communityPostId,
        message,
        metadata
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create like notification
   */
  static async createLikeNotification(senderId, tripId, communityPostId = null) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const sender = await User.findById(senderId);
      if (!sender) {
        throw new Error('Sender not found');
      }

      const message = `${sender.name} liked your trip "${trip.title}"`;

      return await this.createNotification({
        recipientId: trip.userId,
        senderId,
        type: 'like',
        tripId,
        communityPostId,
        message
      });
    } catch (error) {
      console.error('Error creating like notification:', error);
      throw error;
    }
  }

  /**
   * Create comment notification
   */
  static async createCommentNotification(senderId, tripId, communityPostId, commentText) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const sender = await User.findById(senderId);
      if (!sender) {
        throw new Error('Sender not found');
      }

      const truncatedComment = commentText.length > 50 
        ? commentText.substring(0, 50) + '...' 
        : commentText;

      const message = `${sender.name} commented on your trip "${trip.title}": "${truncatedComment}"`;

      return await this.createNotification({
        recipientId: trip.userId,
        senderId,
        type: 'comment',
        tripId,
        communityPostId,
        message,
        metadata: { commentText: truncatedComment }
      });
    } catch (error) {
      console.error('Error creating comment notification:', error);
      throw error;
    }
  }

  /**
   * Create share notification
   */
  static async createShareNotification(senderId, tripId) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const sender = await User.findById(senderId);
      if (!sender) {
        throw new Error('Sender not found');
      }

      const message = `${sender.name} shared your trip "${trip.title}" with the community`;

      return await this.createNotification({
        recipientId: trip.userId,
        senderId,
        type: 'share',
        tripId,
        message
      });
    } catch (error) {
      console.error('Error creating share notification:', error);
      throw error;
    }
  }

  /**
   * Create clone notification
   */
  static async createCloneNotification(senderId, tripId, communityPostId) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new Error('Trip not found');
      }

      const sender = await User.findById(senderId);
      if (!sender) {
        throw new Error('Sender not found');
      }

      const message = `${sender.name} cloned your trip "${trip.title}"`;

      return await this.createNotification({
        recipientId: trip.userId,
        senderId,
        type: 'clone',
        tripId,
        communityPostId,
        message
      });
    } catch (error) {
      console.error('Error creating clone notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const notifications = await Notification.find({ recipientId: userId })
        .populate('senderId', 'name profilePhoto')
        .populate('tripId', 'title destination coverPhoto')
        .populate('communityPostId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments({ recipientId: userId });
      const unreadCount = await Notification.countDocuments({ 
        recipientId: userId, 
        isRead: false 
      });

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: userId },
        { isRead: true },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipientId: userId, isRead: false },
        { isRead: true }
      );

      return result;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipientId: userId
      });

      return notification;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
