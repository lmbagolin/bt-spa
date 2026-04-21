import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useLeagueStore = defineStore('league', {
  state: () => ({
    leagues: [],
    loading: false,
    currentLeague: null,
    stages: [],
    currentStage: null
  }),

  actions: {
    async fetchLeagues(arenaId) {
      this.loading = true
      try {
        const response = await api.get(`/arenas/${arenaId}/leagues`)
        this.leagues = response.data.data
      } catch (error) {
        console.error('Error fetching leagues:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchLeague(arenaId, id) {
      this.loading = true
      try {
        const response = await api.get(`/arenas/${arenaId}/leagues/${id}`)
        this.currentLeague = response.data.data
        this.stages = response.data.data.stages || []
      } catch (error) {
        console.error('Error fetching league:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async saveLeague(arenaId, data) {
      this.loading = true
      try {
        let response
        if (data.id) {
          response = await api.put(`/arenas/${arenaId}/leagues/${data.id}`, data)
          const index = this.leagues.findIndex(l => l.id === data.id)
          if (index !== -1) this.leagues[index] = response.data.data
        } else {
          response = await api.post(`/arenas/${arenaId}/leagues`, data)
          this.leagues.push(response.data.data)
        }
        return response.data.data
      } catch (error) {
        console.error('Error saving league:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteLeague(arenaId, id) {
      this.loading = true
      try {
        await api.delete(`/arenas/${arenaId}/leagues/${id}`)
        this.leagues = this.leagues.filter(l => l.id !== id)
      } catch (error) {
        console.error('Error deleting league:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStages(arenaId, leagueId) {
      this.loading = true
      try {
        const response = await api.get(`/arenas/${arenaId}/leagues/${leagueId}/stages`)
        this.stages = response.data.data
      } catch (error) {
        console.error('Error fetching stages:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async saveStage(arenaId, leagueId, data) {
      this.loading = true
      try {
        let response
        if (data.id) {
          response = await api.put(`/arenas/${arenaId}/leagues/${leagueId}/stages/${data.id}`, data)
          const index = this.stages.findIndex(s => s.id === data.id)
          if (index !== -1) this.stages[index] = response.data.data
        } else {
          response = await api.post(`/arenas/${arenaId}/leagues/${leagueId}/stages`, data)
          this.stages.push(response.data.data)
        }
        return response.data.data
      } catch (error) {
        console.error('Error saving stage:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteStage(arenaId, leagueId, stageId) {
      this.loading = true
      try {
        await api.delete(`/arenas/${arenaId}/leagues/${leagueId}/stages/${stageId}`)
        this.stages = this.stages.filter(s => s.id !== stageId)
      } catch (error) {
        console.error('Error deleting stage:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentLeague(league) {
      this.currentLeague = league
    },

    setCurrentStage(stage) {
      this.currentStage = stage
    }
  }
})
