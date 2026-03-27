import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import RequirePermission from './RequirePermission';

// Auth pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Only Admin & Staff Routes now
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
        {/* Redirect Root to Login by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin/App Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route 
            path="users" 
            element={
              <RequirePermission allowedPermissions={['MANAGE_USERS']}>
                <UserManagement />
              </RequirePermission>
            } 
          />
          <Route 
            path="rooms" 
            element={
              <RequirePermission allowedPermissions={['MANAGE_ROOMS']}>
                <RoomManagement />
              </RequirePermission>
            } 
          />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="inventory" element={<Inventory />} />
          <Route 
            path="roles" 
            element={
              <RequirePermission allowedPermissions={['MANAGE_ROLES']}>
                <RoleManagement />
              </RequirePermission>
            } 
          />
        </Route>




        {/* Error Pages */}
        <Route path="/403" element={<div className="h-screen flex items-center justify-center text-white">403 - Forbidden</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
