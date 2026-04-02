import * as signalR from '@microsoft/signalr';
import { store } from '../store';
import {
  pushNotification,
  setConnected,
} from '../store/slices/notificationSlice';
import { updateUserFromSignalR } from '../store/slices/userSlice';
import { refreshRolePermissionsFromSignalR } from '../store/slices/roleSlice';

const HUB_URL = 'http://localhost:5206/notificationHub';

let connection: signalR.HubConnection | null = null;

/**
 * Khởi động kết nối SignalR sau khi đăng nhập thành công.
 * Gọi lại khi token thay đổi (reconnect tự động).
 */
export const startSignalR = async () => {
  if (connection?.state === signalR.HubConnectionState.Connected) return;

  const token = store.getState().auth.accessToken;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      // Gửi JWT token theo query string (BE đọc từ context)
      accessTokenFactory: () => token ?? '',
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Retry: 0s, 2s, 10s, 30s
        const delays = [0, 2000, 10000, 30000];
        return delays[retryContext.previousRetryCount] ?? 30000;
      },
    })
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  // ── Event Handlers ────────────────────────────────────────────────────────

  /** Thông báo chung từ server */
  connection.on('ReceiveNotification', (message: string, type: string) => {
    store.dispatch(
      pushNotification({
        id: Date.now(), // tạm dùng timestamp; BE nên gửi id thực
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString(),
      })
    );
  });

  /** Cập nhật user realtime (ví dụ: bị khóa tài khoản) */
  connection.on('UserUpdated', (user: any) => {
    store.dispatch(updateUserFromSignalR(user));
  });

  /** Thay đổi permission của role */
  connection.on('PermissionUpdate', (message: string) => {
    store.dispatch(
      pushNotification({
        id: Date.now(),
        message,
        type: 'PermissionUpdate',
        isRead: false,
        createdAt: new Date().toISOString(),
      })
    );
  });

  // ── Connection State ──────────────────────────────────────────────────────

  connection.onreconnecting(() => {
    store.dispatch(setConnected(false));
    console.warn('[SignalR] Đang kết nối lại...');
  });

  connection.onreconnected(() => {
    store.dispatch(setConnected(true));
    console.info('[SignalR] Kết nối lại thành công');
  });

  connection.onclose(() => {
    store.dispatch(setConnected(false));
    console.warn('[SignalR] Kết nối đóng');
  });

  // ── Start ─────────────────────────────────────────────────────────────────
  try {
    await connection.start();
    store.dispatch(setConnected(true));
    console.info('[SignalR] Kết nối thành công');
  } catch (err) {
    store.dispatch(setConnected(false));
    console.error('[SignalR] Lỗi kết nối:', err);
  }
};

export const stopSignalR = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
    store.dispatch(setConnected(false));
  }
};

export const getConnection = () => connection;
