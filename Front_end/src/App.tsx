/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import AppRoutes from './routes';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { useScrollToTop } from './hooks/useScrollToTop';
import { useThemeStore } from './store/themeStore';
import { addNotification } from './store/slices/notificationSlice';

const GlobalLoading = () => {
  return null;
};

const AppContent = () => {
  useScrollToTop();
  const { isDarkMode, hydrated } = useThemeStore();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const types: ('booking' | 'reminder' | 'update' | 'message')[] = ['booking', 'reminder', 'update', 'message'];
      const titles = ['Cập nhật phòng', 'Cảnh báo tồn kho', 'Báo cáo hư hỏng', 'Tin nhắn mới', 'Thông báo bảo trì'];
      const descriptions = [
        'Phòng 204 đã được dọn dẹp và sẵn sàng nhận khách.',
        'Cảnh báo sắp hết hàng: đồ dùng vệ sinh còn dưới 20%.',
        'Đã ghi nhận hư hỏng mới tại phòng 305: đèn bàn bị hỏng.',
        'Khách ở phòng 102 đã yêu cầu thêm khăn tắm.',
        'Lịch bảo trì thang máy B sẽ bắt đầu sau 1 giờ nữa.',
      ];

      const randomIndex = Math.floor(Math.random() * titles.length);

      if (Math.random() > 0.8) {
        dispatch(
          addNotification({
            title: titles[randomIndex],
            description: descriptions[randomIndex],
            time: 'Vừa xong',
            type: types[Math.floor(Math.random() * types.length)],
          }),
        );
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [hydrated, isDarkMode]);

  if (!hydrated) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#C6A96B',
          colorLink: '#C6A96B',
          colorLinkHover: '#A6894B',
          colorLinkActive: '#A6894B',
          colorInfo: '#C6A96B',
          colorSuccess: '#10B981',
          colorWarning: '#F59E0B',
          colorError: '#EF4444',
          borderRadius: 16,
          colorBgContainer: isDarkMode ? '#111827' : '#FFFFFF',
          colorBgElevated: isDarkMode ? '#1F2937' : '#FFFFFF',
          colorBgLayout: isDarkMode ? '#0B0F19' : '#FDFCFB',
          colorText: isDarkMode ? '#F8FAFC' : '#0F172A',
          colorTextSecondary: isDarkMode ? '#94A3B8' : '#334155',
          colorBorder: isDarkMode ? '#1E2937' : '#E2E8F0',
          fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        },
        components: {
          Button: {
            borderRadius: 12,
            controlHeight: 44,
            fontWeight: 600,
          },
          Input: {
            borderRadius: 12,
            controlHeight: 44,
          },
          Select: {
            borderRadius: 12,
            controlHeight: 44,
          },
          Card: {
            borderRadius: 20,
          },
          Table: {
            borderRadius: 16,
          }
        }
      }}
    >
      <AntdApp>
        <GlobalLoading />
        <AppRoutes />
      </AntdApp>
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


