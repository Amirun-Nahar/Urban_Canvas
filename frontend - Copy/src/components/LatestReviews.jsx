import { useQuery } from '@tanstack/react-query';
import { StarIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

const LatestReviews = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['latest-reviews'],
    queryFn: async () => {
      const response = await api.get('/reviews/latest');
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold">Latest Reviews</h2>
          <p className="text-gray-600">What our clients say about their experiences</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews?.map((review) => (
            <div
              key={review._id}
              className="rounded-lg bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-center gap-4">
                <img
                  src={review.user.image || 'https://ui-avatars.com/api/?name=' + review.user.name}
                  alt={review.user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{review.user.name}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="mb-4 text-gray-600">{review.comment}</p>

              <div className="border-t pt-4">
                <Link
                  to={`/properties/${review.property._id}`}
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  {review.property.title}
                </Link>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestReviews; 