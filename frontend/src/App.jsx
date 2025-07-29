import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AllProperties from './pages/AllProperties';
import PropertyDetails from './pages/PropertyDetails';

// User Dashboard Pages
import Profile from './pages/dashboard/Profile';
import Wishlist from './pages/dashboard/Wishlist';
import Reviews from './pages/dashboard/Reviews';
import Payment from './pages/dashboard/Payment';

// Agent Dashboard Pages
import AgentProperties from './pages/dashboard/Properties';
import AdvertiseProperty from './pages/dashboard/AdvertiseProperty';
import ReportedProperties from './pages/dashboard/ReportedProperties';

// Admin Dashboard Pages
import ManageUsers from './pages/dashboard/ManageUsers';
import ManageProperties from './pages/dashboard/ManageProperties';
import ManageReviews from './pages/dashboard/ManageReviews';

// 404 Page
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="properties" element={<AllProperties />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
      </Route>

      {/* User Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="profile" element={<Profile />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="payment" element={<Payment />} />
      </Route>

      {/* Agent Dashboard Routes */}
      <Route
        path="/agent"
        element={
          <PrivateRoute allowedRoles={['agent']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="properties" element={<AgentProperties />} />
        <Route path="properties/add" element={<AdvertiseProperty />} />
        <Route path="reported" element={<ReportedProperties />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="users" element={<ManageUsers />} />
        <Route path="properties" element={<ManageProperties />} />
        <Route path="reviews" element={<ManageReviews />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App; 