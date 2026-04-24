/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes';
import { ConfigProvider, theme } from 'antd';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useThemeStore } from './store/themeStore';
import { useDispatch } from 'react-redux';
import { addNotification } from './store/slices/notificationSlice';

const GlobalLoading = () => {
  return null;
};

const AppContent = () => {
  useScrollToTop();
  const { isDarkMode } = useThemeStore();
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate realtime notifications
    const interval = setInterval(() => {
      const types: ('booking' | 'reminder' | 'update' | 'message')[] = ['booking', 'reminder', 'update', 'message'];
      const titles = [
        'Room Update',
        'Inventory Alert',
        'Damage Report',
        'New Message',
        'Maintenance Alert'
      ];
      const descriptions = [
        'Room 204 has been cleaned and is ready for check-in.',
        'Low stock alert: Toiletries are below 20%.',
        'New damage reported in Room 305: Broken lamp.',
        'Guest in Room 102 requested extra towels.',
        'Scheduled maintenance for elevator B in 1 hour.'
      ];

      const randomIndex = Math.floor(Math.random() * titles.length);
      
      // Only add notification 20% of the time to not overwhelm
      if (Math.random() > 0.8) {
        dispatch(addNotification({
          title: titles[randomIndex],
          description: descriptions[randomIndex],
          time: 'Just now',
          type: types[Math.floor(Math.random() * types.length)]
        }));
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#C6A96B',
          colorBgContainer: isDarkMode ? '#1E293B' : '#FFFFFF',
          colorBgElevated: isDarkMode ? '#334155' : '#FFFFFF',
          colorText: isDarkMode ? '#F1F5F9' : '#1E293B',
          colorTextSecondary: isDarkMode ? '#9CA3AF' : '#64748B',
        },
      }}
    >
      <GlobalLoading />
      <AppRoutes />
    </ConfigProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}


