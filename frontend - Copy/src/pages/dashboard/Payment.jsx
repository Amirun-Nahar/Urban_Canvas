import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import PaymentForm from '../../components/PaymentForm';
import { showToast } from '../../utils/toast';

// Initialize Stripe with error handling
const getStripe = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
    stripeAccount: import.meta.env.VITE_STRIPE_ACCOUNT_ID
  }).catch(err => {
    console.error('Stripe load error:', err);
    showToast.error('Failed to load payment system. Please try again later.');
    return null;
  });
  return stripePromise;
};

const Payment = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [stripeError, setStripeError] = useState(null);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const loadStripeInstance = async () => {
      try {
        const stripeInstance = await getStripe();
        if (!stripeInstance) {
          setStripeError('Failed to load payment system');
          return;
        }
        setStripe(stripeInstance);
      } catch (error) {
        console.error('Stripe initialization error:', error);
        setStripeError('Failed to initialize payment system');
      }
    };
    loadStripeInstance();
  }, []);

  const { data: offer, isLoading: offerLoading } = useQuery({
    queryKey: ['offer', offerId],
    queryFn: async () => {
      const response = await axios.get(`/api/offers/${offerId}`);
      return response.data;
    },
  });

  useEffect(() => {
    const initializePayment = async () => {
      if (!stripe) return;

      try {
        const response = await axios.post('/api/payment/create-payment-intent', {
          offerId,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to initialize payment';
        setStripeError(errorMessage);
        showToast.error(errorMessage);
      }
    };

    if (offerId && stripe) {
      initializePayment();
    }
  }, [offerId, stripe]);

  if (stripeError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <h2 className="text-xl font-semibold text-red-700">Payment Error</h2>
          <p className="mt-2 text-red-600">{stripeError}</p>
          <button
            onClick={() => navigate('/dashboard/properties/bought')}
            className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (offerLoading || !clientSecret || !stripe) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg">Loading payment details...</div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#10B981',
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Complete Payment</h1>
        <p className="mt-2 text-gray-600">
          Property: {offer?.property?.title}
        </p>
        <p className="text-lg font-semibold text-primary">
          Amount: ${offer?.offerAmount?.toLocaleString()}
        </p>
      </div>

      {clientSecret && stripe && (
        <Elements stripe={stripe} options={options}>
          <PaymentForm
            offerId={offerId}
            onSuccess={() => {
              showToast.success('Payment completed successfully');
              navigate('/dashboard/properties/bought');
            }}
          />
        </Elements>
      )}
    </div>
  );
};

export default Payment; 