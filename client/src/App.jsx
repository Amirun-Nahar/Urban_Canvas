import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Route Protection
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import AgentRoute from './routes/AgentRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import NotFound from './pages/NotFound';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';

// User Dashboard Pages
import Wishlist from './pages/dashboard/user/Wishlist';
import PropertyBought from './pages/dashboard/user/PropertyBought';
import MyReviews from './pages/dashboard/user/MyReviews';
import MakeOffer from './pages/dashboard/user/MakeOffer';
import Payment from './pages/dashboard/user/Payment';

// Agent Dashboard Pages
import AddProperty from './pages/dashboard/agent/AddProperty';
import MyProperties from './pages/dashboard/agent/MyProperties';
import RequestedProperties from './pages/dashboard/agent/RequestedProperties';
import SoldProperties from './pages/dashboard/agent/SoldProperties';
import EditProperty from './pages/dashboard/agent/EditProperty';

// Admin Dashboard Pages
import ManageProperties from './pages/dashboard/admin/ManageProperties';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import ManageReviews from './pages/dashboard/admin/ManageReviews';
import AdvertiseProperty from './pages/dashboard/admin/AdvertiseProperty';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes with Main Layout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="properties" element={
                  <PrivateRoute>
                    <Properties />
                  </PrivateRoute>
                } />
                <Route path="properties/:id" element={
                  <PrivateRoute>
                    <PropertyDetails />
                  </PrivateRoute>
                } />
              </Route>
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }>
                {/* Dashboard Home */}
                <Route index element={<Dashboard />} />
                
                {/* User Dashboard Routes */}
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="property-bought" element={<PropertyBought />} />
                <Route path="my-reviews" element={<MyReviews />} />
                <Route path="make-offer/:id" element={<MakeOffer />} />
                <Route path="payment/:id" element={<Payment />} />
                
                {/* Agent Dashboard Routes */}
                <Route path="add-property" element={
                  <AgentRoute>
                    <AddProperty />
                  </AgentRoute>
                } />
                <Route path="my-properties" element={
                  <AgentRoute>
                    <MyProperties />
                  </AgentRoute>
                } />
                <Route path="edit-property/:id" element={
                  <AgentRoute>
                    <EditProperty />
                  </AgentRoute>
                } />
                <Route path="requested-properties" element={
                  <AgentRoute>
                    <RequestedProperties />
                  </AgentRoute>
                } />
                <Route path="sold-properties" element={
                  <AgentRoute>
                    <SoldProperties />
                  </AgentRoute>
                } />
                
                {/* Admin Dashboard Routes */}
                <Route path="manage-properties" element={
                  <AdminRoute>
                    <ManageProperties />
                  </AdminRoute>
                } />
                <Route path="manage-users" element={
                  <AdminRoute>
                    <ManageUsers />
                  </AdminRoute>
                } />
                <Route path="manage-reviews" element={
                  <AdminRoute>
                    <ManageReviews />
                  </AdminRoute>
                } />
                <Route path="advertise-property/:id" element={
                  <AdminRoute>
                    <AdvertiseProperty />
                  </AdminRoute>
                } />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
