import { useContext, useCallback } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { registerUser, loginUser } from '@/lib/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const register = useCallback(async (userData) => {
    try {
      const data = await registerUser(userData);
      context.setUser(data.user);
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }, [context]);

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginUser(email, password);
      context.setUser(data.user);
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }, [context]);

  return {
    ...context,
    register,
    login,
  };
};
