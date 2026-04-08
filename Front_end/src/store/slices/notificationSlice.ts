import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

export interface NotificationItem {
  id: string | number;
  title: string;
  description: string;
  message: string;
  time: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  connected: boolean;
}

const formatVietnamTime = (dateString: string): string => {
  try {
    const utcString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const localDate = new Date(utcString);
    return format(localDate, 'HH:mm:ss dd/MM/yyyy');
  } catch (error) {
    return new Date(dateString).toLocaleString('vi-VN');
  }
};

const normalizeNotification = (raw: any): NotificationItem => {
  const createdAt = raw.createdAt || raw.CreatedAt || new Date().toISOString();
  const title = raw.title || raw.Title || raw.type || raw.Type || 'Thông báo';
  const description = raw.description || raw.Description || raw.content || raw.Content || raw.message || '';

  return {
    id: raw.id || raw.Id || Date.now().toString(),
    title,
    description,
    message: raw.message || `${title}${description ? `: ${description}` : ''}`,
    time: formatVietnamTime(createdAt),
    isRead: Boolean(raw.isRead ?? raw.IsRead),
    type: raw.type || raw.Type || 'update',
    createdAt,
  };
};

const countUnread = (notifications: NotificationItem[]) =>
  notifications.filter((item) => !item.isRead).length;

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  connected: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Partial<NotificationItem>>) => {
      const newNotification = normalizeNotification({
        ...action.payload,
        id: action.payload.id ?? Date.now().toString(),
        isRead: false,
      });

      state.notifications.unshift(newNotification);
      state.unreadCount = countUnread(state.notifications);
    },
    pushNotification: (
      state,
      action: PayloadAction<{
        id?: string | number;
        message: string;
        type?: string;
        isRead?: boolean;
        createdAt?: string;
      }>
    ) => {
      const newNotification = normalizeNotification({
        ...action.payload,
        title: action.payload.type || 'Thông báo',
        description: action.payload.message,
      });

      state.notifications.unshift(newNotification);
      state.unreadCount = countUnread(state.notifications);
    },
    setNotifications: (state, action: PayloadAction<any[]>) => {
      state.notifications = action.payload.map(normalizeNotification);
      state.unreadCount = countUnread(state.notifications);
    },
    markAsRead: (state, action: PayloadAction<string | number>) => {
      const notification = state.notifications.find((n) => String(n.id) === String(action.payload));
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = countUnread(state.notifications);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    clearAll: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});

export const {
  addNotification,
  pushNotification,
  setNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
  setConnected,
} = notificationSlice.actions;

export const selectNotifications = (state: { notifications: NotificationState }) => state.notifications.notifications;
export const selectUnreadCount = (state: { notifications: NotificationState }) => state.notifications.unreadCount;
export const selectSignalRConnected = (state: { notifications: NotificationState }) => state.notifications.connected;

export default notificationSlice.reducer;
