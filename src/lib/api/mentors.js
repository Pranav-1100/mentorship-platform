import axios from '@/lib/axios';

export const getMentors = async (filters = {}) => {
  try {
    const response = await axios.get('/users/mentors', { params: filters });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch mentors.');
  }
};

export const getMentorDetails = async (mentorId) => {
  try {
    const response = await axios.get(`/users/mentors/${mentorId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch mentor details.');
  }
};