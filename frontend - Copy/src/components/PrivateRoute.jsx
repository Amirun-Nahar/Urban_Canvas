import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If user's role is not allowed, redirect to home page
    return <Navigate to="/" replace />;
  }

  // If user is logged in and has required role (if any), render the protected component
  return children;
};

export default PrivateRoute; 