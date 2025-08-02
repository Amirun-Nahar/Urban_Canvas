import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllReviews, deleteReview } from '../../../api/adminAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { FaTrash, FaHome, FaCalendarAlt, FaSearch, FaUser } from 'react-icons/fa';
import ConfirmDialog from '../../../components/ConfirmDialog';

const ManageReviews = () => {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, reviewId: null });
  
  // Fetch all reviews
  const { 
    data: reviews = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: getAllReviews
  });
  
  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReviews']);
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
  
  // Filter reviews based on search term
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearch;
  });
  
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
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Manage Reviews</h1>
      
      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by property, reviewer, or content"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">No reviews found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            No reviews match your search criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div 
              key={review._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={review.reviewerImage || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'} 
                        alt={review.reviewerName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-semibold dark:text-white">{review.reviewerName}</h3>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({review.reviewerEmail})</span>
                    </div>
                    
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
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ManageReviews; 