import axios from '@/lib/axios';

export const getNotifications = async () => {
  try {
    const response = await axios.get('/notifications');
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch notifications.');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.post(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to mark notification as read.');
  }
};
