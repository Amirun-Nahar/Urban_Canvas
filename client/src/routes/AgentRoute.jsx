import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AgentRoute = ({ children }) => {
  const { currentUser, isAgent, isFraud, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAgent()) {
    // Redirect to home if not an agent
    return <Navigate to="/" replace />;
  }
  
  if (isFraud()) {
    // Redirect to home if agent is marked as fraud
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AgentRoute; 