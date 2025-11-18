import axios from '@/lib/axios';

/**
 * Create a review for a mentor/mentee
 * @param {number} connectionId - The connection ID
 * @param {number} rating - Rating from 1 to 5
 * @param {string} comment - Review comment (optional)
 * @returns {Promise} Created review data
 */
export const createReview = async (connectionId, rating, comment = '') => {
  try {
    const response = await axios.post('/reviews', {
      connection_id: connectionId,
      rating,
      comment
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to create review.');
  }
};

/**
 * Get reviews for a specific user
 * @param {number} userId - The user ID
 * @returns {Promise} Array of reviews
 */
export const getUserReviews = async (userId) => {
  try {
    const response = await axios.get(`/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to fetch user reviews.');
  }
};

/**
 * Get reviews created by the current user
 * @returns {Promise} Array of reviews
 */
export const getMyReviews = async () => {
  try {
    const response = await axios.get('/reviews/my-reviews');
    return response.data;
  } catch (error) {
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to fetch your reviews.');
  }
};

/**
 * Get rating summary for a user
 * @param {number} userId - The user ID
 * @returns {Promise} Rating summary with average, count, and distribution
 */
export const getRatingSummary = async (userId) => {
  try {
    const response = await axios.get(`/reviews/summary/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to fetch rating summary.');
  }
};

/**
 * Update a review
 * @param {number} reviewId - The review ID
 * @param {number} rating - New rating from 1 to 5
 * @param {string} comment - New review comment (optional)
 * @returns {Promise} Updated review data
 */
export const updateReview = async (reviewId, rating, comment = '') => {
  try {
    const response = await axios.put(`/reviews/${reviewId}`, {
      rating,
      comment
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to update review.');
  }
};

/**
 * Delete a review
 * @param {number} reviewId - The review ID
 * @returns {Promise}
 */
export const deleteReview = async (reviewId) => {
  try {
    await axios.delete(`/reviews/${reviewId}`);
  } catch (error) {
    if (error.response?.data?.message || error.response?.data?.error) {
      throw new Error(error.response.data.message || error.response.data.error);
    }
    throw new Error('Failed to delete review.');
  }
};

/**
 * Submit a review (alias for createReview)
 * @param {Object} reviewData - Review data
 * @param {number} reviewData.connectionId - The connection ID
 * @param {number} reviewData.rating - Rating from 1 to 5
 * @param {string} reviewData.comment - Review comment (optional)
 * @returns {Promise} Created review data
 */
export const submitReview = async ({ connectionId, rating, comment }) => {
  return createReview(connectionId, rating, comment);
};
