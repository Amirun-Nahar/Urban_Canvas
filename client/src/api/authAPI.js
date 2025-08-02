import axiosInstance from './axios';

// Register a new user
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

// Social login
export const socialLogin = async (userData) => {
  const response = await axiosInstance.post('/auth/social-login', userData);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
}; 