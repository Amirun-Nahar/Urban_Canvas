import { useQuery } from '@tanstack/react-query';
import { getBuyerOffers } from '../../../api/offerAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaSpinner, FaReceipt } from 'react-icons/fa';

const PropertyBought = () => {
  const { currentUser } = useAuth();
  
  // Fetch user's offers
  const { 
    data: offers = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['buyerOffers', currentUser?.email],
    queryFn: () => getBuyerOffers(currentUser?.email),
    enabled: !!currentUser?.email
  });
  
  // Filter offers by status
  const pendingOffers = offers.filter(offer => offer.status === 'pending');
  const acceptedOffers = offers.filter(offer => offer.status === 'accepted');
  const rejectedOffers = offers.filter(offer => offer.status === 'rejected');
  const boughtProperties = offers.filter(offer => offer.status === 'bought');
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
            <FaSpinner className="mr-1" /> Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
            <FaCheckCircle className="mr-1" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
            <FaTimesCircle className="mr-1" /> Rejected
          </span>
        );
      case 'bought':
        return (
          <span className="flex items-center text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs font-medium">
            <FaReceipt className="mr-1" /> Bought
          </span>
        );
      default:
        return null;
    }
  };
  
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
        <p>Error loading offers. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Property Transactions</h1>
      
      {offers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">No property transactions yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't made any offers on properties yet.
          </p>
          <a href="/properties" className="btn btn-primary">
            Browse Properties
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Bought Properties */}
          {boughtProperties.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Purchased Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {boughtProperties.map((offer) => (
                  <div key={offer._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={offer.propertyImage} 
                        alt={offer.propertyTitle} 
                        className="w-full h-full object-cover"
                      />
                      {getStatusBadge(offer.status)}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">{offer.propertyTitle}</h3>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{offer.propertyLocation}</span>
                      </div>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaDollarSign className="mr-2" />
                        <span>${offer.offeredAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="mr-2" />
                        <span>Purchased on: {new Date(offer.buyingDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <p className="text-sm font-semibold mb-1 dark:text-gray-300">Transaction ID:</p>
                        <p className="text-xs bg-gray-100 dark:bg-gray-600 p-2 rounded font-mono dark:text-gray-300">
                          {offer.transactionId}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Accepted Offers */}
          {acceptedOffers.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Accepted Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {acceptedOffers.map((offer) => (
                  <div key={offer._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={offer.propertyImage} 
                        alt={offer.propertyTitle} 
                        className="w-full h-full object-cover"
                      />
                      {getStatusBadge(offer.status)}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">{offer.propertyTitle}</h3>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{offer.propertyLocation}</span>
                      </div>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaDollarSign className="mr-2" />
                        <span>${offer.offeredAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="mr-2" />
                        <span>Buying Date: {new Date(offer.buyingDate).toLocaleDateString()}</span>
                      </div>
                      
                      <a 
                        href={`/dashboard/payment/${offer._id}`} 
                        className="btn btn-primary w-full"
                      >
                        Proceed to Payment
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Pending Offers */}
          {pendingOffers.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Pending Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingOffers.map((offer) => (
                  <div key={offer._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={offer.propertyImage} 
                        alt={offer.propertyTitle} 
                        className="w-full h-full object-cover"
                      />
                      {getStatusBadge(offer.status)}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">{offer.propertyTitle}</h3>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{offer.propertyLocation}</span>
                      </div>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaDollarSign className="mr-2" />
                        <span>${offer.offeredAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="mr-2" />
                        <span>Buying Date: {new Date(offer.buyingDate).toLocaleDateString()}</span>
                      </div>
                      
                      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Waiting for agent response...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Rejected Offers */}
          {rejectedOffers.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Rejected Offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rejectedOffers.map((offer) => (
                  <div key={offer._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={offer.propertyImage} 
                        alt={offer.propertyTitle} 
                        className="w-full h-full object-cover"
                      />
                      {getStatusBadge(offer.status)}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">{offer.propertyTitle}</h3>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{offer.propertyLocation}</span>
                      </div>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaDollarSign className="mr-2" />
                        <span>${offer.offeredAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="mr-2" />
                        <span>Buying Date: {new Date(offer.buyingDate).toLocaleDateString()}</span>
                      </div>
                      
                      <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Your offer was rejected by the agent.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyBought; 