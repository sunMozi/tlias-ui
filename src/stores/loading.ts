import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: false,
  }),
  actions: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    },
  },
})
