const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get all community posts (public feed)
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sort = 'latest' } = req.query;
    const skip = (page - 1) * limit;

    let query = { isPublic: true, status: 'active' };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { likes: -1, views: -1 };
        break;
      case 'trending':
        sortOption = { 'comments.length': -1, likes: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const posts = await CommunityPost.find(query)
      .populate('userId', 'name email profilePhoto')
      .populate('tripId', 'title destination description startDate endDate travelers tripType coverPhoto')
      .populate('comments.userId', 'name profilePhoto')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CommunityPost.countDocuments(query);

    res.json({
      posts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new community post
router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { tripId, title, description, tags } = req.body;

    // Verify the trip exists and belongs to the user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const post = new CommunityPost({
      userId: req.user.id,
      tripId,
      title: title || trip.title,
      description: description || trip.description,
      coverImage: trip.coverPhoto,
      tags: tags || []
    });

    await post.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('userId', 'name email profilePhoto')
      .populate('tripId', 'title destination description startDate endDate travelers tripType coverPhoto');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like/Unlike a post
router.post('/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likes: post.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Add comment to a post
router.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await CommunityPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      userId: req.user.id,
      text: text.trim()
    });

    await post.save();

    const populatedPost = await CommunityPost.findById(post._id)
      .populate('comments.userId', 'name profilePhoto');

    const newComment = populatedPost.comments[populatedPost.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Clone a trip from a community post
router.post('/posts/:postId/clone', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const post = await CommunityPost.findById(req.params.postId)
      .populate('tripId');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user already cloned this post
    const alreadyCloned = post.clones.some(clone => clone.userId.toString() === req.user.id);
    if (alreadyCloned) {
      return res.status(400).json({ error: 'You have already cloned this trip' });
    }

    // Create a new trip based on the original
    const originalTrip = post.tripId;
    const newTrip = new Trip({
      userId: req.user.id,
      title: title || `${originalTrip.title} (Cloned)`,
      destination: originalTrip.destination,
      description: description || originalTrip.description,
      startDate: originalTrip.startDate,
      endDate: originalTrip.endDate,
      travelers: originalTrip.travelers,
      budget: originalTrip.budget,
      tripType: originalTrip.tripType,
      coverPhoto: originalTrip.coverPhoto,
      status: 'Planning'
    });

    await newTrip.save();

    // Add clone record to the post
    post.clones.push({
      userId: req.user.id,
      clonedAt: new Date()
    });
    await post.save();

    res.status(201).json({
      message: 'Trip cloned successfully',
      tripId: newTrip._id,
      clones: post.clones.length
    });
  } catch (error) {
    console.error('Error cloning trip:', error);
    res.status(500).json({ error: 'Failed to clone trip' });
  }
});

// Get a specific post with full details
router.get('/posts/:postId', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId)
      .populate('userId', 'name email profilePhoto')
      .populate('tripId', 'title destination description startDate endDate travelers tripType coverPhoto')
      .populate('comments.userId', 'name profilePhoto')
      .populate('likes', 'name profilePhoto');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Get user's posts
router.get('/user/posts', authenticateToken, async (req, res) => {
  try {
    const posts = await CommunityPost.find({ userId: req.user.id })
      .populate('tripId', 'title destination')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

// Delete a post (only by the author)
router.delete('/posts/:postId', authenticateToken, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await CommunityPost.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Get trending posts
router.get('/trending', async (req, res) => {
  try {
    const trendingPosts = await CommunityPost.find({ isPublic: true, status: 'active' })
      .populate('userId', 'name profilePhoto')
      .populate('tripId', 'title destination tripType')
      .sort({ likes: -1, views: -1, 'comments.length': -1 })
      .limit(5);

    res.json(trendingPosts);
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
});

module.exports = router;
