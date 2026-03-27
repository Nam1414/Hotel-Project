import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { LogOut, User, Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import NotificationBell from '../components/notification/NotificationBell';
import Footer from '../components/common/Footer';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F1]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-display font-bold text-primary tracking-widest">
                KANT
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-12">
              <Link to="/" className="text-xs font-bold text-gray-400 hover:text-primary tracking-[0.2em] transition-colors">HOME</Link>
              <Link to="/rooms" className="text-xs font-bold text-gray-400 hover:text-primary tracking-[0.2em] transition-colors">ROOMS</Link>
              <Link to="/services" className="text-xs font-bold text-gray-400 hover:text-primary tracking-[0.2em] transition-colors">SERVICES</Link>
              <Link to="/about" className="text-xs font-bold text-gray-400 hover:text-primary tracking-[0.2em] transition-colors">ABOUT</Link>
              <Link to="/contact" className="text-xs font-bold text-gray-400 hover:text-primary tracking-[0.2em] transition-colors">CONTACT</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-6">
                  <NotificationBell />
                  <div className="relative group">
                    <button className="flex items-center space-x-3 p-1 rounded-full border border-primary/10 hover:border-primary/30 transition-all">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {user?.name?.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-gray-800 tracking-wider">{user?.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                      <Link to="/profile" className="block px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-primary">Profile</Link>
                      {(user?.role === 'ADMIN' || user?.role === 'STAFF') && (
                        <Link to="/admin" className="block px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-primary">Dashboard</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-50">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn-gold px-8 py-2 text-xs">LOGIN</Link>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                <Link to="/" className="block px-3 py-4 text-xs font-bold text-gray-500 hover:text-primary tracking-widest">HOME</Link>
                <Link to="/rooms" className="block px-3 py-4 text-xs font-bold text-gray-500 hover:text-primary tracking-widest">ROOMS</Link>
                <Link to="/services" className="block px-3 py-4 text-xs font-bold text-gray-500 hover:text-primary tracking-widest">SERVICES</Link>
                <Link to="/about" className="block px-3 py-4 text-xs font-bold text-gray-500 hover:text-primary tracking-widest">ABOUT</Link>
                <Link to="/contact" className="block px-3 py-4 text-xs font-bold text-gray-500 hover:text-primary tracking-widest">CONTACT</Link>
                {!isAuthenticated && (
                  <Link to="/login" className="block px-3 py-4 text-xs font-bold text-primary tracking-widest">LOGIN</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
