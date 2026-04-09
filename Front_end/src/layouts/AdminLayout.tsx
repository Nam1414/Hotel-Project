import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useNotification } from '../hooks/useNotification';
import NotificationBell from '../components/notification/NotificationBell';
import {
  LayoutDashboard,
  Users,
  Bed,
  Package,
  ClipboardList,
  CalendarClock,
  CalendarDays,
  CreditCard,
  DoorClosed,
  House,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UserCircle,
  FileText,
  Sparkles,
  MapPin,
  TriangleAlert,
  BadgePercent,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const AdminLayout: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(true);

  const { requestPermission } = useNotification();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users', permissions: ['MANAGE_USERS'] },
    { icon: Bed, label: 'Room Management', path: '/admin/rooms', permissions: ['MANAGE_ROOMS'] },
    { icon: ClipboardList, label: 'Cleaning', path: '/admin/cleaning', permissions: ['MANAGE_ROOMS'] },
    { icon: Sparkles, label: 'Amenities', path: '/admin/amenities', permissions: ['MANAGE_ROOMS'] },
    { icon: Package, label: 'Inventory', path: '/admin/inventory', permissions: ['MANAGE_INVENTORY'] },
    { icon: TriangleAlert, label: 'Damage & Loss', path: '/admin/inventory/damages', permissions: ['MANAGE_INVENTORY'] },
    { icon: MapPin, label: 'Attractions', path: '/admin/attractions', permissions: ['MANAGE_CONTENT'] },
    { icon: FileText, label: 'CMS', path: '/admin/cms', permissions: ['MANAGE_CONTENT'] },
    { icon: CreditCard, label: 'Invoices', path: '/admin/invoices', permissions: ['MANAGE_INVOICES'] },
    { icon: BadgePercent, label: 'Vouchers', path: '/admin/vouchers', permissions: ['MANAGE_BOOKINGS'] },
    { icon: Package, label: 'Service Orders', path: '/admin/orders', permissions: ['MANAGE_SERVICES', 'MANAGE_ROOMS'] },
    { icon: ShieldCheck, label: 'Roles & Permissions', path: '/admin/roles', permissions: ['MANAGE_ROLES'] },
  ];

  const bookingMenuItems = [
    { icon: CalendarClock, label: 'Tất cả booking', path: '/admin/bookings/manage', permissions: ['MANAGE_BOOKINGS'] },
    { icon: CalendarDays, label: 'Khách đến hôm nay', path: '/admin/bookings/arrivals', permissions: ['MANAGE_BOOKINGS'] },
    { icon: House, label: 'Khách đang lưu trú', path: '/admin/bookings/in-house', permissions: ['MANAGE_BOOKINGS'] },
    { icon: DoorClosed, label: 'Thủ tục trả phòng', path: '/admin/bookings/check-out', permissions: ['MANAGE_BOOKINGS'] },
  ];

  const filteredMenu = menuItems.filter((item) => {
    const hasPermission = item.permissions ? item.permissions.some((p) => user?.permissions?.includes(p)) : true;
    return hasPermission;
  });

  const filteredBookingMenu = bookingMenuItems.filter((item) => {
    const hasPermission = item.permissions ? item.permissions.some((p) => user?.permissions?.includes(p)) : true;
    return hasPermission;
  });

  const isBookingSectionActive = filteredBookingMenu.some((item) => location.pathname === item.path);

  useEffect(() => {
    if (isBookingSectionActive) {
      setIsBookingMenuOpen(true);
    }
  }, [isBookingSectionActive]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentTitle =
    filteredBookingMenu.find((item) => item.path === location.pathname)?.label ||
    filteredMenu.find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))?.label ||
    'Dashboard';

  const renderNav = () => (
    <>
      <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto">
        {filteredBookingMenu.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setIsBookingMenuOpen((prev) => !prev)}
              className={cn(
                'flex w-full items-center justify-between px-4 py-3 rounded-xl transition-all duration-200',
                isBookingSectionActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-primary'
              )}
            >
              <span className="flex items-center space-x-3">
                <CalendarClock size={20} />
                {!isCollapsed && <span className="font-medium">Quản lý Đặt phòng</span>}
              </span>
              {!isCollapsed && (isBookingMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
            </button>

            {!isCollapsed && isBookingMenuOpen && (
              <div className="ml-3 border-l border-white/10 pl-3 space-y-1">
                {filteredBookingMenu.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                        isActive ? 'bg-primary text-dark-base shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-primary'
                      )}
                    >
                      <Icon size={18} className={cn(isActive ? 'text-dark-base' : 'group-hover:text-primary')} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive ? 'bg-primary text-dark-base shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-primary'
              )}
            >
              <Icon size={20} className={cn(isActive ? 'text-dark-base' : 'group-hover:text-primary')} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-dark-base overflow-hidden">
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="relative hidden lg:flex bg-dark-navy border-r border-white/5 flex-col z-30"
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          {!isCollapsed && (
            <Link to="/" className="text-xl font-display font-bold text-primary tracking-widest">KANT</Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/5 text-primary transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {renderNav()}
      </motion.aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] bg-dark-navy border-r border-white/5 flex flex-col transition-transform duration-300 lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <Link to="/" className="text-xl font-display font-bold text-primary tracking-widest">KANT</Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/5 text-primary transition-colors"
            aria-label="Close navigation"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        {renderNav()}
      </aside>

      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="min-h-20 bg-dark-navy/50 backdrop-blur-lg border-b border-white/5 flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-white/10 text-primary hover:bg-white/5 transition-colors"
              aria-label="Open navigation"
            >
              <LayoutDashboard size={18} />
            </button>
            <h1 className="text-lg sm:text-xl font-display font-semibold text-white truncate">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <NotificationBell />
            <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-primary font-medium">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
