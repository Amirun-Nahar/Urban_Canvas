import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserWishlist, removeFromWishlist } from '../../../api/wishlistAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaDollarSign, FaTrash, FaMoneyBillWave } from 'react-icons/fa';
import ConfirmDialog from '../../../components/ConfirmDialog';

const Wishlist = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, itemId: null });
  
  // Fetch user's wishlist
  const { 
    data: wishlistItems = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['wishlist', currentUser?.email],
    queryFn: () => getUserWishlist(currentUser?.email),
    enabled: !!currentUser?.email
  });
  
  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist', currentUser?.email]);
      showSuccess('Removed from wishlist');
    },
    onError: (error) => {
      console.error('Remove from wishlist error:', error);
      showError('Failed to remove from wishlist');
    }
  });
  
  const handleRemoveFromWishlist = (id) => {
    setConfirmDialog({ isOpen: true, itemId: id });
  };

  const confirmRemove = () => {
    if (confirmDialog.itemId) {
      removeFromWishlistMutation.mutate(confirmDialog.itemId);
    }
  };
  
  const handleMakeOffer = (propertyId) => {
    // Navigate to make offer page
    window.location.href = `/dashboard/make-offer/${propertyId}`;
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
        <p>Error loading wishlist. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Your wishlist is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't added any properties to your wishlist yet.
          </p>
          <Link to="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div 
              key={item._id} 
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative h-48">
                <img 
                  src={item.property.image} 
                  alt={item.property.title} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">{item.property.title}</h3>
                
                <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{item.property.location}</span>
                </div>
                
                <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                  <FaDollarSign className="mr-2" />
                  <span>${item.property.priceRange.min.toLocaleString()} - ${item.property.priceRange.max.toLocaleString()}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Link 
                    to={`/properties/${item.propertyId}`} 
                    className="btn btn-outline btn-primary flex-1"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleMakeOffer(item.propertyId)}
                    className="btn btn-primary flex items-center"
                  >
                    <FaMoneyBillWave className="mr-2" />
                    Make Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmRemove}
        title="Confirm Removal"
        message="Are you sure you want to remove this property from your wishlist?"
      />
    </div>
  );
};

export default Wishlist; 