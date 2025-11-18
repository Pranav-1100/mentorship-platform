import axios from '@/lib/axios';

/**
 * Create a new mentorship application
 * @param {number} mentorId - The ID of the mentor
 * @param {string} message - Application message
 * @returns {Promise} Application data
 */
export const createApplication = async (mentorId, message) => {
  try {
    const response = await axios.post('/applications', {
      mentor_id: mentorId,
      message
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create application.');
  }
};

/**
 * Update application status (accept/reject)
 * @param {number} applicationId - The ID of the application
 * @param {string} status - 'accepted' or 'rejected'
 * @returns {Promise} Updated application data
 */
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const response = await axios.patch(`/applications/${applicationId}`, {
      status
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update application status.');
  }
};

/**
 * Cancel/withdraw an application
 * @param {number} applicationId - The ID of the application
 * @returns {Promise}
 */
export const cancelApplication = async (applicationId) => {
  try {
    await axios.delete(`/applications/${applicationId}`);
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to cancel application.');
  }
};

/**
 * Accept an application
 * @param {number} applicationId - The ID of the application
 * @returns {Promise} Updated application data
 */
export const acceptApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'accepted');
};

/**
 * Reject an application
 * @param {number} applicationId - The ID of the application
 * @returns {Promise} Updated application data
 */
export const rejectApplication = async (applicationId) => {
  return updateApplicationStatus(applicationId, 'rejected');
};
