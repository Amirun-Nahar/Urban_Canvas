import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../utils/axios';
import { showToast } from '../utils/toast';

const ReviewModal = ({ propertyId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const addReview = useMutation({
    mutationFn: async (data) => {
      await api.post(`/reviews/${propertyId}`, data);
    },
    onSuccess: () => {
      showToast.success('Review added successfully');
      onSuccess();
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to add review');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast.error('Please select a rating');
      return;
    }
    addReview.mutate({ rating, comment });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">Write a Review</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Rating Stars */}
          <div className="mb-4">
            <label className="mb-2 block font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-yellow-400 focus:outline-none"
                >
                  {star <= (hoveredRating || rating) ? (
                    <StarIconSolid className="h-8 w-8" />
                  ) : (
                    <StarIcon className="h-8 w-8" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label htmlFor="comment" className="mb-2 block font-medium">
              Comment
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Share your experience..."
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addReview.isLoading}
              className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addReview.isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal; 