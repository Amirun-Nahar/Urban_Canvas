import { useQuery } from '@tanstack/react-query';
import { getPlatformStatistics, getRealTimeStatistics, debugOffers } from '../../api/adminAPI';
import { useAuth } from '../../contexts/AuthContext';
import { FaHome, FaUsers, FaHeart, FaStar, FaDollarSign, FaBuilding, FaChartLine, FaArrowUp, FaRedo, FaClock, FaCheckCircle, FaTimes, FaBug } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const Overview = () => {
  const { currentUser, isAdmin, isAgent } = useAuth();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Full statistics query (refreshed every 5 minutes)
  const { data: statistics = {}, isLoading } = useQuery({
    queryKey: ['platformStatistics'],
    queryFn: getPlatformStatistics,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 4 * 60 * 1000 // 4 minutes
  });

  // Real-time statistics query (refreshed every 30 seconds)
  const { data: realtimeStats = {}, isLoading: realtimeLoading } = useQuery({
    queryKey: ['realTimeStatistics'],
    queryFn: getRealTimeStatistics,
    refetchInterval: 30 * 1000, // 30 seconds
    staleTime: 25 * 1000 // 25 seconds
  });

  // Use real-time data if available, fallback to full statistics
  const displayStats = { ...statistics, ...realtimeStats };

  // Chart data from backend or fallback to mock data
  const chartData = {
    monthlyProperties: statistics.monthlyProperties || [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
    monthlyUsers: statistics.monthlyUsers || [8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45]
  };

  // Update last refresh timestamp when real-time data updates
  useEffect(() => {
    if (realtimeStats && Object.keys(realtimeStats).length > 0) {
      setLastRefresh(new Date());
    }
  }, [realtimeStats]);

  // Debug function to check offers data
  const handleDebugOffers = async () => {
    try {
      const debugData = await debugOffers();
      console.log('Debug Offers Data:', debugData);
      alert(`Debug Data: ${JSON.stringify(debugData, null, 2)}`);
    } catch (error) {
      console.error('Debug error:', error);
      alert('Debug failed: ' + error.message);
    }
  };

  // Show loading state for both queries
  const isDataLoading = isLoading || realtimeLoading;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (isDataLoading && Object.keys(statistics).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading platform statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold dark:text-white">Dashboard Overview</h1>
          {isDataLoading && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="loading loading-spinner loading-xs"></span>
              <span>Refreshing...</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <FaClock className="text-accent-500" />
            <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${realtimeLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {realtimeLoading ? 'Updating...' : 'Live'}
            </span>
          </div>
          <button 
            onClick={() => {
              setLastRefresh(new Date());
              // Trigger manual refresh of both queries
              window.location.reload();
            }}
            className="btn btn-sm btn-outline btn-accent"
            disabled={realtimeLoading}
          >
            <FaRedo className={`mr-1 ${realtimeLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {isAdmin() && (
            <button 
              onClick={handleDebugOffers}
              className="btn btn-sm btn-outline btn-warning"
              title="Debug offers data"
            >
              <FaBug className="mr-1" />
              Debug
            </button>
          )}
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
              <FaHome className="text-2xl text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalProperties || 0}</p>
              {displayStats.newPropertiesToday > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400">+{displayStats.newPropertiesToday} today</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaArrowUp className="text-accent-500 mr-1" />
            <span className="text-accent-600 dark:text-accent-400">+12%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900">
              <FaUsers className="text-2xl text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalUsers || 0}</p>
              {displayStats.newUsersToday > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400">+{displayStats.newUsersToday} today</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaArrowUp className="text-accent-500 mr-1" />
            <span className="text-accent-600 dark:text-accent-400">+8%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900">
              <FaHeart className="text-2xl text-accent-600 dark:text-accent-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalWishlistItems || 0}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaArrowUp className="text-accent-500 mr-1" />
            <span className="text-accent-600 dark:text-accent-400">+15%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
              <FaDollarSign className="text-2xl text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Property Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${Math.round((displayStats.averagePropertyPrice || 0)).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <FaArrowUp className="text-accent-500 mr-1" />
            <span className="text-accent-600 dark:text-accent-400">+5%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Additional Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.verifiedProperties || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {displayStats.pendingProperties > 0 && `${displayStats.pendingProperties} pending`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FaStar className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalReviews || 0}</p>
              {displayStats.newReviewsToday > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400">+{displayStats.newReviewsToday} today</p>
              )}
            </div>
          </div>
        </div>



        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <FaUsers className="text-2xl text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Agents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.totalAgents || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {displayStats.totalAdmins || 0} admins
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FaDollarSign className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Offers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.pendingOffers || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting review</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accepted Offers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.acceptedOffers || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">In progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <FaTimes className="text-2xl text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected Offers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.rejectedOffers || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Declined</p>
            </div>
          </div>
        </div>
      </div>



      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-4">Properties Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {chartData.monthlyProperties.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-primary-500 rounded-t"
                  style={{ height: `${(value / 45) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{months[index]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Properties added per month
            </p>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {chartData.monthlyUsers.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-secondary-500 rounded-t"
                  style={{ height: `${(value / 45) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{months[index]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              New users per month
            </p>
          </div>
        </div>
      </div>



      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">New property listed: "Modern Downtown Apartment"</span>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">New user registration: john.doe@email.com</span>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">New review added for "Cozy Studio Apartment"</span>
            <span className="text-sm text-gray-500">8 hours ago</span>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Real-time Activity Feed</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${realtimeLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {realtimeLoading ? 'Updating...' : 'Live Feed'}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {displayStats.newPropertiesToday > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>+{displayStats.newPropertiesToday}</strong> new properties added today
              </span>
            </div>
          )}
          {displayStats.newUsersToday > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>+{displayStats.newUsersToday}</strong> new users registered today
              </span>
            </div>
          )}
          {displayStats.newReviewsToday > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>+{displayStats.newReviewsToday}</strong> new reviews posted today
              </span>
            </div>
          )}
          {displayStats.pendingProperties > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                <strong>{displayStats.pendingProperties}</strong> properties pending verification
              </span>
            </div>
          )}
                     {displayStats.pendingOffers > 0 && (
             <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
               <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
               <span className="text-gray-700 dark:text-gray-300">
                 <strong>{displayStats.pendingOffers}</strong> offers pending review
               </span>
             </div>
           )}

                     {!displayStats.newPropertiesToday && !displayStats.newUsersToday && !displayStats.newReviewsToday && 
            !displayStats.pendingProperties && !displayStats.pendingOffers && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              <FaClock className="text-2xl mx-auto mb-2" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isAdmin() && (
            <>
              <button className="btn btn-primary w-full">
                <FaBuilding className="mr-2" />
                Manage Properties
              </button>
              <button className="btn btn-primary w-full">
                <FaUsers className="mr-2" />
                Manage Users
              </button>
              <button className="btn btn-primary w-full">
                <FaStar className="mr-2" />
                Moderate Reviews
              </button>
            </>
          )}
          {isAgent() && (
            <>
              <button className="btn btn-primary w-full">
                <FaBuilding className="mr-2" />
                Add Property
              </button>
              <button className="btn btn-primary w-full">
                <FaChartLine className="mr-2" />
                View Analytics
              </button>
              <button className="btn btn-primary w-full">
                <FaDollarSign className="mr-2" />
                Manage Offers
              </button>
            </>
          )}
          {!isAdmin() && !isAgent() && (
            <>
              <button className="btn btn-primary w-full">
                <FaHeart className="mr-2" />
                View Wishlist
              </button>
              <button className="btn btn-primary w-full">
                <FaBuilding className="mr-2" />
                Browse Properties
              </button>
              <button className="btn btn-primary w-full">
                <FaStar className="mr-2" />
                Write Reviews
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
