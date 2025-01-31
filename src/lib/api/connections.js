import axios from '@/lib/axios';

export const getConnections = async () => {
  try {
    const response = await axios.get('/connections');
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch connections.');
  }
};

export const sendConnectionRequest = async (toUserId, type) => {
  try {
    const response = await axios.post('/connections', { toUserId, type });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to send connection request.');
  }
};

export const handleConnectionRequest = async (connectionId, status) => {
  try {
    const response = await axios.patch(`/connections/${connectionId}/status`, { status });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to handle connection request.');
  }
};

export const getApplications = async () => {
  try {
    const response = await axios.get('/connections/applications');
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch applications.');
  }
};