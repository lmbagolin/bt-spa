import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useFriendStore = defineStore('friend', {
  state: () => ({
    friends:          [],
    requests:         [],
    sent:             [],
    loading:          false,
    loadingAction:    false,
  }),

  actions: {
    async fetchFriends() {
      this.loading = true;
      try {
        const r = await api.get('/friends');
        this.friends = r.data.data;
      } finally {
        this.loading = false;
      }
    },

    async fetchRequests() {
      const [req, sent] = await Promise.all([
        api.get('/friends/requests'),
        api.get('/friends/sent'),
      ]);
      this.requests = req.data.data;
      this.sent     = sent.data.data;
    },

    async sendRequest(email) {
      this.loadingAction = true;
      try {
        await api.post('/friends', { email });
        await this.fetchRequests();
      } finally {
        this.loadingAction = false;
      }
    },

    async acceptRequest(id) {
      this.loadingAction = true;
      try {
        await api.post(`/friends/${id}/accept`);
        await Promise.all([this.fetchFriends(), this.fetchRequests()]);
      } finally {
        this.loadingAction = false;
      }
    },

    async rejectRequest(id) {
      this.loadingAction = true;
      try {
        await api.post(`/friends/${id}/reject`);
        await this.fetchRequests();
      } finally {
        this.loadingAction = false;
      }
    },

    async removeFriend(id) {
      this.loadingAction = true;
      try {
        await api.delete(`/friends/${id}`);
        await this.fetchFriends();
      } finally {
        this.loadingAction = false;
      }
    },

    async cancelRequest(id) {
      this.loadingAction = true;
      try {
        await api.delete(`/friends/${id}`);
        await this.fetchRequests();
      } finally {
        this.loadingAction = false;
      }
    },

    async fetchByToken(token) {
      const r = await api.get(`/friends/token/${token}`);
      return r.data.data;
    },

    async acceptByToken(token) {
      await api.post(`/friends/token/${token}`);
    },
  },
});
