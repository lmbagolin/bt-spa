import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      const response = await api.post('/login', credentials)
      this.token = response.data.access_token
      this.user = response.data.user
      localStorage.setItem('auth_token', this.token)
      return response.data
    },

    async register(userData) {
      const response = await api.post('/register', userData)
      this.token = response.data.access_token
      this.user = response.data.user
      localStorage.setItem('auth_token', this.token)
      return response.data
    },

    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('auth_token')
      }
    },

    async fetchUser() {
      if (!this.token) return
      try {
        const response = await api.get('/user')
        this.user = response.data.data // Laravel UserResource wraps data
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout()
        }
      }
    },
    async forgotPassword(email) {
      const response = await api.post('/forgot-password', { email })
      return response.data
    },

    async resetPassword(data) {
      const response = await api.post('/reset-password', data)
      return response.data
    },
  },
})
