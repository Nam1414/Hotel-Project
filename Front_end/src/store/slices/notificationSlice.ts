import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'booking' | 'reminder' | 'update' | 'message';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [
    {
      id: '1',
      title: 'New Booking',
      description: 'Room 101 has been booked by Alice Johnson.',
      time: '2 mins ago',
      isRead: false,
      type: 'booking',
    },
    {
      id: '2',
      title: 'Check-in Reminder',
      description: 'Guest Bob Smith is arriving in 30 minutes.',
      time: '15 mins ago',
      isRead: false,
      type: 'reminder',
    },
  ],
  unreadCount: 2,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'isRead'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        isRead: false,
      };
      state.notifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => (n.isRead = true));
      state.unreadCount = 0;
    },
    clearAll: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearAll } = notificationSlice.actions;
export default notificationSlice.reducer;
