import axiosInstance from './axios';

// Add a property to wishlist
export const addToWishlist = async (propertyId) => {
  const response = await axiosInstance.post('/wishlist', { propertyId });
  return response.data;
};

// Get user's wishlist with property details
export const getUserWishlist = async (email) => {
  const response = await axiosInstance.get(`/wishlist/${email}`);
  return response.data;
};

// Remove from wishlist
export const removeFromWishlist = async (id) => {
  const response = await axiosInstance.delete(`/wishlist/${id}`);
  return response.data;
}; 