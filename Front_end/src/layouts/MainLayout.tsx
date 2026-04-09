import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useThemeStore } from '../store/themeStore';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthorizedHomePath } from '../utils/authNavigation';

import NotificationBell from '../components/notification/NotificationBell';
import Footer from '../components/common/Footer';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dashboardPath = getAuthorizedHomePath(user);
  const canOpenDashboard =
    isAuthenticated && (dashboardPath.startsWith('/admin') || dashboardPath.startsWith('/staff'));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark' : ''} bg-[var(--bg-main)] text-[var(--text-body)]`}>
      <header className="sticky top-0 z-50 bg-[var(--card-bg)]/80 backdrop-blur-lg border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4 h-20">
            <div className="flex items-center min-w-0">
              <Link to="/" className="text-xl sm:text-2xl font-display font-black text-primary tracking-[0.25em] sm:tracking-widest">
                KANT
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-12">
              <Link to="/" className="text-xs font-bold text-[var(--text-muted)] hover:text-primary tracking-[0.2em] transition-colors">HOME</Link>
              <Link to="/rooms" className="text-xs font-bold text-[var(--text-muted)] hover:text-primary tracking-[0.2em] transition-colors">ROOMS</Link>
              <Link to="/services" className="text-xs font-bold text-[var(--text-muted)] hover:text-primary tracking-[0.2em] transition-colors">SERVICES</Link>
              <Link to="/about" className="text-xs font-bold text-[var(--text-muted)] hover:text-primary tracking-[0.2em] transition-colors">ABOUT</Link>
              <Link to="/contact" className="text-xs font-bold text-[var(--text-muted)] hover:text-primary tracking-[0.2em] transition-colors">CONTACT</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-primary/5 transition-all shadow-sm"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-indigo-500" />}
              </button>

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
                      {canOpenDashboard && (
                        <Link to={dashboardPath} className="block px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-primary">Dashboard</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-50">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn-gold px-8 py-2 text-xs">LOGIN</Link>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-primary/5 transition-all shadow-sm"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-indigo-500" />}
              </button>
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
              className="md:hidden bg-white dark:bg-dark-base border-b border-gray-100 dark:border-white/5 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                <Link to="/" onClick={closeMobileMenu} className="block px-3 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary tracking-widest">HOME</Link>
                <Link to="/rooms" onClick={closeMobileMenu} className="block px-3 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary tracking-widest">ROOMS</Link>
                <Link to="/services" onClick={closeMobileMenu} className="block px-3 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary tracking-widest">SERVICES</Link>
                <Link to="/about" onClick={closeMobileMenu} className="block px-3 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary tracking-widest">ABOUT</Link>
                <Link to="/contact" onClick={closeMobileMenu} className="block px-3 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary tracking-widest">CONTACT</Link>
                {isAuthenticated && (
                  <>
                    {canOpenDashboard && (
                      <Link to={dashboardPath} onClick={closeMobileMenu} className="block px-3 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary tracking-widest">
                        DASHBOARD
                      </Link>
                    )}
                    <Link to="/profile" onClick={closeMobileMenu} className="block px-3 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary tracking-widest">
                      PROFILE
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-4 text-xs font-bold text-red-400 tracking-widest">
                      LOGOUT
                    </button>
                  </>
                )}
                {!isAuthenticated && (
                  <Link to="/login" onClick={closeMobileMenu} className="block px-3 py-4 text-xs font-bold text-primary tracking-widest">LOGIN</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow transition-colors duration-300">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
