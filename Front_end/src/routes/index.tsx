import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminShell';
import ProtectedRoute from './ProtectedRoute';
import RequirePermission from './RequirePermission';
import { useAppSelector } from '../hooks/useAppStore';
import { getAuthorizedHomePath } from '../utils/authNavigation';

// Auth pages
const Login = lazy(() => import('../pages/auth/LoginPage'));
const Register = lazy(() => import('../pages/auth/Register'));

// Only Admin & Staff Routes now
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const RoomsPage = lazy(() => import('../pages/admin/RoomsPage'));
const RoomTypeManagement = lazy(() => import('../pages/admin/RoomTypeManagement'));
const RoleManagement = lazy(() => import('../pages/admin/RoleManagement'));
const InventoryPage = lazy(() => import('../pages/admin/InventoryPage'));
const DamageLossPage = lazy(() => import('../pages/admin/DamageLossPage'));
const CleaningPage = lazy(() => import('../pages/admin/CleaningPage'));
const AttractionsPage = lazy(() => import('../pages/admin/AttractionsPage'));
const ProfilePage = lazy(() => import('../pages/admin/Profile'));
const UnauthorizedPage = lazy(() => import('../pages/errors/UnauthorizedPage'));

const StaffLayout = lazy(() => import('../layouts/StaffLayout'));
const StaffDashboard = lazy(() => import('../pages/staff/StaffDashboard'));
const StaffCleaningPage = lazy(() => import('../pages/admin/CleaningPage'));

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const homePath = getAuthorizedHomePath(user);

  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-dark-base text-primary font-display text-2xl animate-pulse">KANT...</div>}>
      <Routes>
        {/* Redirect Root to Login by default */}
        <Route path="/" element={<Navigate to={isAuthenticated ? homePath : '/login'} replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navigate to="/admin/profile" replace />
            </ProtectedRoute>
          }
        />

        {/* Admin/App Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <RequirePermission allowedPermissions={['VIEW_DASHBOARD']}>
                <AdminDashboard />
              </RequirePermission>
            }
          />
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
                <RoomsPage />
              </RequirePermission>
            } 
          />
          <Route
            path="room-types"
            element={
              <RequirePermission allowedPermissions={['MANAGE_ROOMS']}>
                <RoomTypeManagement />
              </RequirePermission>
            }
          />
          <Route
            path="cleaning"
            element={
              <RequirePermission allowedPermissions={['MANAGE_ROOMS']}>
                <CleaningPage />
              </RequirePermission>
            }
          />
          <Route
            path="inventory"
            element={
              <RequirePermission allowedPermissions={['MANAGE_INVENTORY']}>
                <InventoryPage />
              </RequirePermission>
            }
          />
          <Route
            path="inventory/damages"
            element={
              <RequirePermission allowedPermissions={['MANAGE_INVENTORY']}>
                <DamageLossPage />
              </RequirePermission>
            }
          />
          <Route
            path="attractions"
            element={
              <RequirePermission allowedPermissions={['MANAGE_CONTENT']}>
                <AttractionsPage />
              </RequirePermission>
            }
          />
          <Route
            path="profile"
            element={
              <ProfilePage />
            }
          />
          <Route 
            path="roles" 
            element={
              <RequirePermission allowedPermissions={['MANAGE_ROLES']}>
                <RoleManagement />
              </RequirePermission>
            } 
          />
        </Route>

        <Route
          path="/staff"
          element={
            <ProtectedRoute requiredRole="Housekeeping">
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/staff/cleaning" replace />} />
          <Route path="cleaning" element={<StaffCleaningPage />} />
        </Route>




        {/* Error Pages */}
        <Route path="/401" element={<UnauthorizedPage />} />
        <Route path="/403" element={<Navigate to="/401" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
