import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/useAppStore';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import UserListPage from '../pages/users/UserListPage';
import StaffPage from '../pages/staff/StaffPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';

// Equipment module
import EquipmentPage from '../pages/EquipmentPage';

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
  }, [isAuthenticated, dispatch]);

  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />

      {/*
       * /401 – Unauthorized page
       * Hiển thị khi ProtectedRoute phát hiện sai role/permission,
       * hoặc khi interceptor bắt 403 từ backend.
       */}
      <Route path="/401" element={<UnauthorizedPage />} />

      {/* ── Admin routes ───────────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          // Check quyền:
          //   - Chưa đăng nhập     → redirect /login (lưu returnUrl)
          //   - Đã đăng nhập nhưng
          //     không phải Admin   → redirect /401
          <ProtectedRoute requiredRole="Admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* /admin → redirect sang /admin/users */}
        <Route index element={<Navigate to="users" replace />} />

        {/* Danh sách tài khoản */}
        <Route path="users" element={<UserListPage />} />

        {/* Danh sách nhân sự */}
        <Route path="staff" element={<StaffPage />} />

        {/*
         * ── EQUIPMENT MODULE ───────────────────────────────────────
         * Thêm vật tư
         * Search – Tìm kiếm vật tư
         * Danh sách vật tư
         * Ghi nhận vật tư hỏng
         * Đồng bộ kho + phòng
         * Đền bù
         * Thất thoát
         *
         * Route này nằm TRONG <AdminLayout> → dùng chung sidebar/header.
         * Nếu muốn tách layout riêng, chuyển ra ngoài Route /admin.
         */}
        <Route path="equipment" element={<EquipmentPage />} />
      </Route>

      {/* ── Staff-portal: Manager, Receptionist, v.v. ──────────────── */}
      <Route
        path="/staff-portal"
        element={
          // Chỉ cần đăng nhập, không yêu cầu role cụ thể
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="staff" replace />} />
        <Route path="staff" element={<StaffPage />} />

        {/*
         * Manager cũng có thể truy cập Equipment
         * nhưng với quyền hạn chế hơn (chỉ xem + ghi nhận hỏng).
         * Backend [Authorize(Roles = "Admin,Manager")] xử lý.
         */}
        <Route path="equipment" element={<EquipmentPage />} />
      </Route>

      {/* ── Default redirect ───────────────────────────────────────── */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/admin/users" replace />
            : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;