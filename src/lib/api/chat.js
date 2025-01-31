import axios from '@/lib/axios';

export const getMessages = async (connectionId) => {
  try {
    const response = await axios.get(`/chat/${connectionId}/messages`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch messages.');
  }
};

export const markMessagesAsRead = async (connectionId) => {
  try {
    const response = await axios.post(`/chat/${connectionId}/read`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to mark messages as read.');
  }
};