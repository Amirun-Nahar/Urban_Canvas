import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<div>Home Page</div>} />
              <Route path="properties" element={<div>Properties Page</div>} />
              <Route path="properties/:id" element={<div>Property Details Page</div>} />
              <Route path="agents" element={<div>Agents Page</div>} />
              <Route path="about" element={<div>About Page</div>} />
              <Route path="contact" element={<div>Contact Page</div>} />
              <Route path="login" element={<div>Login Page</div>} />
              <Route path="register" element={<div>Register Page</div>} />
            </Route>

            {/* Protected user routes */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<div>Profile Page</div>} />
              <Route path="wishlist" element={<div>Wishlist Page</div>} />
              <Route path="offers" element={<div>My Offers Page</div>} />
            </Route>

            {/* Agent routes */}
            <Route
              path="/agent"
              element={
                <PrivateRoute roles={['agent', 'admin']}>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<div>Agent Dashboard</div>} />
              <Route path="properties" element={<div>Agent Properties</div>} />
              <Route path="properties/new" element={<div>Add Property</div>} />
              <Route path="properties/:id/edit" element={<div>Edit Property</div>} />
              <Route path="analytics" element={<div>Agent Analytics</div>} />
              <Route path="settings" element={<div>Agent Settings</div>} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute roles={['admin']}>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<div>Admin Dashboard</div>} />
              <Route path="properties" element={<div>Manage Properties</div>} />
              <Route path="users" element={<div>Manage Users</div>} />
              <Route path="verifications" element={<div>Property Verifications</div>} />
              <Route path="analytics" element={<div>Admin Analytics</div>} />
              <Route path="settings" element={<div>Admin Settings</div>} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 