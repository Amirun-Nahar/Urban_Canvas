import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaBuilding, 
  FaList, 
  FaHeart, 
  FaMoneyBillWave, 
  FaStar, 
  FaUserCog, 
  FaUsers, 
  FaCheckCircle, 
  FaAd, 
  FaPlus,
  FaChartLine
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const DashboardSidebar = ({ isOpen }) => {
  const { isAdmin, isAgent } = useAuth();
  
  const sidebarClasses = `bg-gray-800 text-white w-64 min-h-screen fixed lg:static transition-transform duration-300 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  } z-30`;
  
  const linkClasses = ({ isActive }) => 
    `flex items-center space-x-3 px-4 py-3 transition-colors ${
      isActive 
        ? 'bg-blue-700 text-white' 
        : 'text-gray-300 hover:bg-gray-700'
    }`;
  
  return (
    <aside className={sidebarClasses}>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
      
      <nav className="mt-4">
        <ul>
          <li>
            <NavLink to="/dashboard" end className={linkClasses}>
              <FaHome />
              <span>Dashboard Home</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/dashboard/overview" className={linkClasses}>
              <FaChartLine />
              <span>Overview</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/dashboard/profile" className={linkClasses}>
              <FaUserCog />
              <span>Profile</span>
            </NavLink>
          </li>
          
          {/* User Routes */}
          {!isAdmin() && !isAgent() && (
            <>
              <li>
                <NavLink to="/dashboard/wishlist" className={linkClasses}>
                  <FaHeart />
                  <span>My Wishlist</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/property-bought" className={linkClasses}>
                  <FaBuilding />
                  <span>Property Bought</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-reviews" className={linkClasses}>
                  <FaStar />
                  <span>My Reviews</span>
                </NavLink>
              </li>
            </>
          )}
          
          {/* Agent Routes */}
          {isAgent() && (
            <>
              <li>
                <NavLink to="/dashboard/add-property" className={linkClasses}>
                  <FaPlus />
                  <span>Add Property</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-properties" className={linkClasses}>
                  <FaList />
                  <span>My Properties</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/requested-properties" className={linkClasses}>
                  <FaMoneyBillWave />
                  <span>Requested Properties</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/sold-properties" className={linkClasses}>
                  <FaCheckCircle />
                  <span>Sold Properties</span>
                </NavLink>
              </li>
            </>
          )}
          
          {/* Admin Routes */}
          {isAdmin() && (
            <>
              <li>
                <NavLink to="/dashboard/manage-properties" className={linkClasses}>
                  <FaBuilding />
                  <span>Manage Properties</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manage-users" className={linkClasses}>
                  <FaUsers />
                  <span>Manage Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/manage-reviews" className={linkClasses}>
                  <FaStar />
                  <span>Manage Reviews</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar; 