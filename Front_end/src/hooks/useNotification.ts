import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/slices/notificationSlice';

export const useNotification = () => {
  const dispatch = useDispatch();

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
        body,
        icon: '/favicon.ico', // Adjust path as needed
      });
    }
  }, []);

  const notify = useCallback((title: string, description: string, type: 'booking' | 'reminder' | 'update' | 'message' = 'update') => {
    // Add to Redux store
    dispatch(addNotification({
      title,
      description,
      time: 'Just now',
      type,
    }));

    // Show browser push notification
    showPushNotification(title, description);
  }, [dispatch, showPushNotification]);

  // Mock SignalR/Real-time listener
  useEffect(() => {
    // In a real app, you would initialize SignalR here
    // const connection = new signalR.HubConnectionBuilder().withUrl("/notificationHub").build();
    // connection.on("ReceiveNotification", (title, message) => notify(title, message));
    
    // Simulate a real-time notification after 10 seconds for demo
    const timer = setTimeout(() => {
      // notify('System Update', 'The server will undergo maintenance at 2:00 AM.', 'update');
    }, 10000);

    return () => clearTimeout(timer);
  }, [notify]);

  return { notify, requestPermission };
};
