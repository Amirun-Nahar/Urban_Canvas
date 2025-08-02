import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPropertyById } from '../api/propertyAPI';
import { getPropertyReviews, addReview } from '../api/reviewAPI';
import { addToWishlist, getUserWishlist } from '../api/wishlistAPI';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { FaMapMarkerAlt, FaDollarSign, FaUser, FaEnvelope, FaCheckCircle, FaHeart, FaStar, FaRegStar, FaBookmark, FaRegBookmark, FaRegHeart } from 'react-icons/fa';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  const queryClient = useQueryClient();
  
  const [reviewText, setReviewText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Fetch property details
  const { 
    data: property,
    isLoading: propertyLoading,
    error: propertyError
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
  });
  
  // Fetch property reviews
  const { 
    data: reviews = [],
    isLoading: reviewsLoading,
    error: reviewsError
  } = useQuery({
    queryKey: ['propertyReviews', id],
    queryFn: () => getPropertyReviews(id),
    enabled: !!id
  });
  
  // Check if property is in user's wishlist
  const { data: userWishlist = [] } = useQuery({
    queryKey: ['userWishlist', currentUser?.email],
    queryFn: () => getUserWishlist(currentUser?.email),
    enabled: !!currentUser?.email,
    onSuccess: (data) => {
      const isInWishlist = data.some(item => item.propertyId === id);
      setIsInWishlist(isInWishlist);
    }
  });
  
  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      setIsInWishlist(true);
      showSuccess('Added to wishlist successfully!');
    },
    onError: (error) => {
      console.error('Add to wishlist error:', error);
      if (error.response?.status === 400) {
        setIsInWishlist(true);
        showInfo('This property is already in your wishlist');
      } else {
        showError('Failed to add to wishlist');
      }
    }
  });
  
  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      setReviewText('');
      setShowReviewModal(false);
      queryClient.invalidateQueries(['propertyReviews', id]);
      showSuccess('Review added successfully!');
    },
    onError: (error) => {
      console.error('Add review error:', error);
      showError('Failed to add review');
    }
  });
  
  const handleAddToWishlist = () => {
    if (!currentUser) {
      // Navigate to login page
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }
    
    addToWishlistMutation.mutate(id);
  };
  
  const handleAddReview = (e) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      showError('Review cannot be empty');
      return;
    }
    
    addReviewMutation.mutate({
      propertyId: id,
      reviewDescription: reviewText
    });
  };
  
  const openReviewModal = () => {
    if (!currentUser) {
      // Navigate to login page
      navigate('/login', { state: { from: `/properties/${id}` } });
      return;
    }
    
    setShowReviewModal(true);
  };
  
  if (propertyLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (propertyError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Property</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          There was an error loading the property details. Please try again.
        </p>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Property Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The property you are looking for doesn't exist or has been removed.
        </p>
        <button 
          onClick={() => navigate('/properties')} 
          className="btn btn-primary"
        >
          Browse Properties
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Property Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-80 md:h-96">
            <img 
              src={property.image} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={handleAddToWishlist}
                className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 flex items-center justify-center ${
                  isInWishlist 
                    ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                    : 'bg-white hover:bg-red-50 text-red-500 border-red-200 hover:border-red-300'
                }`}
                disabled={addToWishlistMutation.isLoading}
                title={isInWishlist ? "Already in Wishlist" : "Add to Wishlist"}
              >
                {addToWishlistMutation.isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : isInWishlist ? (
                  <FaHeart size={20} />
                ) : (
                  <FaRegHeart size={20} />
                )}
              </button>
            </div>
            {property.verificationStatus === 'verified' && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full flex items-center">
                <FaCheckCircle className="mr-1" />
                <span>Verified</span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <h1 className="text-3xl font-bold mb-2 md:mb-0 dark:text-white">{property.title}</h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="text-2xl font-bold text-blue-600">
                  ${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}
                </div>
                <button
                  onClick={handleAddToWishlist}
                  className={`btn flex items-center gap-2 w-full sm:w-auto ${
                    isInWishlist 
                      ? 'btn-success' 
                      : 'btn-primary btn-outline hover:btn-primary'
                  }`}
                  disabled={addToWishlistMutation.isLoading}
                >
                  {addToWishlistMutation.isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <FaBookmark className="text-lg" />
                  )}
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
            
            <div className="flex items-center mb-6 text-gray-600 dark:text-gray-300">
              <FaMapMarkerAlt className="mr-2" />
              <span>{property.location}</span>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 dark:text-white">Description</h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {property.description}
              </p>
            </div>
            
            {/* Agent Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Agent Information</h2>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img 
                    src={property.agentImage} 
                    alt={property.agentName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium dark:text-white">{property.agentName}</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaEnvelope className="mr-2" />
                    <span>{property.agentEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold dark:text-white">Reviews</h2>
            <button 
              onClick={openReviewModal}
              className="btn btn-primary"
            >
              Add Review
            </button>
          </div>
          
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : reviewsError ? (
            <div className="text-center text-red-500 py-8">
              Error loading reviews. Please try again.
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500 py-8 dark:text-gray-400">
              No reviews yet. Be the first to review this property!
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={review.reviewerImage} 
                        alt={review.reviewerName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium dark:text-white">{review.reviewerName}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(review.reviewTime).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {review.reviewDescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Add Your Review</h3>
              <form onSubmit={handleAddReview}>
                <div className="mb-4">
                  <label htmlFor="review" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Review
                  </label>
                  <textarea
                    id="review"
                    rows={5}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Write your review here..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={addReviewMutation.isLoading}
                  >
                    {addReviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails; 