import request from '@/utils/request'
import type { LoginResponse } from '@/stores/user'

interface LoginParams {
  username: string
  password: string
}

export const login = (data: LoginParams): Promise<LoginResponse> => {
  return request.post('/login', data)
}
