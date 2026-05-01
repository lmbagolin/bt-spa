import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    players: [],
    currentPlayer: null,
    loading: false,
  }),

  actions: {
    async fetchPlayers(arenaId) {
      this.loading = true;
      try {
        const response = await api.get(`/arenas/${arenaId}/players`);
        this.players = response.data.data;
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      this.loading = true;
      try {
        const response = await api.get('/player/profile');
        this.currentPlayer = response.data.data;
        return this.currentPlayer;
      } catch (error) {
        console.error('Error fetching player profile:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(data) {
      this.loading = true;
      try {
        const response = await api.put('/player/profile', data);
        this.currentPlayer = response.data.data;
        return this.currentPlayer;
      } catch (error) {
        console.error('Error updating player profile:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateImage(file) {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/player/profile/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        this.currentPlayer = response.data.data;
        return this.currentPlayer;
      } catch (error) {
        console.error('Error updating player image:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async savePlayer(arenaId, data) {
      this.loading = true;
      try {
        let response;
        if (data.id) {
          response = await api.put(`/arenas/${arenaId}/players/${data.id}`, data);
          const index = this.players.findIndex((p) => p.id === data.id);
          if (index !== -1) {
            this.players[index] = response.data.data;
          }
        } else {
          response = await api.post(`/arenas/${arenaId}/players`, data);
          this.players.push(response.data.data);
        }
        return response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async savePlayersBatch(arenaId, players) {
      this.loading = true;
      try {
        const response = await api.post(`/arenas/${arenaId}/players/batch`, { players });
        await this.fetchPlayers(arenaId);
        return response.data;
      } finally {
        this.loading = false;
      }
    },

    async deletePlayer(arenaId, playerId) {
      this.loading = true;
      try {
        await api.delete(`/arenas/${arenaId}/players/${playerId}`);
        this.players = this.players.filter((p) => p.id !== playerId);
      } finally {
        this.loading = false;
      }
    },
  },
});
