/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import { useScrollToTop } from './hooks/useScrollToTop';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';

const GlobalLoading = () => {
  // We can add a global loading state to Redux if needed, 
  // but for now let's keep it simple or use a local state for transitions.
  return null;
};

const AppContent = () => {
  useScrollToTop();
  return (
    <>
      <GlobalLoading />
      <AppRoutes />
    </>
  );
};

export default function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const lightTokens = {
    colorPrimary: '#A6894B',
    borderRadius: 12,
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#F9F6F1',
    colorText: '#111827',
    colorTextSecondary: '#4B5563',
    fontFamily: 'Inter, sans-serif',
  };

  const darkTokens = {
    colorPrimary: '#C6A96B',
    borderRadius: 12,
    colorBgContainer: '#111827',
    colorBgElevated: '#1F2937',
    colorText: '#FFFFFF',
    colorTextSecondary: '#9CA3AF',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: isDarkMode ? darkTokens : lightTokens,
        }}
      >
        <AntApp>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </Provider>
  );
}


