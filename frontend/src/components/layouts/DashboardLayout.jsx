import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  UserIcon,
  HeartIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navigation = {
    user: [
      { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
      { name: 'Wishlist', href: '/dashboard/wishlist', icon: HeartIcon },
      { name: 'My Offers', href: '/dashboard/offers', icon: DocumentTextIcon }
    ],
    agent: [
      { name: 'My Properties', href: '/agent/properties', icon: HomeIcon },
      { name: 'Add Property', href: '/agent/properties/add', icon: DocumentTextIcon },
      { name: 'Received Offers', href: '/agent/offers', icon: DocumentTextIcon },
      { name: 'Analytics', href: '/agent/analytics', icon: ChartBarIcon }
    ],
    admin: [
      { name: 'User Management', href: '/admin/users', icon: UsersIcon },
      { name: 'Property Management', href: '/admin/properties', icon: HomeIcon },
      { name: 'Verifications', href: '/admin/verifications', icon: CheckCircleIcon },
      { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon }
    ]
  };

  const currentNavigation = navigation[user.role] || navigation.user;

  // Function to get the profile image URL
  const getProfileImage = () => {
    if (!user.image) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    if (user.image.startsWith('http')) return user.image;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}${user.image}`;
  };

  return (
    <div>
      {/* Mobile sidebar */}
      <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
        {sidebarOpen ? (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" />
        ) : null}

        <div
          className={`fixed inset-0 z-40 flex transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-shrink-0 items-center px-4">
              <Link to="/" className="text-2xl font-bold text-primary">
                Real Estate
              </Link>
            </div>

            {/* User Profile Section - Mobile */}
            <div className="mt-5 flex flex-col items-center px-4">
              <img
                src={getProfileImage()}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover border-2 border-primary"
              />
              <h2 className="mt-2 text-lg font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>

            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {currentNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                        isActive
                          ? 'bg-gray-100 text-primary'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 flex-shrink-0 ${
                          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              Real Estate
            </Link>
          </div>

          {/* User Profile Section - Desktop */}
          <div className="flex flex-col items-center px-4 py-6 border-b border-gray-200">
            <img
              src={getProfileImage()}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover border-2 border-primary"
            />
            <h2 className="mt-3 text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {currentNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-gray-100 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:pl-64">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow lg:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 items-center justify-between px-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              Real Estate
            </Link>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 