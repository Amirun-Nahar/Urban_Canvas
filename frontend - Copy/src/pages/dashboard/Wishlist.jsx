import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from '@heroicons/react/24/outline';
import { showToast } from '../../utils/toast';
import api from '../../utils/axios';

const Wishlist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');

  // Fetch wishlist
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await api.get('/wishlists');
      return response.data;
    }
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: async (propertyId) => {
      const response = await api.delete(`/wishlists/${propertyId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
      showToast.success('Removed from wishlist');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  });

  // Make offer mutation
  const makeOffer = useMutation({
    mutationFn: async ({ propertyId, amount }) => {
      const response = await api.post('/offers', {
        propertyId,
        amount: parseFloat(amount)
      });
      return response.data;
    },
    onSuccess: () => {
      setShowOfferModal(false);
      setSelectedProperty(null);
      setOfferAmount('');
      showToast.success('Offer submitted successfully');
      navigate('/dashboard/offers');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to submit offer');
    }
  });

  const handleMakeOffer = (property) => {
    setSelectedProperty(property);
    setShowOfferModal(true);
  };

  const handleSubmitOffer = (e) => {
    e.preventDefault();
    if (!offerAmount) {
      showToast.error('Please enter an offer amount');
      return;
    }

    const amount = parseFloat(offerAmount);
    if (amount < selectedProperty.priceRange.min || amount > selectedProperty.priceRange.max) {
      showToast.error(`Offer must be between $${selectedProperty.priceRange.min.toLocaleString()} and $${selectedProperty.priceRange.max.toLocaleString()}`);
      return;
    }

    makeOffer.mutate({
      propertyId: selectedProperty._id,
      amount
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-lg">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-500">Your wishlist is empty</p>
          <Link
            to="/properties"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="relative h-48">
                <img
                  src={item.property.image}
                  alt={item.property.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 right-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.property.verificationStatus === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : item.property.verificationStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.property.verificationStatus}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {item.property.title}
                </h3>
                <p className="mb-4 text-gray-600">{item.property.location}</p>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.property.agent.image}
                      alt={item.property.agent.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{item.property.agent.name}</span>
                  </div>
                </div>
                <div className="mb-4 text-sm text-gray-700">
                  <span className="font-semibold">Price Range: </span>
                  ${item.property.priceRange.min.toLocaleString()} - ${item.property.priceRange.max.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleMakeOffer(item.property)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Make an Offer
                  </button>
                  <button
                    onClick={() => removeFromWishlist.mutate(item.property._id)}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Make an Offer</h3>
            <form onSubmit={handleSubmitOffer}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Property
                </label>
                <input
                  type="text"
                  value={selectedProperty.title}
                  disabled
                  className="mt-1 block w-full cursor-not-allowed rounded-md border-0 bg-gray-50 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <input
                  type="text"
                  value={`$${selectedProperty.priceRange.min.toLocaleString()} - $${selectedProperty.priceRange.max.toLocaleString()}`}
                  disabled
                  className="mt-1 block w-full cursor-not-allowed rounded-md border-0 bg-gray-50 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="offerAmount" className="block text-sm font-medium text-gray-700">
                  Your Offer Amount
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="offerAmount"
                    id="offerAmount"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOfferModal(false);
                    setSelectedProperty(null);
                    setOfferAmount('');
                  }}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={makeOffer.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  {makeOffer.isPending ? 'Submitting...' : 'Submit Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist; 