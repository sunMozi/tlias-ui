import request from '@/utils/request'
import type { Clazz } from '@/types/clazz'

export const getClazzList = (): Promise<Clazz[]> => {
  return request.get('/clazzs/list')
}
