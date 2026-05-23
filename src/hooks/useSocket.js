import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:6000';

let socketInstance = null;

export function useSocket() {
  const { user, isAuthenticated } = useAuthStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const initialized = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user?._id || initialized.current) return;
    initialized.current = true;

    socketInstance = io(SOCKET_URL, { transports: ['websocket'], reconnection: true });

    socketInstance.on('connect', () => {
      socketInstance.emit('join', user._id || user.id);
    });

    socketInstance.on('newNotification', (data) => {
      addNotification(data);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        initialized.current = false;
      }
    };
  }, [isAuthenticated, user]);

  return socketInstance;
}
