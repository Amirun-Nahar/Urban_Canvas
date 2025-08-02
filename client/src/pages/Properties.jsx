import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '../api/propertyAPI';
import { FaMapMarkerAlt, FaDollarSign, FaCheckCircle, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const Properties = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [sortOption, setSortOption] = useState('');
  
  // Fetch properties with search and sort parameters
  const { 
    data: properties = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['properties', searchLocation, sortOption],
    queryFn: () => getProperties({ location: searchLocation, sort: sortOption }),
  });
  
  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">All Properties</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search by Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Enter city, state, or zip code"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={handleSortChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
          </div>
        </div>
        
        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex justify-center my-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 my-12">
            Error loading properties. Please try again.
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-500 my-12">
            No properties found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div 
                key={property._id} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-56">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    <div className="flex items-center">
                      <FaCheckCircle className="mr-1" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">{property.title}</h3>
                  
                  <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className="flex items-center mb-3 text-gray-600 dark:text-gray-300">
                    <FaDollarSign className="mr-2" />
                    <span>${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img 
                        src={property.agentImage} 
                        alt={property.agentName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{property.agentName}</span>
                  </div>
                  
                  <Link 
                    to={`/properties/${property._id}`} 
                    className="btn btn-primary w-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties; 