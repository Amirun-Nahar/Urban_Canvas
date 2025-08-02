import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAgentOffers, acceptOffer, rejectOffer } from '../../../api/offerAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaUser, FaCheck, FaTimes } from 'react-icons/fa';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useState } from 'react';

const RequestedProperties = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null, offerId: null });
  
  // Fetch agent's offers
  const { 
    data: offers = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['agentOffers', currentUser?.email],
    queryFn: () => getAgentOffers(currentUser?.email),
    enabled: !!currentUser?.email
  });
  
  // Filter pending offers
  const pendingOffers = offers.filter(offer => offer.status === 'pending');
  
  // Accept offer mutation
  const acceptOfferMutation = useMutation({
    mutationFn: acceptOffer,
    onSuccess: () => {
      queryClient.invalidateQueries(['agentOffers', currentUser?.email]);
      showSuccess('Offer accepted successfully');
    },
    onError: (error) => {
      console.error('Accept offer error:', error);
      showError('Failed to accept offer');
    }
  });
  
  // Reject offer mutation
  const rejectOfferMutation = useMutation({
    mutationFn: rejectOffer,
    onSuccess: () => {
      queryClient.invalidateQueries(['agentOffers', currentUser?.email]);
      showSuccess('Offer rejected successfully');
    },
    onError: (error) => {
      console.error('Reject offer error:', error);
      showError('Failed to reject offer');
    }
  });
  
  const handleAcceptOffer = (id) => {
    setConfirmDialog({ isOpen: true, action: 'accept', offerId: id });
  };
  
  const handleRejectOffer = (id) => {
    setConfirmDialog({ isOpen: true, action: 'reject', offerId: id });
  };

  const confirmAction = () => {
    if (confirmDialog.offerId) {
      if (confirmDialog.action === 'accept') {
        acceptOfferMutation.mutate(confirmDialog.offerId);
      } else if (confirmDialog.action === 'reject') {
        rejectOfferMutation.mutate(confirmDialog.offerId);
      }
    }
  };

  const getDialogConfig = () => {
    if (confirmDialog.action === 'accept') {
      return {
        title: 'Accept Offer?',
        message: 'Are you sure you want to accept this offer? Other offers for this property will be automatically rejected.',
        type: 'question',
        confirmText: 'Yes, accept it',
        cancelText: 'Cancel'
      };
    } else if (confirmDialog.action === 'reject') {
      return {
        title: 'Reject Offer?',
        message: 'Are you sure you want to reject this offer?',
        type: 'warning',
        confirmText: 'Yes, reject it',
        cancelText: 'Cancel'
      };
    }
    return {};
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
        <p>Error loading offers. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Requested Properties</h1>
      
      {pendingOffers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">No pending offers</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You don't have any pending offers at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingOffers.map((offer) => (
            <div 
              key={offer._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Property Image */}
                <div className="h-full">
                  <img 
                    src={offer.propertyImage} 
                    alt={offer.propertyTitle} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Offer Details */}
                <div className="p-6 md:col-span-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 dark:text-white">{offer.propertyTitle}</h2>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{offer.propertyLocation}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-0">
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
                        <div className="text-blue-800 dark:text-blue-200 font-semibold mb-1">Offered Amount</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                          ${offer.offeredAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Buyer Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Buyer Information</h3>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={offer.buyerImage || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'} 
                            alt={offer.buyerName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">{offer.buyerName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{offer.buyerEmail}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Offer Date */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Offer Details</h3>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="mr-2" />
                        <span>Buying Date: {new Date(offer.buyingDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaUser className="mr-2" />
                        <span>Offer Date: {new Date(offer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleRejectOffer(offer._id)}
                      className="btn btn-outline btn-error"
                      disabled={rejectOfferMutation.isLoading}
                    >
                      <FaTimes className="mr-1" /> Reject
                    </button>
                    <button
                      onClick={() => handleAcceptOffer(offer._id)}
                      className="btn btn-primary"
                      disabled={acceptOfferMutation.isLoading}
                    >
                      <FaCheck className="mr-1" /> Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmAction}
        {...getDialogConfig()}
      />
    </div>
  );
};

export default RequestedProperties; 