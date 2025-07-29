import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  HeartIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CheckBadgeIcon,
  StarIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../utils/toast';
import api from '../utils/axios';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fetch property details
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    }
  });

  // Check if property is in wishlist
  const { data: isWishlisted } = useQuery({
    queryKey: ['wishlist', id],
    queryFn: async () => {
      const response = await api.get(`/wishlists/check/${id}`);
      return response.data.isWishlisted;
    },
    enabled: !!user
  });

  // Toggle wishlist mutation
  const toggleWishlist = useMutation({
    mutationFn: async () => {
      if (isWishlisted) {
        await api.delete(`/wishlists/${id}`);
      } else {
        await api.post('/wishlists', { propertyId: id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist', id]);
      showToast.success(
        isWishlisted 
          ? 'Removed from wishlist' 
          : 'Added to wishlist'
      );
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  // Report property mutation
  const reportProperty = useMutation({
    mutationFn: async (data) => {
      await api.post(`/properties/${id}/report`, data);
    },
    onSuccess: () => {
      setShowReportModal(false);
      showToast.success('Property reported successfully');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to report property');
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Property Images */}
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={property.image}
              alt={property.title}
              className="h-[400px] w-full object-cover"
            />
          </div>

          {/* Property Info */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              {user && (
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWishlist.mutate()}
                    className="rounded-full bg-white p-2 text-primary shadow-md hover:bg-gray-50"
                  >
                    {isWishlisted ? (
                      <HeartIconSolid className="h-6 w-6" />
                    ) : (
                      <HeartIcon className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="rounded-full bg-white p-2 text-red-500 shadow-md hover:bg-gray-50"
                  >
                    <FlagIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>

            <div className="mb-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-5 w-5 text-gray-500" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                <span className="capitalize">{property.propertyType}</span>
              </div>
              {property.verificationStatus === 'verified' && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckBadgeIcon className="h-5 w-5" />
                  <span>Verified</span>
                </div>
              )}
            </div>

            <div className="mb-6 flex items-center gap-1 text-2xl font-bold text-primary">
              <CurrencyDollarIcon className="h-6 w-6" />
              <span>${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}</span>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {property.propertyType !== 'land' && (
                <>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-medium">Bedrooms</h3>
                    <p className="text-2xl font-bold text-primary">{property.bedrooms}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-medium">Bathrooms</h3>
                    <p className="text-2xl font-bold text-primary">{property.bathrooms}</p>
                  </div>
                </>
              )}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium">Area</h3>
                <p className="text-2xl font-bold text-primary">{property.area} sqft</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-bold">Description</h2>
              <p>{property.description}</p>
            </div>

            {property.features?.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">Features</h2>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckBadgeIcon className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Reviews</h2>
              {user && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark"
                >
                  Write a Review
                </button>
              )}
            </div>

            {property.reviews?.length > 0 ? (
              <div className="space-y-6">
                {property.reviews.map((review) => (
                  <div key={review._id} className="rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex items-center gap-4">
                      <img
                        src={review.user.image || `https://ui-avatars.com/api/?name=${review.user.name}`}
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
                      <span className="ml-auto text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center gap-4">
              <img
                src={property.agent.image || `https://ui-avatars.com/api/?name=${property.agent.name}`}
                alt={property.agent.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{property.agent.name}</h3>
                <p className="text-sm text-gray-500">{property.agent.email}</p>
              </div>
            </div>

            {user && user.role !== 'agent' && (
              <Link
                to={`/dashboard/offers/make/${id}`}
                className="block w-full rounded-lg bg-primary px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Make an Offer
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          propertyId={id}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(['property', id]);
            setShowReviewModal(false);
          }}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={(data) => reportProperty.mutate(data)}
          isLoading={reportProperty.isLoading}
        />
      )}
    </div>
  );
};

export default PropertyDetails; 