import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const DashboardNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  
  return (
    <nav className="bg-white shadow-md dark:bg-gray-800 sticky top-0 z-20">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          <Link to="/" className="flex items-center">
            <FaBuilding className="text-primary text-xl mr-2" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">Urban Canvas</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={currentUser?.image || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'} 
                alt={currentUser?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden md:inline text-gray-700 dark:text-gray-300">
              {currentUser?.name}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 focus:outline-none"
            title="Logout"
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 