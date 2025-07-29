import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { showToast } from '../utils/toast';

const PaymentForm = ({ offerId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!stripe) {
      setErrorMessage('Stripe failed to load. Please disable ad blockers or try a different browser.');
    } else {
      setErrorMessage('');
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Payment system is not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    const loadingToastId = showToast.loading('Processing payment...');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/properties/bought`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        showToast.error(error.message);
      } else {
        showToast.success('Payment successful!');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      const message = 'An error occurred while processing payment. Please try again.';
      setErrorMessage(message);
      showToast.error(message);
    } finally {
      showToast.dismiss(loadingToastId);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 