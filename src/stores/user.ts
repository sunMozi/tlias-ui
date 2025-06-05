import { defineStore } from 'pinia'

export interface LoginResponse {
  id: number
  username: string
  name: string
  token: string
}

const STORAGE_KEY = 'user_info'

export const useUserStore = defineStore('user', {
  state: (): LoginResponse => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored) as LoginResponse
      } catch (err) {
        console.error(err)
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    return {
      id: 0,
      username: '',
      name: '',
      token: '',
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setUserInfo(payload: LoginResponse) {
      this.$patch(payload)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
    clearUserInfo() {
      this.$reset()
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
