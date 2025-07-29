import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
];

const userNavigation = {
  user: [
    { name: 'Dashboard', href: '/dashboard/profile' },
    { name: 'My Wishlist', href: '/dashboard/wishlist' },
    { name: 'My Offers', href: '/dashboard/offers' }
  ],
  agent: [
    { name: 'Dashboard', href: '/agent/properties' },
    { name: 'My Properties', href: '/agent/properties' },
    { name: 'Received Offers', href: '/agent/offers' },
    { name: 'Analytics', href: '/agent/analytics' }
  ],
  admin: [
    { name: 'Dashboard', href: '/admin/users' },
    { name: 'User Management', href: '/admin/users' },
    { name: 'Property Management', href: '/admin/properties' },
    { name: 'Analytics', href: '/admin/analytics' }
  ]
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiBaseUrl.replace('/api', '');

  const currentUserNavigation = userNavigation[user?.role] || userNavigation.user;

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Add a placeholder div to prevent content jump */}
      <div className="h-16" />
      
      <Disclosure as="nav" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow' : 'bg-white shadow'
      }`}>
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="text-2xl font-bold text-primary">
                      Urban Canvas
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  {isAuthenticated ? (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          {user.image ? (
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={`${baseUrl}${user.image}`}
                              alt={user.name}
                            />
                          ) : (
                            <UserCircleIcon className="h-8 w-8 text-gray-400" />
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-4 py-2">
                            <p className="text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <div className="border-t border-gray-100">
                            {currentUserNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={`block px-4 py-2 text-sm text-gray-700 ${
                                      active ? 'bg-gray-100' : ''
                                    }`}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                          <div className="border-t border-gray-100">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={logout}
                                  className={`block w-full px-4 py-2 text-left text-sm text-gray-700 ${
                                    active ? 'bg-gray-100' : ''
                                  }`}
                                >
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Link
                        to="/login"
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    {user.image ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={`${baseUrl}${user.image}`}
                        alt={user.name}
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    )}
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm font-medium text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {currentUserNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex flex-col space-y-2 px-4">
                    <Link
                      to="/login"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="block rounded-md bg-primary px-3 py-2 text-base font-medium text-white hover:bg-primary/90"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default Navbar; 