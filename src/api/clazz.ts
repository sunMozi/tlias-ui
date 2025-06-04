import type { Clazz } from '@/types/clazz'
import request from '@/utils/request'

export const getClazzList = async ({
  page,
  pageSize,
  name,
  begin,
  end,
}: {
  page: number
  pageSize: number
  name?: string
  begin?: string
  end?: string
}): Promise<{
  rows: Clazz[]
  total: number
}> => {
  return await request.get('/clazzs', {
    params: { page, pageSize, name, begin, end },
  })
}

export const updateClazz = async (clazz: Clazz): Promise<Clazz> => {
  return await request.put(`/clazzs`, clazz)
}

export const createClazz = async (clazz: Clazz): Promise<Clazz> => {
  return await request.post(`/clazzs`, clazz)
}

export const deleteClazz = async (clazzId: number | string): Promise<void> => {
  return await request.delete(`/clazzs/${clazzId}`)
}

export const selectClazzAll = async (): Promise<Clazz[]> => {
  return await request.get(`/clazzs/list`)
}
