import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserReviews, deleteReview } from '../../../api/reviewAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { FaTrash, FaHome, FaCalendarAlt } from 'react-icons/fa';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useState } from 'react';

const MyReviews = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, reviewId: null });
  
  // Fetch user's reviews
  const { 
    data: reviews = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['userReviews', currentUser?.email],
    queryFn: () => getUserReviews(currentUser?.email),
    enabled: !!currentUser?.email
  });
  
  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['userReviews', currentUser?.email]);
      showSuccess('Review deleted successfully');
    },
    onError: (error) => {
      console.error('Delete review error:', error);
      showError('Failed to delete review');
    }
  });
  
  const handleDeleteReview = (id) => {
    setConfirmDialog({ isOpen: true, reviewId: id });
  };

  const confirmDelete = () => {
    if (confirmDialog.reviewId) {
      deleteReviewMutation.mutate(confirmDialog.reviewId);
    }
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
        <p>Error loading reviews. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">My Reviews</h1>
      
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">No reviews yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't posted any reviews yet.
          </p>
          <a href="/properties" className="btn btn-primary">
            Browse Properties
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div 
              key={review._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={review.reviewerImage} 
                        alt={review.reviewerName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{review.reviewerName}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <FaCalendarAlt className="mr-1" />
                      <span>{new Date(review.reviewTime).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-4">
                      <FaHome className="mr-1" />
                      <span>{review.propertyTitle}</span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300">
                      {review.reviewDescription}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  disabled={deleteReviewMutation.isLoading}
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        confirmText="Yes, delete it"
        cancelText="Cancel"
      />
    </div>
  );
};

export default MyReviews; 