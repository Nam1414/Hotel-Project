import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import RequirePermission from './RequirePermission';

// Lazy load pages
const Home = lazy(() => import('../pages/public/Home'));
const RoomList = lazy(() => import('../pages/public/RoomList'));
const RoomDetail = lazy(() => import('../pages/public/RoomDetail'));
const Booking = lazy(() => import('../pages/public/Booking'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Profile = lazy(() => import('../pages/public/Profile'));
const Services = lazy(() => import('../pages/public/Services'));
const About = lazy(() => import('../pages/public/About'));
const Contact = lazy(() => import('../pages/public/Contact'));
const Rooms = lazy(() => import('../pages/public/Rooms'));

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const RoomManagement = lazy(() => import('../pages/admin/RoomManagement'));
const BookingManagement = lazy(() => import('../pages/admin/BookingManagement'));
const RoleManagement = lazy(() => import('../pages/admin/RoleManagement'));
const Inventory = lazy(() => import('../pages/admin/Inventory'));

const StaffLayout = lazy(() => import('../layouts/StaffLayout'));
const StaffDashboard = lazy(() => import('../pages/staff/StaffDashboard'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-dark-base text-primary font-display text-2xl animate-pulse">KANT...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/:roomId" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <RequirePermission allowedRoles={['ADMIN', 'STAFF']}>
                <AdminLayout />
              </RequirePermission>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route 
            path="users" 
            element={
              <RequirePermission allowedRoles={['ADMIN']}>
                <UserManagement />
              </RequirePermission>
            } 
          />
          <Route 
            path="rooms" 
            element={
              <RequirePermission allowedRoles={['ADMIN']}>
                <RoomManagement />
              </RequirePermission>
            } 
          />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="inventory" element={<Inventory />} />
          <Route 
            path="roles" 
            element={
              <RequirePermission allowedRoles={['ADMIN']}>
                <RoleManagement />
              </RequirePermission>
            } 
          />
        </Route>

        {/* Staff Routes */}
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute>
              <RequirePermission allowedRoles={['STAFF', 'ADMIN']}>
                <StaffLayout />
              </RequirePermission>
            </ProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="bookings" element={<div className="p-8">Staff Booking Management (Coming Soon)</div>} />
          <Route path="rooms" element={<div className="p-8">Staff Room Management (Coming Soon)</div>} />
        </Route>


        {/* Error Pages */}
        <Route path="/403" element={<div className="h-screen flex items-center justify-center text-white">403 - Forbidden</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
