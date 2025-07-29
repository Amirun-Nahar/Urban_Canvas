import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from '@heroicons/react/24/outline';
import { showToast } from '../../utils/toast';
import api from '../../utils/axios';

const ManageReviews = () => {
  const queryClient = useQueryClient();

  // Fetch all reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['allReviews'],
    queryFn: async () => {
      const response = await api.get('/reviews/all');
      return response.data;
    }
  });

  // Delete review mutation
  const deleteReview = useMutation({
    mutationFn: async (reviewId) => {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allReviews']);
      showToast.success('Review deleted successfully');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to delete review');
    }
  });

  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview.mutate(reviewId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-lg">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Manage Reviews</h1>

      {reviews.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-500">No reviews found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {review.property.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600">{review.description}</p>
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={review.reviewer.image}
                    alt={review.reviewer.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.reviewer.name}
                    </p>
                    <p className="text-xs text-gray-500">{review.reviewer.email}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center gap-2">
                  <img
                    src={review.property.agent.image}
                    alt={review.property.agent.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.property.agent.name}
                    </p>
                    <p className="text-xs text-gray-500">Property Agent</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReviews; 