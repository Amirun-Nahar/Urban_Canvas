import axiosInstance from './axios';

// Make an offer
export const makeOffer = async (offerData) => {
  const response = await axiosInstance.post('/offers', offerData);
  return response.data;
};

// Get agent offers
export const getAgentOffers = async (email) => {
  const response = await axiosInstance.get(`/offers/agent/${email}`);
  return response.data;
};

// Get buyer offers
export const getBuyerOffers = async (email) => {
  const response = await axiosInstance.get(`/offers/buyer/${email}`);
  return response.data;
};

// Accept an offer
export const acceptOffer = async (id) => {
  const response = await axiosInstance.patch(`/offers/accept/${id}`);
  return response.data;
};

// Reject an offer
export const rejectOffer = async (id) => {
  const response = await axiosInstance.patch(`/offers/reject/${id}`);
  return response.data;
};

// Complete payment
export const completePayment = async ({ id, paymentIntentId }) => {
  const response = await axiosInstance.patch(`/offers/payment-success/${id}`, { 
    transactionId: paymentIntentId 
  });
  return response.data;
};

// Get agent sold properties
export const getAgentSoldProperties = async (email) => {
  const response = await axiosInstance.get(`/offers/agent/${email}/sold`);
  return response.data;
}; 