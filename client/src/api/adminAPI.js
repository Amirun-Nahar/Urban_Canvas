import axiosInstance from './axios';

// Get platform statistics (public)
export const getPlatformStatistics = async () => {
  const response = await axiosInstance.get('/admin/statistics');
  return response.data;
};

// Get real-time statistics for dashboard updates
export const getRealTimeStatistics = async () => {
  // Temporarily use the working statistics endpoint until realtime is deployed
  const response = await axiosInstance.get('/admin/statistics');
  return response.data;
};

// Debug endpoint to check offers data (remove in production)
export const debugOffers = async () => {
  const response = await axiosInstance.get('/admin/debug/offers');
  return response.data;
};

// Get all properties (admin only)
export const getAllProperties = async () => {
  const response = await axiosInstance.get('/admin/properties/all');
  return response.data;
};

// Verify a property (admin only)
export const verifyProperty = async (id) => {
  const response = await axiosInstance.patch(`/admin/properties/${id}/verify`);
  return response.data;
};

// Reject a property (admin only)
export const rejectProperty = async (id) => {
  const response = await axiosInstance.patch(`/admin/properties/${id}/reject`);
  return response.data;
};

// Toggle property advertisement status (admin only)
export const togglePropertyAdvertisement = async (id) => {
  const response = await axiosInstance.patch(`/admin/properties/${id}/advertise`);
  return response.data;
};

// Advertise a property (admin only)
export const advertiseProperty = async (id) => {
  const response = await axiosInstance.patch(`/admin/properties/${id}/advertise`);
  return response.data;
};

// Get all reviews (admin only)
export const getAllReviews = async () => {
  const response = await axiosInstance.get('/admin/reviews/all');
  return response.data;
};

// Delete a review (admin only)
export const deleteReviewByAdmin = async (id) => {
  const response = await axiosInstance.delete(`/admin/reviews/${id}`);
  return response.data;
};

// Delete a review (admin only) - alias for deleteReviewByAdmin
export const deleteReview = async (id) => {
  return deleteReviewByAdmin(id);
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/admin/users');
  return response.data;
};

// Make a user an admin (admin only)
export const makeUserAdmin = async (id) => {
  const response = await axiosInstance.patch(`/admin/users/${id}/make-admin`);
  return response.data;
};

// Make a user an agent (admin only)
export const makeUserAgent = async (id) => {
  const response = await axiosInstance.patch(`/admin/users/${id}/make-agent`);
  return response.data;
};

// Delete a user (admin only)
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
};

// Mark a user as fraud (admin only)
export const markUserAsFraud = async (id) => {
  const response = await axiosInstance.patch(`/admin/users/${id}/mark-fraud`);
  return response.data;
}; 