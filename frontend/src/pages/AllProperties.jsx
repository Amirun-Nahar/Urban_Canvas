import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import api from '../utils/axios';

const AllProperties = () => {
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    sort: '-createdAt'
  });
  const [page, setPage] = useState(1);

  // Fetch properties with filters
  const { data, isLoading } = useQuery({
    queryKey: ['properties', filters, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        ...filters
      });
      const response = await api.get(`/properties?${params}`);
      return response.data;
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset page when filters change
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset page when searching
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <form onSubmit={handleSearch} className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search by location..."
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
              <option value="office">Office</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="priceRange.min">Price: Low to High</option>
              <option value="-priceRange.min">Price: High to Low</option>
            </select>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {data?.totalProperties} properties found
          </span>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.properties.map((property) => (
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
              {property.verificationStatus === 'verified' && (
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
              
              <div className="mb-2 flex items-center gap-1 text-gray-600">
                <MapPinIcon className="h-5 w-5" />
                <span>{property.location}</span>
              </div>

              <div className="mb-2 flex items-center gap-1 text-gray-600">
                <BuildingOfficeIcon className="h-5 w-5" />
                <span className="capitalize">{property.propertyType}</span>
              </div>

              <div className="mb-4 flex items-center gap-1 text-primary">
                <CurrencyDollarIcon className="h-5 w-5" />
                <span className="font-semibold">
                  ${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}
                </span>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <img
                  src={property.agent.image || `https://ui-avatars.com/api/?name=${property.agent.name}`}
                  alt={property.agent.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{property.agent.name}</p>
                  <p className="text-sm text-gray-500">{property.agent.email}</p>
                </div>
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

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {[...Array(data.totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  page === i + 1
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllProperties; 