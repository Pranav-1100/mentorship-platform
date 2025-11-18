import axios from '@/lib/axios';

/**
 * Get all sessions for the current user
 * @returns {Promise} Array of sessions
 */
export const getSessions = async () => {
  try {
    const response = await axios.get('/sessions');
    return response.data.sessions || response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch sessions.');
  }
};

/**
 * Get a specific session by ID
 * @param {number} sessionId - The ID of the session
 * @returns {Promise} Session data
 */
export const getSessionById = async (sessionId) => {
  try {
    const response = await axios.get(`/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch session.');
  }
};

/**
 * Create a new session
 * @param {Object} sessionData - Session details
 * @param {number} sessionData.connection_id - Connection ID
 * @param {string} sessionData.scheduled_at - ISO date string
 * @param {number} sessionData.duration - Duration in minutes
 * @param {string} sessionData.agenda - Session agenda/description
 * @returns {Promise} Created session data
 */
export const createSession = async (sessionData) => {
  try {
    const response = await axios.post('/sessions', sessionData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create session.');
  }
};

/**
 * Schedule a session
 * @param {number} connectionId - The ID of the connection
 * @param {string} scheduledAt - ISO date string
 * @param {number} duration - Duration in minutes
 * @param {string} agenda - Session agenda
 * @returns {Promise} Created session data
 */
export const scheduleSession = async (connectionId, scheduledAt, duration, agenda) => {
  return createSession({
    connection_id: connectionId,
    scheduled_at: scheduledAt,
    duration,
    agenda
  });
};

/**
 * Update session status
 * @param {number} sessionId - The ID of the session
 * @param {Object} updateData - Update data
 * @param {string} updateData.status - 'scheduled', 'completed', 'cancelled'
 * @param {string} updateData.scheduled_at - ISO date string (for rescheduling)
 * @param {string} updateData.notes - Session notes
 * @returns {Promise} Updated session data
 */
export const updateSession = async (sessionId, updateData) => {
  try {
    const response = await axios.patch(`/sessions/${sessionId}`, updateData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update session.');
  }
};

/**
 * Reschedule a session
 * @param {number} sessionId - The ID of the session
 * @param {string} newDate - New ISO date string
 * @returns {Promise} Updated session data
 */
export const rescheduleSession = async (sessionId, newDate) => {
  return updateSession(sessionId, {
    scheduled_at: newDate
  });
};

/**
 * Cancel a session
 * @param {number} sessionId - The ID of the session
 * @returns {Promise} Updated session data
 */
export const cancelSession = async (sessionId) => {
  return updateSession(sessionId, {
    status: 'cancelled'
  });
};

/**
 * Complete a session with notes
 * @param {number} sessionId - The ID of the session
 * @param {string} notes - Session completion notes
 * @returns {Promise} Updated session data
 */
export const completeSession = async (sessionId, notes) => {
  return updateSession(sessionId, {
    status: 'completed',
    notes
  });
};

/**
 * Get upcoming sessions
 * @returns {Promise} Array of upcoming sessions
 */
export const getUpcomingSessions = async () => {
  try {
    const sessions = await getSessions();
    const now = new Date();
    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduled_at);
      return sessionDate > now && session.status === 'scheduled';
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get past sessions
 * @returns {Promise} Array of past sessions
 */
export const getPastSessions = async () => {
  try {
    const sessions = await getSessions();
    const now = new Date();
    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduled_at);
      return sessionDate < now || session.status === 'completed';
    });
  } catch (error) {
    throw error;
  }
};
