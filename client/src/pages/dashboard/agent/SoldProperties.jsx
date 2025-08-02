import { useQuery } from '@tanstack/react-query';
import { getAgentSoldProperties } from '../../../api/offerAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaUser, FaReceipt } from 'react-icons/fa';

const SoldProperties = () => {
  const { currentUser } = useAuth();
  
  // Fetch agent's sold properties
  const { 
    data: response = { soldProperties: [], totalSold: 0 }, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['agentSoldProperties', currentUser?.email],
    queryFn: () => getAgentSoldProperties(currentUser?.email),
    enabled: !!currentUser?.email
  });
  
  // Extract sold properties from response
  const soldProperties = response.soldProperties || [];
  const totalSold = response.totalSold || 0;
  
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
        <p>Error loading sold properties. Please try again later.</p>
      </div>
    );
  }
  
  // Calculate total sales (with safety check)
  const totalSales = Array.isArray(soldProperties) 
    ? soldProperties.reduce((total, property) => total + (property.offeredAmount || 0), 0)
    : 0;
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Sold Properties</h1>
      
      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">Total Properties Sold</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{soldProperties.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">Total Sales</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">${totalSales.toLocaleString()}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">Average Sale Price</h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            ${soldProperties.length ? Math.round(totalSales / soldProperties.length).toLocaleString() : 0}
          </p>
        </div>
      </div>
      
      {soldProperties.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">No sold properties yet</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You haven't sold any properties yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.isArray(soldProperties) && soldProperties.map((property) => (
            <div 
              key={property._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Property Image */}
                <div className="h-full">
                  <img 
                    src={property.propertyImage} 
                    alt={property.propertyTitle} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Property Details */}
                <div className="p-6 md:col-span-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 dark:text-white">{property.propertyTitle}</h2>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{property.propertyLocation}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-0">
                      <div className="bg-green-50 dark:bg-green-900 p-3 rounded-md">
                        <div className="text-green-800 dark:text-green-200 font-semibold mb-1">Sold For</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-300">
                          ${property.offeredAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Buyer Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Buyer Information</h3>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={property.buyerImage || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'} 
                            alt={property.buyerName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">{property.buyerName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{property.buyerEmail}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Transaction Details</h3>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="mr-2" />
                        <span>Purchase Date: {new Date(property.buyingDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <FaReceipt className="mr-2" />
                        <span className="text-xs font-mono">Transaction ID: {property.transactionId}</span>
                      </div>
                    </div>
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

export default SoldProperties; 