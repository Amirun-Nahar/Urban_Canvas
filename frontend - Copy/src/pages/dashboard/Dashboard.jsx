import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/axios';
import {
  HomeIcon,
  HeartIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import SellingChart from '../../components/SellingChart';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    },
  });

  // Fetch recent activities
  const { data: activities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const response = await api.get('/dashboard/activities');
      return response.data;
    },
  });

  const statCards = [
    {
      title: 'Wishlist Items',
      value: stats?.wishlistCount || 0,
      icon: HeartIcon,
      link: '/dashboard/wishlist',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Reviews Written',
      value: stats?.reviewsCount || 0,
      icon: StarIcon,
      link: '/dashboard/reviews',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Properties',
      value: stats?.propertiesCount || 0,
      icon: BuildingOfficeIcon,
      link: '/dashboard/properties',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      roles: ['agent', 'admin'],
    },
    {
      title: 'Messages',
      value: stats?.messagesCount || 0,
      icon: ChatBubbleLeftIcon,
      link: '/dashboard/messages',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Here's what's happening with your account</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(
          (stat) =>
            (!stat.roles || stat.roles.includes(user?.role)) && (
              <Link
                key={stat.title}
                to={stat.link}
                className="group rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-lg ${stat.bgColor} p-3 group-hover:bg-opacity-75`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </h3>
                    <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </Link>
            )
        )}
      </div>

      {/* Selling Chart for Agents */}
      {user?.role === 'agent' && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <SellingChart />
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        {activities?.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start border-l-4 border-primary pl-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {activity.link && (
                  <Link
                    to={activity.link}
                    className="ml-4 text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent activity</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/properties"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:border-primary hover:text-primary"
          >
            <HomeIcon className="mr-3 h-6 w-6" />
            <span>Browse Properties</span>
          </Link>
          
          {user?.role === 'agent' && (
            <Link
              to="/dashboard/properties/add"
              className="flex items-center rounded-lg border border-gray-200 p-4 hover:border-primary hover:text-primary"
            >
              <BuildingOfficeIcon className="mr-3 h-6 w-6" />
              <span>Add New Property</span>
            </Link>
          )}

          <Link
            to="/dashboard/profile"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:border-primary hover:text-primary"
          >
            <HomeIcon className="mr-3 h-6 w-6" />
            <span>Update Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 