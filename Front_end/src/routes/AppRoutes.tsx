import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAppStore';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import UserListPage from '../pages/users/UserListPage';
import StaffPage from '../pages/staff/StaffPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';

// SignalR
import { startSignalR, stopSignalR } from '../services/signalRService';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  // Khởi động / dừng SignalR theo trạng thái auth
  useEffect(() => {
    if (isAuthenticated) {
      startSignalR();
    } else {
      stopSignalR();
    }
    return () => { /* cleanup khi unmount */ };
  }, [isAuthenticated]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/401" element={<UnauthorizedPage />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* /admin → redirect sang /admin/users */}
        <Route index element={<Navigate to="users" replace />} />

        {/* Danh sách tài khoản người dùng */}
        <Route path="users" element={<UserListPage />} />

        {/* Danh sách nhân sự (staff = user có role không phải Customer) */}
        <Route path="staff" element={<StaffPage />} />
      </Route>

      {/* Authenticated non-admin routes (ví dụ Manager, Receptionist) */}
      <Route
        path="/staff-portal"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="staff" replace />} />
        <Route path="staff" element={<StaffPage />} />
      </Route>

      {/* Default redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/admin/users" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
