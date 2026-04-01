import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Bed, 
  Search, 
  LogOut, 
  User,
  Menu,
  X,
  AlertTriangle,
  Package,
  Sun,
  Moon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useThemeStore } from '../store/themeStore';
import NotificationBell from '../components/notification/NotificationBell';

const StaffLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/staff' },
    { icon: <CalendarDays size={20} />, label: 'Bookings', path: '/staff/bookings' },
    { icon: <Bed size={20} />, label: 'Rooms', path: '/staff/rooms' },
    { icon: <AlertTriangle size={20} />, label: 'Damage Control', path: '/staff/damage' },
    { icon: <Package size={20} />, label: 'Inventory', path: '/staff/inventory' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center justify-between">
        <div>
          <Link to="/" className="text-3xl font-display font-bold text-primary tracking-widest">KANT</Link>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-[0.2em] mt-1 font-bold">STAFF PORTAL</p>
        </div>
        <button className="lg:hidden p-2 text-primary" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="mt-4 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span className="font-semibold">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-semibold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen flex overflow-hidden h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''} bg-[var(--bg-main)] text-[var(--text-body)]`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--card-bg)] border-r border-[var(--border-color)] shadow-xl z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-72 bg-[var(--card-bg)] z-[70] flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-[var(--card-bg)]/80 backdrop-blur-md h-20 border-b border-[var(--border-color)] flex items-center justify-between px-4 md:px-8 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-[var(--text-muted)]"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input 
                type="text" 
                placeholder="Search guest or room..." 
                className="pl-10 pr-4 py-2 bg-[var(--bg-main)] border-none rounded-xl focus:ring-2 focus:ring-primary/20 w-64 text-sm text-[var(--text-title)]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-primary transition-all shadow-sm"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-indigo-500" />}
            </button>
            <NotificationBell />
            
            <div className="flex items-center space-x-3 border-l pl-4 md:pl-6 border-slate-100 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
                {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
