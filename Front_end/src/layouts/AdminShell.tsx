import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bed,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Layers3,
  LogOut,
  MapPinned,
  Package,
  ShieldCheck,
  TriangleAlert,
  UserCircle,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationBell from '../components/NotificationBellImproved';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { useNotification } from '../hooks/useNotification';
import { logoutThunk } from '../store/slices/authSlice';
import { cn } from '../utils/cn';

interface MenuItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  path: string;
  permissions?: string[];
  activePaths?: string[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', permissions: ['VIEW_DASHBOARD'] },
  { icon: UserCircle, label: 'Profile', path: '/admin/profile', activePaths: ['/admin/profile'] },
  {
    icon: CalendarCheck,
    label: 'Dat phong',
    path: '/admin/bookings',
    permissions: ['MANAGE_BOOKINGS'],
    activePaths: ['/admin/bookings'],
  },
  { icon: Users, label: 'Người dùng', path: '/admin/users', permissions: ['MANAGE_USERS'] },
  {
    icon: Bed,
    label: 'Phòng',
    path: '/admin/rooms',
    permissions: ['MANAGE_ROOMS'],
    activePaths: ['/admin/rooms'],
  },
  {
    icon: Layers3,
    label: 'Hạng phòng',
    path: '/admin/room-types',
    permissions: ['MANAGE_ROOMS'],
    activePaths: ['/admin/room-types'],
  },
  {
    icon: ClipboardList,
    label: 'Dọn phòng',
    path: '/admin/cleaning',
    permissions: ['MANAGE_ROOMS'],
    activePaths: ['/admin/cleaning'],
  },
  {
    icon: MapPinned,
    label: 'Diem tham quan',
    path: '/admin/attractions',
    permissions: ['MANAGE_CONTENT'],
    activePaths: ['/admin/attractions'],
  },
  {
    icon: Package,
    label: 'Vật tư',
    path: '/admin/inventory',
    permissions: ['MANAGE_INVENTORY'],
    activePaths: ['/admin/inventory'],
  },
  {
    icon: TriangleAlert,
    label: 'Hỏng / mất',
    path: '/admin/inventory/damages',
    permissions: ['MANAGE_INVENTORY'],
    activePaths: ['/admin/inventory/damages'],
  },
  { icon: ShieldCheck, label: 'Vai trò', path: '/admin/roles', permissions: ['MANAGE_ROLES'] },
];

const AdminShell: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { requestPermission } = useNotification();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const filteredMenu = useMemo(
    () =>
      menuItems.filter((item) =>
        item.permissions ? item.permissions.some((permission) => user?.permissions?.includes(permission)) : true
      ),
    [user?.permissions]
  );

  const currentLabel =
    filteredMenu.find((item) => {
      const activePaths = item.activePaths ?? [item.path];
      return activePaths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
    })?.label ?? 'Dashboard';

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-base">
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 88 : 292 }}
        className="relative z-30 flex flex-col border-r border-white/5 bg-dark-navy"
      >
        <div className="flex h-20 items-center justify-between border-b border-white/5 px-5">
          {!isCollapsed ? (
            <div>
              <Link to="/admin" className="text-xl font-display font-bold tracking-widest text-primary">
                KANT
              </Link>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-gray-500">Hotel Admin</p>
            </div>
          ) : (
            <Link to="/admin" className="text-xl font-display font-bold tracking-widest text-primary">
              K
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="rounded-lg p-2 text-primary transition-colors hover:bg-white/5"
            aria-label={isCollapsed ? 'Mở menu' : 'Thu gọn menu'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const activePaths = item.activePaths ?? [item.path];
            const isActive = activePaths.some(
              (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)
            );

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200',
                  isActive ? 'bg-primary text-dark-base shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-primary'
                )}
              >
                <Icon size={20} className={cn(isActive ? 'text-dark-base' : 'group-hover:text-primary')} />
                {!isCollapsed ? <span className="font-medium">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          {!isCollapsed ? (
            <div className="mb-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
              <p className="text-sm font-semibold text-white">{user?.fullName || user?.name || 'Tài khoản'}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">{user?.role || 'Unknown'}</p>
            </div>
          ) : null}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-all hover:bg-red-400/10"
          >
            <LogOut size={20} />
            {!isCollapsed ? <span className="font-medium">Đăng xuất</span> : null}
          </button>
        </div>
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-white/5 bg-dark-navy/60 px-6 backdrop-blur-lg md:px-8">
          <div>
            <h1 className="text-xl font-display font-semibold text-white">{currentLabel}</h1>
            <p className="mt-1 text-sm text-gray-400">Quản trị phòng, vật tư và vận hành khách sạn</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">{user?.fullName || user?.name}</p>
                <p className="text-xs font-medium text-primary">{user?.role}</p>
              </div>
              <Link
                to="/admin/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary transition-colors hover:bg-primary/25"
              >
                <UserCircle size={24} />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
