import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useThemeStore } from '../store/themeStore';
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
  UserCircle,
  AlertTriangle,
  Brush,
  FileText,
  Ticket,
  Menu as MenuIcon,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import NotificationBell from '../components/notification/NotificationBell';

const AdminLayout: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', roles: ['ADMIN', 'STAFF'] },
    { icon: Users, label: 'User Management', path: '/admin/users', roles: ['ADMIN'] },
    { icon: Bed, label: 'Room Management', path: '/admin/rooms', roles: ['ADMIN'] },
    { icon: CalendarCheck, label: 'Bookings', path: '/admin/bookings', roles: ['ADMIN', 'STAFF'] },
    { icon: Ticket, label: 'Vouchers', path: '/admin/vouchers', roles: ['ADMIN'] },
    { icon: Package, label: 'Inventory', path: '/admin/inventory', roles: ['ADMIN', 'STAFF'] },
    { icon: AlertTriangle, label: 'Damage Control', path: '/admin/damage', roles: ['ADMIN', 'STAFF'] },
    { icon: Brush, label: 'Cleaning', path: '/admin/cleaning', roles: ['ADMIN', 'STAFF'] },
    { icon: FileText, label: 'CMS', path: '/admin/cms', roles: ['ADMIN'] },
    { icon: ShieldCheck, label: 'Roles & Permissions', path: '/admin/roles', roles: ['ADMIN'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-white/5">
        <Link to="/" className="text-2xl font-display font-bold text-primary tracking-widest">KANT</Link>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-primary transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-primary transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-grow py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-white" : "group-hover:text-primary")} />
              {(!isCollapsed || isMobileMenuOpen) && <span className="text-sm font-bold tracking-wide">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold tracking-wide"
        >
          <LogOut size={20} />
          {(!isCollapsed || isMobileMenuOpen) && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark' : ''} bg-[var(--bg-main)] text-[var(--text-body)]`}>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden lg:flex relative bg-[var(--card-bg)] border-r border-[var(--border-color)] flex-col z-30"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[var(--card-bg)] z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="h-20 bg-[var(--card-bg)]/80 backdrop-blur-lg border-b border-[var(--border-color)] flex items-center justify-between px-4 md:px-8 z-20">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/5 text-primary"
            >
              <MenuIcon size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-display font-semibold text-[var(--text-title)] truncate max-w-[200px] md:max-w-none">
              {filteredMenu.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-primary transition-all shadow-sm"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-indigo-500" />}
            </button>
            <NotificationBell />
            <div className="flex items-center space-x-3 pl-2 md:pl-6 border-l border-slate-100 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{user?.role}</p>
              </div>
              <Link to="/profile" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/30 overflow-hidden">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <UserCircle size={24} />}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
