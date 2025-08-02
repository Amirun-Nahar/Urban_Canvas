import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getBuyerOffers } from '../../../api/offerAPI';
import { createPaymentIntent } from '../../../api/paymentAPI';
import { completePayment } from '../../../api/offerAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaLock, FaCheckCircle } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Initialize Stripe with error handling
const getStripe = async () => {
  if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
    console.warn('Stripe requires HTTPS in production. Current environment:', process.env.NODE_ENV);
  }
  
  try {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    return stripe;
  } catch (error) {
    console.error('Stripe initialization error:', error);
    return null;
  }
};

const stripePromise = getStripe();

const CheckoutForm = ({ clientSecret, offerId, offer, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showError } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    setIsProcessing(true);
    setCardError('');
    
    // Get card element
    const cardElement = elements.getElement(CardElement);
    
    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: offer.buyerName,
          email: offer.buyerEmail
        }
      }
    });
    
    if (error) {
      setCardError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Payment successful
      onPaymentSuccess(paymentIntent.id);
    } else {
      showError('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {cardError && <p className="mt-1 text-sm text-red-600">{cardError}</p>}
      </div>
      
      {/* Payment Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Summary</h3>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Property Price:</span>
          <span className="font-medium dark:text-white">${offer.offeredAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">Processing Fee:</span>
          <span className="font-medium dark:text-white">$0.00</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-gray-700 dark:text-gray-200 font-medium">Total:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">${offer.offeredAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard/property-bought')}
          className="btn btn-outline"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isProcessing || !stripe}
        >
          {isProcessing ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Processing...
            </>
          ) : (
            `Pay $${offer.offeredAmount.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
};

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  // Fetch offer details
  const { 
    data: offers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['buyerOffers', currentUser?.email],
    queryFn: () => getBuyerOffers(currentUser?.email),
    enabled: !!currentUser?.email
  });
  
  const offer = offers.find(o => o._id === id);
  
  // Create payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      console.error('Payment intent error:', error);
      showError('Failed to create payment intent');
    }
  });
  
  // Complete payment mutation
  const completePaymentMutation = useMutation({
    mutationFn: completePayment,
    onSuccess: () => {
      setPaymentSuccess(true);
      showSuccess('Payment successful! Property purchased.');
    },
    onError: (error) => {
      console.error('Complete payment error:', error);
      showError('Payment processed but failed to update status');
    }
  });
  
  // Create payment intent when offer is loaded
  useEffect(() => {
    if (offer && offer.status === 'accepted' && !clientSecret) {
      createPaymentIntentMutation.mutate({ offerId: id });
    }
  }, [offer, id]);
  
  const handlePaymentSuccess = (paymentIntentId) => {
    setTransactionId(paymentIntentId);
    completePaymentMutation.mutate({ id, paymentIntentId });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>Error loading offer details. Please try again later.</p>
      </div>
    );
  }
  
  if (!offer) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>Offer not found or you don't have permission to access it.</p>
      </div>
    );
  }
  
  if (offer.status !== 'accepted') {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>This offer is not available for payment. Only accepted offers can be paid for.</p>
        <button 
          onClick={() => navigate('/dashboard/property-bought')} 
          className="mt-4 btn btn-primary"
        >
          Back to Offers
        </button>
      </div>
    );
  }
  
  if (paymentSuccess) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Payment Successful!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Congratulations! You have successfully purchased the property.
        </p>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction Details</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-medium">Property:</span> {offer.propertyTitle}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-medium">Amount:</span> ${offer.offeredAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-medium">Transaction ID:</span> <span className="font-mono">{transactionId}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/property-bought')} 
          className="btn btn-primary"
        >
          View My Properties
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Complete Payment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48">
              <img 
                src={offer.propertyImage} 
                alt={offer.propertyTitle} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{offer.propertyTitle}</h2>
              
              <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                <FaMapMarkerAlt className="mr-2" />
                <span>{offer.propertyLocation}</span>
              </div>
              
              <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                <FaDollarSign className="mr-2" />
                <span>${offer.offeredAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                <FaCalendarAlt className="mr-2" />
                <span>Buying Date: {new Date(offer.buyingDate).toLocaleDateString()}</span>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <FaLock className="inline-block mr-1" />
                  Secure payment processed by Urban Canvas
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">Payment Information</h2>
            
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  clientSecret={clientSecret}
                  offerId={id}
                  offer={offer}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </Elements>
            ) : createPaymentIntentMutation.isLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-500">Failed to initialize payment. Please try again.</p>
                <button 
                  onClick={() => createPaymentIntentMutation.mutate({ offerId: id })}
                  className="btn btn-primary mt-4"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 