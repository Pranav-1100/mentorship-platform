"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star,
  User,
  MessageSquare,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { getMyReviews, createReview, updateReview, deleteReview } from '@/lib/api/reviews';
import { getConnections } from '@/lib/api/connections';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

export default function ReviewsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    connectionId: '',
    rating: 5,
    comment: ''
  });

  // Fetch user's reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: getMyReviews,
    staleTime: 60 * 1000,
  });

  // Fetch connections for review form
  const { data: connections = [] } = useQuery({
    queryKey: ['connections'],
    queryFn: getConnections,
    staleTime: 60 * 1000,
  });

  // Create review mutation
  const createMutation = useMutation({
    mutationFn: ({ connectionId, rating, comment }) => createReview(connectionId, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review submitted successfully!');
      setIsWritingReview(false);
      setReviewForm({ connectionId: '', rating: 5, comment: '' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });

  // Update review mutation
  const updateMutation = useMutation({
    mutationFn: ({ reviewId, rating, comment }) => updateReview(reviewId, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review updated successfully!');
      setEditingReview(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update review');
    },
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews']);
      toast.success('Review deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete review');
    },
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.connectionId) {
      toast.error('Please select a connection');
      return;
    }
    createMutation.mutate(reviewForm);
  };

  const handleUpdateReview = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      reviewId: editingReview.id,
      rating: editingReview.rating,
      comment: editingReview.comment
    });
  };

  const handleDeleteReview = (reviewId) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate(reviewId);
    }
  };

  const handleStartEdit = (review) => {
    setEditingReview({
      id: review.id,
      rating: review.rating,
      comment: review.comment || ''
    });
  };

  const renderStars = (rating, setRating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating && setRating(star)}
            className={`transition ${!setRating ? '' : 'hover:scale-110'}`}
            disabled={!setRating}
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
      </div>
    );
  };

  if (reviewsLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // Filter connections that can be reviewed (accepted, haven't been reviewed yet)
  const reviewedConnectionIds = reviews.map(r => r.connection_id);
  const reviewableConnections = connections.filter(
    conn => conn.status === 'accepted' && !reviewedConnectionIds.includes(conn.id)
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
              <p className="mt-1 text-sm text-gray-500">
                Reviews you've given to mentors ({reviews.length})
              </p>
            </div>
            {reviewableConnections.length > 0 && !isWritingReview && (
              <button
                onClick={() => setIsWritingReview(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Write Review
              </button>
            )}
          </div>
        </div>

        {/* Write New Review Form */}
        {isWritingReview && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Write a Review</h2>
              <button
                onClick={() => setIsWritingReview(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitReview}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Connection
                  </label>
                  <select
                    value={reviewForm.connectionId}
                    onChange={(e) => setReviewForm({ ...reviewForm, connectionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a mentor to review...</option>
                    {reviewableConnections.map((conn) => {
                      const mentor = conn.mentor || conn.mentee || {};
                      return (
                        <option key={conn.id} value={conn.id}>
                          {mentor.name} - {mentor.title || 'Mentor'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  {renderStars(reviewForm.rating, (rating) => setReviewForm({ ...reviewForm, rating }))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment (Optional)
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with this mentor..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createMutation.isPending ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 && !isWritingReview ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-4">
              You haven't written any reviews for your mentors.
            </p>
            {reviewableConnections.length > 0 && (
              <button
                onClick={() => setIsWritingReview(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Write Your First Review
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isEditing = editingReview?.id === review.id;
              const reviewee = review.reviewee || {};

              return (
                <div key={review.id} className="bg-white rounded-lg shadow p-6">
                  {isEditing ? (
                    <form onSubmit={handleUpdateReview}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          {renderStars(editingReview.rating, (rating) =>
                            setEditingReview({ ...editingReview, rating })
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comment
                          </label>
                          <textarea
                            value={editingReview.comment}
                            onChange={(e) =>
                              setEditingReview({ ...editingReview, comment: e.target.value })
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setEditingReview(null)}
                            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updateMutation.isPending ? (
                              <span className="flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Saving...
                              </span>
                            ) : (
                              'Save Changes'
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {reviewee.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {reviewee.name || 'Unknown User'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {reviewee.title || reviewee.position || 'No title'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStartEdit(review)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        {renderStars(review.rating, null)}
                      </div>

                      {review.comment && (
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                      )}

                      <p className="text-xs text-gray-400">
                        Reviewed on {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
