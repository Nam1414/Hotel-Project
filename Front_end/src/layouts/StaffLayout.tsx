import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  CreditCard,
  DoorClosed,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  Tv,
  UserCircle,
  Users,
  BadgePercent,
  ShieldCheck,
  TrendingUp,
  History,
  X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useThemeStore } from '../store/themeStore';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';
import NotificationBell from '../components/notification/NotificationBell';
import { canAccessPath } from '../utils/authNavigation';

const StaffLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReceptionOpen, setIsReceptionOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };

  const canManageBookings = canAccessPath(user, '/staff/bookings/manage');
  const canManageInvoices = canAccessPath(user, '/staff/invoices');
  const canManageOrders = canAccessPath(user, '/staff/orders');
  const hasReceptionFeatures = canManageBookings;

  const receptionItems = useMemo(
    () =>
      canManageBookings
        ? [
            { icon: CalendarDays, label: t('nav.bookings'), path: '/staff/bookings/manage' },
            { icon: Tv, label: 'Khách đến hôm nay', path: '/staff/bookings/arrivals' },
            { icon: House, label: 'Khách đang lưu trú', path: '/staff/bookings/in-house' },
            { icon: DoorClosed, label: 'Thủ tục trả phòng', path: '/staff/bookings/check-out' },
          ]
        : [],
    [canManageBookings]
  );

  const canManageRooms = canAccessPath(user, '/staff/cleaning'); // Requires MANAGE_ROOMS
  const canManageVouchers = canAccessPath(user, '/staff/vouchers'); // Requires MANAGE_BOOKINGS
  const canManageMemberships = canAccessPath(user, '/staff/memberships'); // Requires MANAGE_BOOKINGS
  const canViewReports = canAccessPath(user, '/admin/analytics'); // Requires VIEW_REPORTS
  const canManageUsers = canAccessPath(user, '/admin/users'); // Requires MANAGE_USERS
  const canManageRoles = canAccessPath(user, '/admin/roles'); // Requires MANAGE_ROLES

  const utilityItems = useMemo(() => {
    const items = [{ icon: LayoutDashboard, label: t('nav.dashboard'), path: '/staff' }];
    
    if (canManageRooms) {
      items.push({ icon: ClipboardList, label: t('nav.cleaning'), path: '/staff/cleaning' });
    }
    
    if (canManageInvoices) {
      items.push({ icon: CreditCard, label: t('nav.invoices'), path: '/staff/invoices' });
    }
    
    if (canManageOrders) {
      items.push({ icon: ShoppingCart, label: t('nav.services'), path: '/staff/orders' });
    }

    if (canManageVouchers) {
      items.push({ icon: BadgePercent, label: t('nav.vouchers'), path: '/staff/vouchers' });
    }

    if (canManageMemberships) {
      items.push({ icon: Users, label: t('nav.customers'), path: '/staff/memberships' });
    }

    if (canViewReports && user?.role?.toLowerCase() === 'admin') {
      items.push({ icon: TrendingUp, label: t('nav.analytics'), path: '/admin/analytics' });
    }

    if (canManageUsers) {
      items.push({ icon: Users, label: t('nav.accounts'), path: '/admin/users' });
    }

    if (canManageRoles) {
      items.push({ icon: ShieldCheck, label: t('nav.roles'), path: '/admin/roles' });
      items.push({ icon: History, label: t('nav.audit_logs'), path: '/admin/audit-logs' });
    }

    return items;
  }, [canManageRooms, canManageInvoices, canManageOrders, canManageVouchers, canManageMemberships, canViewReports, canManageUsers, canManageRoles, t]);

  const isReceptionSectionActive = receptionItems.some((item) => location.pathname.startsWith(item.path));

  useEffect(() => {
    if (isReceptionSectionActive) {
      setIsReceptionOpen(true);
    }
  }, [isReceptionSectionActive]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentTitle = useMemo(() => {
    const allItems = [
      ...receptionItems,
      ...utilityItems,
    ];
    return allItems.find((item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/'))?.label ?? 'Staff Portal';
  }, [location.pathname, receptionItems, utilityItems]);

  const renderNav = () => (
    <>
      <nav className="flex-grow py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {/* Reception Section */}
        {hasReceptionFeatures && (
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setIsReceptionOpen((v) => !v)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200',
                isReceptionSectionActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-[var(--text-muted)] hover:bg-primary/5 hover:text-primary'
              )}
            >
              <span className="flex items-center gap-3">
                <Tv size={20} className={cn(isReceptionSectionActive ? 'text-primary' : '')} />
                {!isCollapsed && <span className="font-semibold tracking-wide">Quầy Lễ tân</span>}
              </span>
              {!isCollapsed && (isReceptionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
            </button>

            {!isCollapsed && isReceptionOpen && (
              <div className="ml-5 mt-1 border-l border-[var(--nav-border)] pl-4 space-y-1">
                {receptionItems.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 relative',
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-[var(--text-muted)] hover:bg-primary/5 hover:text-primary'
                      )}
                    >
                      <Icon size={16} className={cn(isActive ? 'text-white' : 'group-hover:text-primary')} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Utility Items */}
        {utilityItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/staff' && location.pathname.startsWith(item.path + '/'));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-[var(--text-muted)] hover:bg-primary/5 hover:text-primary'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className={cn(isActive ? 'text-primary' : 'group-hover:text-primary')} />
              {!isCollapsed && <span className="font-semibold tracking-wide">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="border-t border-[var(--nav-border)] p-4">
        {!isCollapsed && (
          <div className="mb-3 rounded-xl border border-[var(--nav-border)] bg-[var(--bg-subtle)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--text-title)] truncate">
              {user?.fullName || user?.name || 'Nhân viên'}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">
              {user?.role || 'Staff'}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-500 hover:bg-rose-500/10 transition-all group"
          title={isCollapsed ? 'Đăng xuất' : undefined}
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          {!isCollapsed && <span className="font-bold tracking-wide">Đăng xuất</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="relative hidden lg:flex bg-[var(--nav-bg)] border-r border-[var(--nav-border)] flex-col z-30 shadow-2xl shadow-black/5"
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-[var(--nav-border)]">
          {!isCollapsed && (
            <div>
              <Link
                to="/"
                className="text-xl font-display font-bold tracking-widest bg-gradient-to-r from-primary to-primary-dark bg-clip-text !text-transparent"
              >
                KANT
              </Link>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {user?.role === 'Housekeeping' ? 'Housekeeping Portal' : 'Staff Portal'}
              </p>
            </div>
          )}
          {isCollapsed && (
            <Link to="/" className="mx-auto text-xl font-display font-bold tracking-widest !text-primary">
              K
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'rounded-lg p-2 text-primary transition-colors hover:bg-primary/5',
              isCollapsed && 'mx-auto'
            )}
            aria-label={isCollapsed ? 'Mở menu' : 'Thu gọn menu'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {renderNav()}
      </motion.aside>

      {/* ── Mobile Overlay ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Sidebar ── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] bg-[var(--nav-bg)] border-r border-[var(--nav-border)] flex flex-col transition-transform duration-300 lg:hidden shadow-2xl',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-[var(--nav-border)]">
          <Link to="/" className="text-xl font-display font-bold tracking-widest !text-primary">
            KANT
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-primary/5 text-primary transition-colors"
            aria-label="Đóng menu"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        {renderNav()}
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="min-h-20 bg-[var(--nav-bg)]/80 backdrop-blur-xl border-b border-[var(--nav-border)] flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[var(--nav-border)] text-primary hover:bg-primary/5 transition-colors"
              aria-label="Mở menu điều hướng"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-lg sm:text-xl font-display font-semibold text-[var(--text-title)] truncate">
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[var(--nav-border)] text-[var(--text-muted)] hover:bg-primary/5 hover:border-primary/30 transition-all shadow-sm"
              title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {isDarkMode
                ? <Sun size={18} className="text-yellow-500" />
                : <Moon size={18} className="text-indigo-500" />
              }
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2.5 rounded-xl border border-[var(--nav-border)] text-primary font-bold hover:bg-primary/5 hover:border-primary/30 transition-all shadow-sm min-w-[45px]"
              title={i18n.language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            >
              {i18n.language === 'vi' ? 'VI' : 'EN'}
            </button>

            <NotificationBell />

            {/* User Info */}
            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-[var(--nav-border)]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[var(--text-title)]">
                  {user?.fullName || user?.name}
                </p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                  {user?.role === 'Receptionist' ? 'RECEPTIONIST' : user?.role?.toUpperCase()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
