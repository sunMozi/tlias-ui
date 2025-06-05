import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：添加 token 等
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理响应异常
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    if (data.code !== 1) {
      MessagePlugin.error(data.message || '请求失败', 800)
      return Promise.reject(data)
    }
    return data.data ?? data // 兼容后端格式
  },
  (error) => {
    MessagePlugin.error(error.response?.data?.message || '网络错误')
    return Promise.reject(error)
  },
)

export default service
