import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:6000';

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('🟢 Socket connected:', socket.id);
    if (userId) socket.emit('join', userId);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onNotification = (callback) => {
  if (!socket) return;
  socket.on('newNotification', callback);
  return () => socket.off('newNotification', callback);
};
