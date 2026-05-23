import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('ecosense_user') || 'null'),
  token: localStorage.getItem('ecosense_token') || null,
  isAuthenticated: !!localStorage.getItem('ecosense_token'),

  setAuth: (user, token) => {
    localStorage.setItem('ecosense_token', token);
    localStorage.setItem('ecosense_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('ecosense_token');
    localStorage.removeItem('ecosense_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
