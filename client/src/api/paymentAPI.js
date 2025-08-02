import axiosInstance from './axios';

// Create a payment intent
export const createPaymentIntent = async ({ offerId }) => {
  const response = await axiosInstance.post('/payment/create-payment-intent', { offerId });
  return response.data;
}; 