import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bed, 
  Warehouse, 
  ClipboardCheck, 
  Ticket, 
  FileText, 
  Menu, 
  X,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  User
} from 'lucide-react';
import { cn } from '../ui';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Bed, label: 'Room Management', path: '/rooms' },
  { icon: Warehouse, label: 'Inventory', path: '/inventory' },
  { icon: ClipboardCheck, label: 'Cleaning', path: '/cleaning' },
  { icon: Ticket, label: 'Booking & Voucher', path: '/bookings' },
  { icon: FileText, label: 'CMS', path: '/cms' },
];

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-border z-50 transition-transform duration-300 w-64 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bed className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">GrandView</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'text-text-muted hover:bg-gray-50 hover:text-text-main'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-main')} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-border sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-border rounded-lg px-3 py-1.5 w-64 lg:w-96">
          <Search className="w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search rooms, bookings, inventory..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-5 h-5 text-text-muted" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-border mx-1"></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text-main">Alex Johnson</p>
            <p className="text-xs text-text-muted">Hotel Manager</p>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-border overflow-hidden">
            <img src="https://picsum.photos/seed/manager/100/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};
