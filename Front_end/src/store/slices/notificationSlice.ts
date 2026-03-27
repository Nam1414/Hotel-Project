import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
  connected: boolean;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  connected: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /** Nhận notification mới từ SignalR */
    pushNotification(state, action: PayloadAction<NotificationItem>) {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
    /** Load lịch sử notification từ API */
    setNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    markAsRead(state, action: PayloadAction<number>) {
      const n = state.items.find((i) => i.id === action.payload);
      if (n && !n.isRead) {
        n.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.items.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  pushNotification,
  setNotifications,
  markAsRead,
  markAllAsRead,
  setConnected,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotifications = (state: { notifications: NotificationState }) =>
  state.notifications.items;
export const selectUnreadCount = (state: { notifications: NotificationState }) =>
  state.notifications.unreadCount;
export const selectSignalRConnected = (state: { notifications: NotificationState }) =>
  state.notifications.connected;
