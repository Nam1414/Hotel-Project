import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Bed, 
  ClipboardList,
  Search, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import NotificationBell from '../components/notification/NotificationBell';

const StaffLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const isHousekeeping = user?.role === 'Housekeeping';

  const menuItems = isHousekeeping
    ? [{ icon: <ClipboardList size={20} />, label: 'Cleaning', path: '/staff/cleaning' }]
    : [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/staff' },
        { icon: <CalendarDays size={20} />, label: 'Bookings', path: '/staff/bookings' },
        { icon: <Bed size={20} />, label: 'Rooms', path: '/staff/rooms' },
      ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F9F6F1] flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <div className="p-8">
          <Link to="/" className="text-3xl font-display font-bold text-primary tracking-widest">KANT</Link>
          <p className="text-[10px] text-gray-400 tracking-[0.2em] mt-1 font-bold">STAFF PORTAL</p>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 w-full px-4">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white h-20 shadow-sm flex items-center justify-between px-8 z-40">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-500"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search guest or room..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 w-64 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <NotificationBell />
            
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
