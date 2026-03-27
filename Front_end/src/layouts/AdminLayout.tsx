import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
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
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', roles: ['ADMIN', 'STAFF'] },
    { icon: Users, label: 'User Management', path: '/admin/users', roles: ['ADMIN'] },
    { icon: Bed, label: 'Room Management', path: '/admin/rooms', roles: ['ADMIN'] },
    { icon: CalendarCheck, label: 'Bookings', path: '/admin/bookings', roles: ['ADMIN', 'STAFF'] },
    { icon: Package, label: 'Inventory', path: '/admin/inventory', roles: ['ADMIN', 'STAFF'] },
    { icon: ShieldCheck, label: 'Roles & Permissions', path: '/admin/roles', roles: ['ADMIN'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-dark-base overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="relative bg-dark-navy border-r border-white/5 flex flex-col z-30"
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
      </motion.aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="h-20 bg-dark-navy/50 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-8 z-20">
          <h1 className="text-xl font-display font-semibold text-white">
            {filteredMenu.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-dark-navy"></span>
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
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

        <main className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
