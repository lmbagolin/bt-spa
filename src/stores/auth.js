import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { i18n } from 'boot/i18n';

const LOCALE_KEY = 'user_locale';
const VALID_LOCALES = ['pt_br', 'es'];

function applyUserLocale(user) {
  if (!user?.locale) return;
  const locale = VALID_LOCALES.includes(user.locale) ? user.locale : null;
  if (!locale) return;
  localStorage.setItem(LOCALE_KEY, locale);
  if (i18n) i18n.global.locale.value = locale;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    canManageArenas: (state) => ['arena_admin', 'admin', 'super'].includes(state.user?.role),
  },

  actions: {
    async login(credentials) {
      const response = await api.post('/login', credentials);
      this.token = response.data.access_token;
      this.user = response.data.user;
      localStorage.setItem('auth_token', this.token);
      applyUserLocale(this.user);
      return response.data;
    },

    async register(userData) {
      const response = await api.post('/register', userData);
      this.token = response.data.access_token;
      this.user = response.data.user;
      localStorage.setItem('auth_token', this.token);
      applyUserLocale(this.user);
      return response.data;
    },

    async logout() {
      try {
        await api.post('/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
      }
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await api.get('/user');
        this.user = response.data.data; // Laravel UserResource wraps data
        applyUserLocale(this.user);
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout();
        }
      }
    },

    async updateLocale(locale) {
      if (!VALID_LOCALES.includes(locale)) return;
      try {
        await api.patch('/user/locale', { locale });
        if (this.user) this.user.locale = locale;
      } catch {
        // falha silenciosa — localStorage já atualizado pelo composable
      }
    },

    async forgotPassword(email) {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    },

    async resetPassword(data) {
      const response = await api.post('/reset-password', data);
      return response.data;
    },
  },
});
