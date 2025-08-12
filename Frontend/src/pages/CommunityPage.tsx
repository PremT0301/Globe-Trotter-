import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Copy, 
  User, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Search, 
  Filter,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit,
  Plane,
  Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

interface Comment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profilePhoto?: string;
  };
  text: string;
  createdAt: string;
}

interface Trip {
  _id: string;
  title: string;
  destination: string;
  description: string;
  startDate: string;
  endDate: string;
  tripType: string;
  coverPhoto?: string;
}

interface CommunityPost {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  tripId: {
    _id: string;
    title: string;
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    travelers: number;
    tripType: string;
    coverPhoto?: string;
  };
  title: string;
  description: string;
  coverImage?: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  clones: Array<{
    userId: string;
    clonedAt: string;
  }>;
  views: number;
  createdAt: string;
  isPublic: boolean;
  status: string;
}

const CommunityPage: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingPost, setLikingPost] = useState<string | null>(null);
  const [cloningPost, setCloningPost] = useState<string | null>(null);
  const [showTripSelectionModal, setShowTripSelectionModal] = useState(false);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [sharedTrips, setSharedTrips] = useState<any[]>([]);
  const [showSharedTrips, setShowSharedTrips] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, sortBy]);

  const fetchSharedTrips = async () => {
    try {
      const response = await api.get('/api/shared/explore?limit=10');
      setSharedTrips(response.sharedTrips);
    } catch (error) {
      console.error('Error fetching shared trips:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/community/posts?page=${currentPage}&limit=10&search=${searchTerm}&sort=${sortBy}`);
      setPosts(response.posts);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching community posts:', error);
      showToast('error', 'Error', 'Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      showToast('error', 'Login Required', 'Please login to like posts');
      return;
    }

    try {
      setLikingPost(postId);
      const response = await api.post(`/api/community/posts/${postId}/like`);
      
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            likes: response.isLiked 
              ? [...post.likes, user.id]
              : post.likes.filter(id => id !== user.id)
          };
        }
        return post;
      }));

      showToast('success', 'Success', response.isLiked ? 'Post liked!' : 'Post unliked');
    } catch (error) {
      console.error('Error toggling like:', error);
      showToast('error', 'Error', 'Failed to like post');
    } finally {
      setLikingPost(null);
    }
  };

  const handleComment = async (postId: string) => {
    if (!user) {
      showToast('error', 'Login Required', 'Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      showToast('error', 'Error', 'Comment cannot be empty');
      return;
    }

    try {
      setSubmittingComment(true);
      const newComment = await api.post(`/api/community/posts/${postId}/comments`, { text: commentText });
      
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));

      setCommentText('');
      setShowCommentInput(null);
      showToast('success', 'Success', 'Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast('error', 'Error', 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleClone = async (post: CommunityPost) => {
    if (!user) {
      showToast('error', 'Login Required', 'Please login to clone trips');
      return;
    }

    try {
      setCloningPost(post._id);
      const response = await api.post(`/api/community/posts/${post._id}/clone`, {
        title: `${post.title} (Cloned)`,
        description: post.description
      });
      
      showToast('success', 'Trip Cloned!', 'The trip has been added to your trips');
      navigate(`/itinerary-builder/${response.tripId}`);
    } catch (error) {
      console.error('Error cloning trip:', error);
      if (error.response?.status === 400) {
        showToast('error', 'Already Cloned', 'You have already cloned this trip');
      } else {
        showToast('error', 'Error', 'Failed to clone trip');
      }
    } finally {
      setCloningPost(null);
    }
  };

  const fetchUserTrips = async () => {
    setIsLoadingTrips(true);
    try {
      const trips = await api.get<Trip[]>('/api/trips');
      setUserTrips(trips);
    } catch (error) {
      console.error('Error fetching user trips:', error);
      showToast('error', 'Error', 'Failed to fetch your trips');
    } finally {
      setIsLoadingTrips(false);
    }
  };

  const handleShareFromMyTrips = async () => {
    await fetchUserTrips();
    setShowTripSelectionModal(true);
  };

  const handleShareSelectedTrip = async () => {
    if (!selectedTripId) {
      showToast('error', 'Error', 'Please select a trip to share');
      return;
    }

    try {
      const selectedTrip = userTrips.find(trip => trip._id === selectedTripId);
      if (!selectedTrip) {
        showToast('error', 'Error', 'Selected trip not found');
        return;
      }

      await api.post('/api/community/posts', {
        tripId: selectedTripId,
        title: selectedTrip.title,
        description: selectedTrip.description,
        tags: [selectedTrip.destination.toLowerCase(), selectedTrip.tripType.toLowerCase()]
      });
      
      showToast('success', 'Shared to Community!', 'Your trip is now visible to the community');
      setShowTripSelectionModal(false);
      setSelectedTripId(null);
      fetchPosts(); // Refresh the posts
    } catch (error) {
      console.error('Error sharing to community:', error);
      showToast('error', 'Error', 'Failed to share to community');
    }
  };

  const copyShareLink = async (postId: string) => {
    const shareUrl = `${window.location.origin}/community/post/${postId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('success', 'Link Copied!', 'Share link copied to clipboard');
    } catch (error) {
      showToast('error', 'Error', 'Failed to copy link');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTripDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Community</h1>
          <p className="text-xl text-gray-600 mb-6">Share your adventures and discover amazing trips from fellow travelers</p>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={handleShareFromMyTrips}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plane className="h-5 w-5 mr-2" />
              Share from My Trips
            </button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
          
          {/* Toggle for Shared Trips */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                setShowSharedTrips(!showSharedTrips);
                if (!showSharedTrips) {
                  fetchSharedTrips();
                }
              }}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Share2 className="h-5 w-5 mr-2" />
              {showSharedTrips ? 'Hide Shared Trips' : 'Show Shared Trips'}
            </button>
          </div>
        </motion.div>

        {/* Shared Trips Section */}
        {showSharedTrips && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shared Trips with Community Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedTrips.map((sharedTrip, index) => (
                <motion.div
                  key={sharedTrip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={sharedTrip.tripId.coverPhoto || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=1'}
                      alt={sharedTrip.tripId.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {sharedTrip.communityPost && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                          Community Post
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-white mb-1">{sharedTrip.tripId.title}</h3>
                      <p className="text-white/90 text-sm">{sharedTrip.tripId.destination}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(sharedTrip.tripId.startDate).toLocaleDateString()} - {new Date(sharedTrip.tripId.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {sharedTrip.tripId.travelers || 1} travelers
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{sharedTrip.tripId.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/shared/${sharedTrip.publicUrl}`}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                      >
                        View Shared Trip
                        <Share2 className="h-4 w-4 ml-1" />
                      </Link>
                      
                      {sharedTrip.communityPost && (
                        <Link
                          to={`/community/post/${sharedTrip.communityPost._id}`}
                          className="text-green-600 hover:text-green-700 font-medium flex items-center"
                        >
                          View Community Post
                          <MessageCircle className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {sharedTrips.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No shared trips found</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Posts Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        {post.userId.profilePhoto ? (
                          <img
                            src={post.userId.profilePhoto}
                            alt={post.userId.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.userId.name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{post.views} views</span>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreHorizontal className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
                  
                  {post.coverImage && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <p className="text-gray-700 mb-4 leading-relaxed">{post.description}</p>

                  {/* Trip Details */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {post.tripId.destination}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {calculateDuration(post.tripId.startDate, post.tripId.endDate)} days
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {post.tripId.travelers} travelers
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post._id)}
                        disabled={likingPost === post._id}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          user && post.likes.includes(user.id)
                            ? 'text-red-500 bg-red-50'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${user && post.likes.includes(user.id) ? 'fill-current' : ''}`} />
                        <span>{post.likes.length}</span>
                      </button>

                      <button
                        onClick={() => setShowCommentInput(showCommentInput === post._id ? null : post._id)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments.length}</span>
                      </button>

                      <button
                        onClick={() => copyShareLink(post._id)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Share2 className="h-5 w-5" />
                        <span>Share</span>
                      </button>

                      <button
                        onClick={() => handleClone(post)}
                        disabled={cloningPost === post._id}
                        className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Copy className="h-5 w-5" />
                        <span>{post.clones.length} Cloned</span>
                      </button>
                    </div>

                    <Link
                      to={`/shared/${post.tripId._id}`}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Trip
                    </Link>
                  </div>

                  {/* Comments Section */}
                  {showCommentInput === post._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="flex space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          {user?.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={2}
                          />
                          <div className="flex justify-end mt-2 space-x-2">
                            <button
                              onClick={() => setShowCommentInput(null)}
                              className="px-4 py-1 text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleComment(post._id)}
                              disabled={submittingComment || !commentText.trim()}
                              className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Comments List */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="space-y-3">
                        {post.comments.map((comment) => (
                          <div key={comment._id} className="flex space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                              {comment.userId.profilePhoto ? (
                                <img
                                  src={comment.userId.profilePhoto}
                                  alt={comment.userId.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm text-gray-900">
                                    {comment.userId.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to share your travel experience!'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleShareFromMyTrips}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share from My Trips
              </button>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center space-x-2 mt-8"
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Trip Selection Modal */}
        <AnimatePresence>
          {showTripSelectionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Trip</h3>
                  <p className="text-gray-600">Select a trip from your collection to share with the community</p>
                </div>

                {isLoadingTrips ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading your trips...</span>
                  </div>
                ) : userTrips.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plane className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Trips Found</h4>
                    <p className="text-gray-600 mb-4">You don't have any trips to share yet.</p>
                    <div className="space-y-3">
                      <Link
                        to="/create-trip"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Trip
                      </Link>
                      <button
                        onClick={() => setShowTripSelectionModal(false)}
                        className="block w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 mb-6">
                      {userTrips.map((trip) => (
                        <motion.div
                          key={trip._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            selectedTripId === trip._id
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedTripId(trip._id)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                src={trip.coverPhoto || 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'}
                                alt={trip.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-gray-900 truncate">{trip.title}</h4>
                              <p className="text-sm text-gray-600 mb-1">{trip.destination}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatTripDate(trip.startDate)} - {formatTripDate(trip.endDate)}
                                </span>
                                <span className="flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  {trip.tripType}
                                </span>
                              </div>
                            </div>
                            {selectedTripId === trip._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleShareSelectedTrip}
                        disabled={!selectedTripId}
                        className={`flex-1 py-3 px-6 rounded-xl transition-colors ${
                          selectedTripId
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Share Selected Trip
                      </button>
                      <button
                        onClick={() => {
                          setShowTripSelectionModal(false);
                          setSelectedTripId(null);
                        }}
                        className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommunityPage;
