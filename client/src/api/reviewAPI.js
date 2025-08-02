import axiosInstance from './axios';

// Get latest reviews
export const getLatestReviews = async () => {
  const response = await axiosInstance.get('/reviews/latest');
  return response.data;
};

// Get reviews for a specific property
export const getPropertyReviews = async (propertyId) => {
  const response = await axiosInstance.get(`/reviews/${propertyId}`);
  return response.data;
};

// Add a review
export const addReview = async (reviewData) => {
  const response = await axiosInstance.post('/reviews', reviewData);
  return response.data;
};

// Get reviews by user email
export const getUserReviews = async (email) => {
  const response = await axiosInstance.get(`/reviews/user/${email}`);
  return response.data;
};

// Delete a review
export const deleteReview = async (id) => {
  const response = await axiosInstance.delete(`/reviews/${id}`);
  return response.data;
}; 