import { useAuth } from '../../contexts/AuthContext';
import { FaHome, FaBuilding, FaList, FaHeart, FaMoneyBillWave, FaStar, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, isAdmin, isAgent } = useAuth();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img 
              src={currentUser?.image || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'} 
              alt={currentUser?.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">{currentUser?.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{currentUser?.email}</p>
            <p className="mt-2 inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)}
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Quick Links</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* User Quick Links */}
        {!isAdmin() && !isAgent() && (
          <>
            <Link to="/dashboard/wishlist" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                <FaHeart className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">My Wishlist</h3>
                <p className="text-gray-600 dark:text-gray-400">View your saved properties</p>
              </div>
            </Link>
            
            <Link to="/dashboard/property-bought" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                <FaBuilding className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">Property Bought</h3>
                <p className="text-gray-600 dark:text-gray-400">View your purchased properties</p>
              </div>
            </Link>
            
            <Link to="/dashboard/my-reviews" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-4">
                <FaStar className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">My Reviews</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage your property reviews</p>
              </div>
            </Link>
          </>
        )}
        
        {/* Agent Quick Links */}
        {isAgent() && (
          <>
            <Link to="/dashboard/add-property" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                <FaHome className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">Add Property</h3>
                <p className="text-gray-600 dark:text-gray-400">List a new property</p>
              </div>
            </Link>
            
            <Link to="/dashboard/my-properties" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                <FaList className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">My Properties</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage your property listings</p>
              </div>
            </Link>
            
            <Link to="/dashboard/requested-properties" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-4">
                <FaMoneyBillWave className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">Requested Properties</h3>
                <p className="text-gray-600 dark:text-gray-400">View and manage offers</p>
              </div>
            </Link>
            
            <Link to="/dashboard/sold-properties" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                <FaCheckCircle className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">Sold Properties</h3>
                <p className="text-gray-600 dark:text-gray-400">View your sold properties</p>
              </div>
            </Link>
          </>
        )}
        
        {/* Admin Quick Links */}
        {isAdmin() && (
          <>
            <Link to="/dashboard/manage-properties" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                <FaBuilding className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">Manage Properties</h3>
                <p className="text-gray-600 dark:text-gray-400">Verify and manage properties</p>
              </div>
            </Link>
            
            <Link to="/dashboard/manage-users" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                <FaUsers className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">Manage Users</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage user accounts</p>
              </div>
            </Link>
            
            <Link to="/dashboard/manage-reviews" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-4">
                <FaStar className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">Manage Reviews</h3>
                <p className="text-gray-600 dark:text-gray-400">Moderate user reviews</p>
              </div>
            </Link>
            
            <Link to="/dashboard/manage-properties" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                <FaCheckCircle className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium dark:text-white">Advertise Property</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage featured properties</p>
              </div>
            </Link>
          </>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Need Help?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you need assistance or have any questions about using the dashboard, please contact our support team.
        </p>
        <div className="flex items-center">
          <Link to="/" className="btn btn-outline btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 