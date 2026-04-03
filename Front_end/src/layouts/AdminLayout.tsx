import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { markAsRead, markAllAsRead } from '../store/slices/notificationSlice';
import { useNotification } from '../hooks/useNotification';
import { Popover, Badge } from 'antd';
import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  CalendarCheck, 
  Package, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const AdminLayout: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    // { icon: CalendarCheck, label: 'Bookings', path: '/admin/bookings', permissions: ['MANAGE_BOOKINGS'] },
    { icon: Package, label: 'Inventory', path: '/admin/inventory', permissions: ['MANAGE_INVENTORY'] },
    { icon: ShieldCheck, label: 'Roles & Permissions', path: '/admin/roles', permissions: ['MANAGE_ROLES'] },
  ];

  const filteredMenu = menuItems.filter(item => {
    const hasPermission = item.permissions ? item.permissions.some(p => user?.permissions?.includes(p)) : true;
    return hasPermission;
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const notificationContent = (
    <div className="w-80 max-h-96 flex flex-col custom-scrollbar -m-3">
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">Chưa có thông báo nào</div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => dispatch(markAsRead(n.id))}
              className={`p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-semibold text-sm ${!n.isRead ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{n.time}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">{n.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderNav = () => (
    <>
      <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto">
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-primary text-dark-base shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-primary"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-dark-base" : "group-hover:text-primary")} />
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
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-dark-navy border-r border-white/5 flex flex-col transition-transform duration-300 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
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
            <h1 className="text-lg sm:text-xl font-display font-semibold text-white truncate">
            {filteredMenu.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Popover 
              content={notificationContent} 
              title={
                <div className="flex justify-between items-center py-2 px-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-semibold">Notifications</span>
                  <button 
                    onClick={() => dispatch(markAllAsRead())} 
                    className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Đánh dấu đã đọc
                  </button>
                </div>
              }
              trigger="click" 
              placement="bottomRight"
            >
              <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                <Badge count={unreadCount} size="small" color="#C6A96B" offset={[-2, 2]}>
                  <Bell size={20} />
                </Badge>
              </button>
            </Popover>
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
