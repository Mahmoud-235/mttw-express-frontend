import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification) => {
    const current = get().notifications;
    set({
      notifications: [notification, ...current],
      unreadCount: get().unreadCount + 1,
    });
  },

  markRead: (id) => {
    const notifications = get().notifications.map((n) =>
      n._id === id ? { ...n, isRead: true } : n
    );
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length });
  },

  removeNotification: (id) => {
    const notifications = get().notifications.filter((n) => n._id !== id);
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length });
  },
}));

export default useNotificationStore;
