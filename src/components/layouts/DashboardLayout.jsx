import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Properties', href: '/admin/properties', icon: BuildingOfficeIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Verifications', href: '/admin/verifications', icon: DocumentCheckIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon }
  ];

  const agentNavigation = [
    { name: 'Dashboard', href: '/agent/dashboard', icon: HomeIcon },
    { name: 'My Properties', href: '/agent/properties', icon: BuildingOfficeIcon },
    { name: 'Analytics', href: '/agent/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/agent/settings', icon: Cog6ToothIcon }
  ];

  const navigation = isAdmin ? adminNavigation : agentNavigation;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" className="text-xl font-bold text-primary">
              RealEstate
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src={user.photo || 'https://example.com/default-avatar.png'}
                alt={user.name}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs font-medium text-gray-500">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-4 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeftOnRectangleIcon
                className="mr-3 h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="bg-white shadow lg:hidden">
          <div className="flex h-16 items-center px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-900"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 