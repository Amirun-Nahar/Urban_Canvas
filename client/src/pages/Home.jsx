import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdvertisedProperties, getProperties } from '../api/propertyAPI';
import { getLatestReviews } from '../api/reviewAPI';
import { getPlatformStatistics } from '../api/adminAPI';
import { FaMapMarkerAlt, FaDollarSign, FaCheckCircle, FaTimesCircle, FaUser, FaQuoteLeft, FaQuoteRight, FaBuilding, FaHandshake, FaChartLine, FaUsers, FaHeart, FaStar, FaHome, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Fetch advertised properties
  const { 
    data: advertisedProperties = [], 
    isLoading: advertisedLoading,
  } = useQuery({
    queryKey: ['advertisedProperties'],
    queryFn: getAdvertisedProperties
  });
  
  // Fetch all verified properties
  const { 
    data: allProperties = [], 
    isLoading: allPropertiesLoading,
  } = useQuery({
    queryKey: ['allProperties'],
    queryFn: () => getProperties({ limit: 20 }) // Get more properties to ensure we have enough
  });
  
  // Fetch latest reviews
  const {
    data: latestReviews = [],
    isLoading: reviewsLoading,
  } = useQuery({
    queryKey: ['latestReviews'],
    queryFn: getLatestReviews
  });
  
  // Fetch platform statistics
  const {
    data: statistics = {},
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['platformStatistics'],
    queryFn: getPlatformStatistics
  });
  
  // Combine properties to ensure at least 6 are shown
  const getDisplayProperties = () => {
    if (advertisedLoading || allPropertiesLoading) return [];
    
    // Start with advertised properties
    const displayProperties = [...advertisedProperties];
    
    // If we have less than 6 properties, add more verified properties
    if (displayProperties.length < 6) {
      const remainingSlots = 6 - displayProperties.length;
      
      // Filter out properties that are already advertised
      const advertisedIds = new Set(advertisedProperties.map(p => p._id));
      const additionalProperties = allProperties
        .filter(property => !advertisedIds.has(property._id))
        .slice(0, remainingSlots);
      
      displayProperties.push(...additionalProperties);
    }
    
    // Ensure we show at least 6 properties, but no more than 6
    return displayProperties.slice(0, 6);
  };
  
  const displayProperties = getDisplayProperties();
  const propertiesLoading = advertisedLoading || allPropertiesLoading;
  
  // Banner images
  const bannerImages = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d'
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section 
        className="relative h-[90vh] bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${bannerImages[currentImageIndex]})`,
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto text-center px-4 animate-slideIn">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow-lg">
              Find Your Dream Property
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto opacity-90">
              Discover the perfect home or investment opportunity with Urban Canvas
            </p>
            <Link 
              to="/properties" 
              className="btn btn-primary text-lg px-8 py-3 hover-lift"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-slideIn">
            Why Choose Urban Canvas?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBuilding className="w-8 h-8" />,
                title: "Premium Properties",
                description: "Access to exclusive listings and premium real estate opportunities."
              },
              {
                icon: <FaHandshake className="w-8 h-8" />,
                title: "Expert Guidance",
                description: "Professional support throughout your property journey."
              },
              {
                icon: <FaChartLine className="w-8 h-8" />,
                title: "Market Insights",
                description: "Up-to-date market analysis and investment recommendations."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="card p-6 text-center hover-lift animate-scaleIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-slideIn">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertiesLoading ? (
              <div className="col-span-3 text-center py-12">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              displayProperties.map((property, index) => (
                <Link 
                  to={`/properties/${property._id}`}
                  key={property._id}
                  className="card hover-lift animate-scaleIn block"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative h-48">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {property.verificationStatus === 'verified' && (
                        <div className="glass-effect px-3 py-1 rounded-full flex items-center">
                          <FaCheckCircle className="text-green-500 mr-1" />
                          <span className="text-white text-sm">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                    <div className="flex items-center mb-2 text-gray-600 dark:text-gray-400">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{property.location}</span>
                    </div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <FaDollarSign className="mr-1" />
                      <span className="text-xl font-bold">
                        {property.priceRange ? 
                          `${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}` :
                          property.price ? property.price.toLocaleString() : 'Price on request'
                        }
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 dark:text-white animate-slideIn">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              <>
                <div className="text-center animate-scaleIn" style={{ animationDelay: '0.1s' }}>
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaHome className="text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{statistics.totalProperties || 0}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Total Properties</p>
                </div>
                
                <div className="text-center animate-scaleIn" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-2xl text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{statistics.totalUsers || 0}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Total Users</p>
                </div>
                
                <div className="text-center animate-scaleIn" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-red-100 dark:bg-red-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaHeart className="text-2xl text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{statistics.totalWishlistItems || 0}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Wishlist Items</p>
                </div>
                
                <div className="text-center animate-scaleIn" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaDollarSign className="text-2xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">${Math.round((statistics.averagePropertyPrice || 0)).toLocaleString()}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Avg. Property Price</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-slideIn">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewsLoading ? (
              <div className="col-span-3 text-center py-12">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              latestReviews.map((review, index) => (
                <div 
                  key={review._id}
                  className="card p-6 hover-lift animate-scaleIn bg-white dark:bg-gray-800 shadow-lg rounded-lg flex flex-col h-[400px]"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Reviewer Info - Fixed Height */}
                  <div className="flex items-center mb-4 h-[64px]">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={review.reviewerImage} 
                        alt={review.reviewerName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://i.ibb.co/MBtjqXQ/no-avatar.gif';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold line-clamp-1">{review.reviewerName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(review.reviewTime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Review Content - Scrollable if too long */}
                  <div className="relative flex-grow overflow-hidden">
                    <FaQuoteLeft className="absolute top-0 left-0 text-blue-200 dark:text-blue-800 w-6 h-6 z-10" />
                    <div className="pl-6 pr-6 pt-2 h-full overflow-y-auto custom-scrollbar">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {review.reviewDescription}
                      </p>
                    </div>
                    <FaQuoteRight className="absolute bottom-0 right-0 text-blue-200 dark:text-blue-800 w-6 h-6 z-10" />
                  </div>

                  {/* Property Link - Fixed Height */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 h-[48px]">
                    <Link 
                      to={`/properties/${review.propertyId}`} 
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline line-clamp-1"
                    >
                      View Property: {review.propertyTitle}
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 