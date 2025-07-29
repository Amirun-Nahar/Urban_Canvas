import axios from 'axios';
import { showToast } from './toast';
import { getAuth } from 'firebase/auth';

// Create axios instance with base URL and proper configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        // Get fresh token
        const token = await user.getIdToken(true);
        localStorage.setItem('token', token);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          // Get fresh token
          const token = await user.getIdToken(true);
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        } else {
          // Clear auth state
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          showToast.error('Session expired. Please login again.');
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        showToast.error('Authentication failed. Please login again.');
      }
    }
    
    // Handle other errors
    const message = error.response?.data?.message || 'An error occurred';
    console.error('Response error:', error);
    
    if (error.response?.status === 403) {
      showToast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      showToast.error('Resource not found');
    } else if (error.response?.status === 422) {
      showToast.error(message);
    } else if (error.response?.status >= 500) {
      showToast.error('Server error. Please try again later.');
    } else if (!error.response) {
      showToast.error('Network error. Please check your connection.');
    } else {
      showToast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api; 