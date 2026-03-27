import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/notificationSlice';
import * as signalR from '@microsoft/signalr';
import { App } from 'antd';

export const useNotification = () => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    if (Notification.permission === 'granted') return true;

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const showPushNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body
      });
    }
  }, []);

  const notify = useCallback((notificationData: any) => {
    // Phù hợp với cấu trúc mới từ Backend
    // Support both camelCase and PascalCase payloads from backend
    const title = notificationData.title ?? notificationData.Title ?? 'Thông báo mới';
    const content = notificationData.content ?? notificationData.Content ?? notificationData.message ?? '';
    const rawType = notificationData.type ?? notificationData.Type ?? 'update';
    const type = (typeof rawType === 'string' ? rawType.toLowerCase() : 'update') as 'booking' | 'reminder' | 'update' | 'message';

    // Add to Redux store
    dispatch(addNotification({
      title,
      description: content,
      time: new Date(notificationData.createdAt || notificationData.CreatedAt || Date.now()).toLocaleTimeString(),
      type: type,
    }));

    notification[type === 'update' ? 'info' : type === 'reminder' ? 'warning' : 'success']({
      message: title,
      description: content,
      placement: 'topRight',
    });

    // Show browser push notification
    showPushNotification(title, content);
  }, [dispatch, showPushNotification]);

  // Khởi tạo SignalR kết nối thực tế
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5206';
    
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/notificationHub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (data) => {
      console.log('Received notification:', data);
      notify(data);
    });

    const startPromise = connection.start();
    
    startPromise
      .then(() => {
        if (!isMounted) return;
        console.log('SignalR Connected!');
      })
      .catch(err => {
        if (isMounted) console.error('SignalR Connection Error: ', err);
      });

    return () => {
      isMounted = false;
      // Đợi startPromise xong rồi mới stop() để tránh lỗi AbortError của SignalR
      startPromise.then(() => connection.stop()).catch(() => {});
    };
  }, [notify]);

  return { notify, requestPermission };
};
