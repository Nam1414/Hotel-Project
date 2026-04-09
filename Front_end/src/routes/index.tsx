import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RequirePermission from './RequirePermission';
import { useAppSelector } from '../hooks/useAppStore';
import { canAccessPath, getAuthorizedHomePath } from '../utils/authNavigation';

const MainLayout = lazy(() => import('../layouts/MainLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const StaffLayout = lazy(() => import('../layouts/StaffLayout'));

const Home = lazy(() => import('../pages/public/Home'));
const Rooms = lazy(() => import('../pages/public/Rooms'));
const RoomDetail = lazy(() => import('../pages/public/RoomDetail'));
const Booking = lazy(() => import('../pages/public/Booking'));
const Services = lazy(() => import('../pages/public/Services'));
const About = lazy(() => import('../pages/public/About'));
const Contact = lazy(() => import('../pages/public/Contact'));
const ProfilePage = lazy(() => import('../pages/admin/Profile'));

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const RoomsPage = lazy(() => import('../pages/admin/RoomsPage'));
const RoomTypeManagement = lazy(() => import('../pages/admin/RoomTypeManagement'));
const RoleManagement = lazy(() => import('../pages/admin/RoleManagement'));
const InventoryPage = lazy(() => import('../pages/admin/InventoryPage'));
const DamageLossPage = lazy(() => import('../pages/admin/DamageLossPage'));
const CleaningPage = lazy(() => import('../pages/admin/CleaningPage'));
const AttractionsPage = lazy(() => import('../pages/admin/AttractionsPage'));
const AmenitiesPage = lazy(() => import('../pages/admin/AmenitiesPage'));
const CMSPage = lazy(() => import('../pages/admin/CMS'));
const BookingManagementPage = lazy(() => import('../pages/admin/BookingManagement'));
const InvoiceManagementPage = lazy(() => import('../pages/staff/InvoiceManagement'));
const VoucherManagementPage = lazy(() => import('../pages/admin/VoucherManagement'));
const ServiceOrderManagementPage = lazy(() => import('../pages/staff/ServiceOrderManagement'));
const UnauthorizedPage = lazy(() => import('../pages/errors/UnauthorizedPage'));

const StaffBookingPage = lazy(() => import('../pages/admin/BookingManagement'));
const StaffInvoicePage = lazy(() => import('../pages/staff/InvoiceManagement'));
const StaffCleaningPage = lazy(() => import('../pages/admin/CleaningPage'));

const LossAndDamageManagement = lazy(() => import('../pages/LossAndDamageManagement'));

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const homePath = getAuthorizedHomePath(user);

  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-dark-base text-primary font-display text-2xl animate-pulse">KANT...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
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

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Navigate to={isAuthenticated ? homePath : '/login'} replace />
          }
        />

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
            path="amenities"
            element={
              <RequirePermission allowedPermissions={['MANAGE_ROOMS']}>
                <AmenitiesPage />
              </RequirePermission>
            }
          />
          <Route
            path="cms"
            element={
              <RequirePermission allowedPermissions={['MANAGE_CONTENT']}>
                <CMSPage />
              </RequirePermission>
            }
          />
          <Route
            path="bookings"
            element={
              <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                <BookingManagementPage />
              </RequirePermission>
            }
          />
          <Route
            path="bookings/manage"
            element={
              <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                <BookingManagementPage />
              </RequirePermission>
            }
          />
          <Route
            path="bookings/arrivals"
            element={
              <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                <BookingManagementPage />
              </RequirePermission>
            }
          />
          <Route
            path="bookings/in-house"
            element={
              <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                <BookingManagementPage />
              </RequirePermission>
            }
          />
          <Route
            path="bookings/check-out"
            element={
              <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                <BookingManagementPage />
              </RequirePermission>
            }
          />
          <Route
            path="invoices"
            element={
              <RequirePermission allowedPermissions={['MANAGE_INVOICES']}>
                <InvoiceManagementPage />
              </RequirePermission>
            }
          />
          <Route
            path="vouchers"
            element={
              <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                <VoucherManagementPage />
              </RequirePermission>
            }
          />
          <Route
            path="orders"
            element={
              <RequirePermission allowedPermissions={['MANAGE_SERVICES', 'MANAGE_ROOMS']}>
                <ServiceOrderManagementPage />
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
            <ProtectedRoute>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to={canAccessPath(user, '/staff/cleaning') ? '/staff/cleaning' : '/staff/bookings/manage'} replace />}
          />
          <Route
            path="cleaning"
            element={
              <RequirePermission allowedPermissions={['MANAGE_ROOMS']}>
                <StaffCleaningPage />
              </RequirePermission>
            }
          />
          <Route path="bookings">
            <Route
              path="manage"
              element={
                <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                  <StaffBookingPage />
                </RequirePermission>
              }
            />
            <Route
              path="arrivals"
              element={
                <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                  <StaffBookingPage />
                </RequirePermission>
              }
            />
            <Route
              path="in-house"
              element={
                <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                  <StaffBookingPage />
                </RequirePermission>
              }
            />
            <Route
              path="check-out"
              element={
                <RequirePermission allowedPermissions={['MANAGE_BOOKINGS']}>
                  <StaffBookingPage />
                </RequirePermission>
              }
            />
          </Route>
          <Route
            path="invoices"
            element={
              <RequirePermission allowedPermissions={['MANAGE_INVOICES']}>
                <StaffInvoicePage />
              </RequirePermission>
            }
          />
          <Route
            path="orders"
            element={
              <RequirePermission allowedPermissions={['MANAGE_SERVICES', 'MANAGE_ROOMS']}>
                <ServiceOrderManagementPage />
              </RequirePermission>
            }
          />
        </Route>

        <Route path="/loss-and-damage" element={<ProtectedRoute><LossAndDamageManagement /></ProtectedRoute>} />

        {/* Error Pages */}
        <Route path="/401" element={<UnauthorizedPage />} />
        <Route path="/403" element={<Navigate to="/401" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
