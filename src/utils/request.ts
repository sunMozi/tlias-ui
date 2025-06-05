import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/stores/user'
import router from '@/router'
const isDev = import.meta.env.DEV
const baseURL = isDev ? '/api' : import.meta.env.VITE_API_BASE_URL

const service = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    if (userStore.token) {
      config.headers.token = `${userStore.token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    if (data.code === 401) {
      const userStore = useUserStore()
      userStore.clearUserInfo()
      MessagePlugin.warning('登录已过期，请重新登录')

      router.replace({ path: '/login' }) // 可根据你项目的路由实际调整
      return Promise.reject(data)
    }

    if (data.code !== 1) {
      MessagePlugin.error(data.message || '请求失败', 800)
      return Promise.reject(data)
    }

    return data.data ?? data
  },
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      const userStore = useUserStore()
      userStore.clearUserInfo()
      MessagePlugin.warning('登录状态无效，请重新登录')
      router.replace({ path: '/login' })
    } else {
      MessagePlugin.error(error.response?.data?.message || '网络错误')
    }

    return Promise.reject(error)
  },
)

export default service
