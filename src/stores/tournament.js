import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useTournamentStore = defineStore('tournament', {
  state: () => ({
    tournaments: [],
    loading: false
  }),

  actions: {
    async fetchTournaments(arenaId) {
      this.loading = true
      try {
        const response = await api.get(`/arenas/${arenaId}/tournaments`)
        this.tournaments = response.data.data
      } catch (error) {
        console.error('Error fetching tournaments:', error)
      } finally {
        this.loading = false
      }
    },

    async saveTournament(arenaId, data) {
      this.loading = true
      try {
        let response
        if (data.id) {
          response = await api.put(`/arenas/${arenaId}/tournaments/${data.id}`, data)
          const index = this.tournaments.findIndex(t => t.id === data.id)
          if (index !== -1) this.tournaments[index] = response.data.data
        } else {
          response = await api.post(`/arenas/${arenaId}/tournaments`, data)
          this.tournaments.push(response.data.data)
        }
        return response.data.data
      } finally {
        this.loading = false
      }
    },

    async deleteTournament(arenaId, tournamentId) {
      this.loading = true
      try {
        await api.delete(`/arenas/${arenaId}/tournaments/${tournamentId}`)
        this.tournaments = this.tournaments.filter(t => t.id !== tournamentId)
      } finally {
        this.loading = false
      }
    }
  }
})
