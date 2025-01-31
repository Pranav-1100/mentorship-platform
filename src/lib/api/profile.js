import axios from '@/lib/axios';

export const getProfile = async () => {
  try {
    const response = await axios.get('/profiles/me');
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch profile.');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put('/profiles/me', profileData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update profile.');
  }
};

export const updateSkills = async (skills) => {
  try {
    const response = await axios.put('/profiles/me/skills', { skills });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update skills.');
  }
};