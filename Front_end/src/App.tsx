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
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#C6A96B',
            borderRadius: 12,
            colorBgContainer: '#111827',
            colorBgElevated: '#1F2937',
            colorText: '#FFFFFF',
            colorTextSecondary: '#9CA3AF',
            fontFamily: 'Inter, sans-serif',
          },
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


