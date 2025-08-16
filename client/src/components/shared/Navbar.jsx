import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaBars, FaTimes, FaHome, FaBuilding, FaSignInAlt, FaUserPlus, FaCompass } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled 
        ? 'bg-white dark:bg-gray-900 shadow-sm' 
        : 'bg-white dark:bg-gray-900'
      }`}
    >
      {/* Decorative top border */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>

      <nav className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center space-x-2 text-xl font-display font-semibold text-primary-600 dark:text-primary-400"
          >
            <div className="relative">
              <FaCompass className="text-2xl transform group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <div className="flex items-baseline">
              <span className="text-accent-500">Urban</span>
              <span>Canvas</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {[
              { to: '/', icon: <FaHome />, label: 'Home' },
              { to: '/properties', icon: <FaBuilding />, label: 'Properties' },
              ...(currentUser ? [
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/dashboard/overview', label: 'Overview' },
                { to: '/dashboard/profile', label: 'Profile' }
              ] : [])
            ].map((item) => (
              <NavLink 
                key={item.to}
                to={item.to} 
                className={({ isActive }) => `
                  nav-link relative group px-2 py-1 text-sm
                  ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'}
                `}
              >
                <span className="flex items-center space-x-1.5">
                  {item.icon && <span className="text-base">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </NavLink>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800">
                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    {currentUser.image ? (
                      <img 
                        src={currentUser.image} 
                        alt={currentUser.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-lg text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm text-sm py-1 px-3"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="btn btn-primary btn-sm text-sm py-1 px-3"
                >
                  <FaSignInAlt className="text-base mr-1" />
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-secondary btn-sm text-sm py-1 px-3"
                >
                  <FaUserPlus className="text-base mr-1" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 z-50 lg:hidden ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } transition-opacity duration-300`}
        >
          <div 
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsMenuOpen(false)}
          />
          <div 
            className={`absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-4">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { to: '/', icon: <FaHome />, label: 'Home' },
                  { to: '/properties', icon: <FaBuilding />, label: 'Properties' },
                  ...(currentUser ? [
                    { to: '/dashboard', label: 'Dashboard' },
                    { to: '/dashboard/overview', label: 'Overview' },
                    { to: '/dashboard/profile', label: 'Profile' }
                  ] : [])
                ].map((item) => (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `
                      flex items-center space-x-2 px-3 py-2 rounded-md text-sm
                      ${isActive 
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  {currentUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          {currentUser.image ? (
                            <img 
                              src={currentUser.image} 
                              alt={currentUser.name} 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="text-xl text-primary-600 dark:text-primary-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">
                            {currentUser.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {currentUser.email}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full btn btn-secondary btn-sm text-sm"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link 
                        to="/login" 
                        className="w-full btn btn-primary btn-sm text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaSignInAlt className="mr-1" />
                        Sign In
                      </Link>
                      <Link 
                        to="/register" 
                        className="w-full btn btn-secondary btn-sm text-sm"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaUserPlus className="mr-1" />
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 