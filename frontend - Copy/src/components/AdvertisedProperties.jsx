import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import api from '../utils/axios';

const AdvertisedProperties = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['advertised-properties'],
    queryFn: async () => {
      const response = await api.get('/properties/advertised');
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
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold">Featured Properties</h2>
          <p className="text-gray-600">Discover our handpicked selection of premium properties</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {properties?.map((property) => (
            <div
              key={property._id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1"
            >
              <div className="relative h-48">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
                {property.isVerified && (
                  <div className="absolute right-2 top-2 rounded bg-green-500 px-2 py-1 text-xs text-white">
                    <div className="flex items-center gap-1">
                      <CheckBadgeIcon className="h-4 w-4" />
                      Verified
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{property.title}</h3>
                <p className="mb-2 text-gray-600">{property.location}</p>
                <div className="mb-4 text-lg font-bold text-primary">
                  ${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}
                </div>

                <Link
                  to={`/properties/${property._id}`}
                  className="block rounded-lg bg-primary px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvertisedProperties; 