import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useLeagueStore = defineStore('league', {
  state: () => ({
    leagues: [],
    loading: false,
    currentLeague: null,
    currentPublicLeague: null,
    stages: [],
    currentStage: null,
    stageRegistrations: [],
    loadingRegistrations: false,
    publicLeagues: [],
    loadingPublic: false,
    publicStageRegistrations: {},
    loadingPublicRegistrations: false,
  }),

  actions: {
    async fetchPublicLeagues(params = {}) {
      this.loadingPublic = true;
      try {
        const response = await api.get('/leagues/open', { params });
        this.publicLeagues = response.data.data;
      } catch (error) {
        console.error('Error fetching public leagues:', error);
        throw error;
      } finally {
        this.loadingPublic = false;
      }
    },

    async fetchPublicLeague(leagueId) {
      this.loadingPublic = true;
      try {
        const response = await api.get(`/leagues/${leagueId}`);
        this.currentPublicLeague = response.data.data;
      } catch (error) {
        console.error('Error fetching public league:', error);
        throw error;
      } finally {
        this.loadingPublic = false;
      }
    },

    async registerForStage(leagueId, stageId, data) {
      try {
        const response = await api.post(`/leagues/${leagueId}/stages/${stageId}/register`, data);
        return response.data;
      } catch (error) {
        console.error('Error registering for stage:', error);
        throw error;
      }
    },

    async fetchPublicStageRegistrations(leagueId, stageId) {
      this.loadingPublicRegistrations = true;
      try {
        const response = await api.get(`/leagues/${leagueId}/stages/${stageId}/registrations`);
        this.publicStageRegistrations = {
          ...this.publicStageRegistrations,
          [stageId]: response.data.data,
        };
      } catch (error) {
        console.error('Error fetching public stage registrations:', error);
      } finally {
        this.loadingPublicRegistrations = false;
      }
    },

    async fetchLeagues(arenaId) {
      this.loading = true;
      try {
        const response = await api.get(`/arenas/${arenaId}/leagues`);
        this.leagues = response.data.data;
      } catch (error) {
        console.error('Error fetching leagues:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLeague(arenaId, id) {
      this.loading = true;
      try {
        const response = await api.get(`/arenas/${arenaId}/leagues/${id}`);
        this.currentLeague = response.data.data;
        this.stages = response.data.data.stages || [];
      } catch (error) {
        console.error('Error fetching league:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async saveLeague(arenaId, data) {
      this.loading = true;
      try {
        let response;
        if (data.id) {
          response = await api.put(`/arenas/${arenaId}/leagues/${data.id}`, data);
          const index = this.leagues.findIndex((l) => l.id === data.id);
          if (index !== -1) this.leagues[index] = response.data.data;
        } else {
          response = await api.post(`/arenas/${arenaId}/leagues`, data);
          this.leagues.push(response.data.data);
        }
        return response.data.data;
      } catch (error) {
        console.error('Error saving league:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteLeague(arenaId, id) {
      this.loading = true;
      try {
        await api.delete(`/arenas/${arenaId}/leagues/${id}`);
        this.leagues = this.leagues.filter((l) => l.id !== id);
      } catch (error) {
        console.error('Error deleting league:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStages(arenaId, leagueId) {
      this.loading = true;
      try {
        const response = await api.get(`/arenas/${arenaId}/leagues/${leagueId}/stages`);
        this.stages = response.data.data;
      } catch (error) {
        console.error('Error fetching stages:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async saveStage(arenaId, leagueId, data) {
      this.loading = true;
      try {
        let response;
        if (data.id) {
          response = await api.put(
            `/arenas/${arenaId}/leagues/${leagueId}/stages/${data.id}`,
            data,
          );
          const index = this.stages.findIndex((s) => s.id === data.id);
          if (index !== -1) this.stages[index] = response.data.data;
        } else {
          response = await api.post(`/arenas/${arenaId}/leagues/${leagueId}/stages`, data);
          this.stages.push(response.data.data);
        }
        return response.data.data;
      } catch (error) {
        console.error('Error saving stage:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteStage(arenaId, leagueId, stageId) {
      this.loading = true;
      try {
        await api.delete(`/arenas/${arenaId}/leagues/${leagueId}/stages/${stageId}`);
        this.stages = this.stages.filter((s) => s.id !== stageId);
      } catch (error) {
        console.error('Error deleting stage:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStageRegistrations(arenaId, leagueId, stageId) {
      this.loadingRegistrations = true;
      try {
        const response = await api.get(
          `/arenas/${arenaId}/leagues/${leagueId}/stages/${stageId}/registrations`,
        );
        this.stageRegistrations = response.data.data;
      } catch (error) {
        console.error('Error fetching stage registrations:', error);
        throw error;
      } finally {
        this.loadingRegistrations = false;
      }
    },

    async saveStageRegistration(arenaId, leagueId, stageId, data) {
      this.loadingRegistrations = true;
      try {
        let response;
        if (data.id) {
          response = await api.put(
            `/arenas/${arenaId}/leagues/${leagueId}/stages/${stageId}/registrations/${data.id}`,
            data,
          );
          const index = this.stageRegistrations.findIndex((r) => r.id === data.id);
          if (index !== -1) this.stageRegistrations[index] = response.data.data;
        } else {
          response = await api.post(
            `/arenas/${arenaId}/leagues/${leagueId}/stages/${stageId}/registrations`,
            data,
          );
          this.stageRegistrations.push(response.data.data);
        }
        return response.data.data;
      } catch (error) {
        console.error('Error saving stage registration:', error);
        throw error;
      } finally {
        this.loadingRegistrations = false;
      }
    },

    async updateRegistrationStatus(arenaId, leagueId, stageId, registrationId, status) {
      try {
        const response = await api.patch(
          `/arenas/${arenaId}/leagues/${leagueId}/stages/${stageId}/registrations/${registrationId}/status`,
          { status },
        );
        const index = this.stageRegistrations.findIndex((r) => r.id === registrationId);
        if (index !== -1) this.stageRegistrations[index] = response.data.data;
        return response.data.data;
      } catch (error) {
        console.error('Error updating registration status:', error);
        throw error;
      }
    },

    async deleteStageRegistration(arenaId, leagueId, stageId, registrationId) {
      this.loadingRegistrations = true;
      try {
        await api.delete(
          `/arenas/${arenaId}/leagues/${leagueId}/stages/${stageId}/registrations/${registrationId}`,
        );
        this.stageRegistrations = this.stageRegistrations.filter((r) => r.id !== registrationId);
      } catch (error) {
        console.error('Error deleting stage registration:', error);
        throw error;
      } finally {
        this.loadingRegistrations = false;
      }
    },

    setCurrentLeague(league) {
      this.currentLeague = league;
    },

    setCurrentStage(stage) {
      this.currentStage = stage;
    },
  },
});
