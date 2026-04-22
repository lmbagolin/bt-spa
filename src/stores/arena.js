import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useArenaStore = defineStore('arena', {
  state: () => ({
    arenas: [],
    loading: false,
    currentArena: null,
    dashboard: {
      total_tournaments: 0,
      total_players: 0,
      active_tournaments: 0,
      recent_activities: [],
    },
    publicArenas: [],
    myRegistrations: [],
  }),

  actions: {
    async fetchArenas() {
      this.loading = true;
      try {
        const response = await api.get('/arenas');
        this.arenas = response.data.data;
      } catch (error) {
        console.error('Error fetching arenas:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async saveArena(data) {
      this.loading = true;
      try {
        let response;
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });

        if (data.id) {
          // Laravel PUT workaround for FormData/Files
          formData.append('_method', 'PUT');
          response = await api.post(`/arenas/${data.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const index = this.arenas.findIndex((a) => a.id === data.id);
          if (index !== -1) this.arenas[index] = response.data.data;
        } else {
          response = await api.post('/arenas', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          this.arenas.push(response.data.data);
        }
        return response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async deleteArena(id) {
      this.loading = true;
      try {
        await api.delete(`/arenas/${id}`);
        this.arenas = this.arenas.filter((a) => a.id !== id);
      } finally {
        this.loading = false;
      }
    },

    setCurrentArena(arena) {
      this.currentArena = arena;
    },

    async fetchArenaDashboard(arenaId) {
      try {
        const response = await api.get(`/arenas/${arenaId}/dashboard`);
        this.dashboard = response.data;
      } catch {
        // Fallback to empty if API fails (user might not have run backend yet)
        console.warn('Dashboard API failed. Ensure backend changes are applied.');
      }
    },

    async fetchPublicArenas(params = {}) {
      this.loading = true;
      try {
        const response = await api.get('/arenas/discover', { params });
        this.publicArenas = response.data.data;
      } catch (error) {
        console.error('Error fetching public arenas:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchMyRegistrations() {
      try {
        const response = await api.get('/my-registrations');
        this.myRegistrations = response.data.data;
      } catch (error) {
        console.error('Error fetching registrations:', error);
      }
    },

    async registerAsPlayer(arenaId, playerData = {}) {
      this.loading = true;
      try {
        const response = await api.post(`/arenas/${arenaId}/register`, playerData);
        // Refresh registrations
        await this.fetchMyRegistrations();
        return response.data;
      } catch (error) {
        console.error('Error registering as player:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
