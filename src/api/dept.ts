import request from '@/utils/request'
import type { Dept } from '@/types/dept'

export function getDeptList(
  page: number,
  pageSize: number,
): Promise<{
  rows: Dept[]
  total: number
  code: number
  data: { total: number; rows: Dept[] }
  msg: string
}> {
  return request.get('/depts/list', {
    params: { page, pageSize },
  })
}

export function getDeptAll(): Promise<Dept[]> {
  return request.get('/depts')
}

export const createDept = (data: Dept) => {
  return request.post('/depts', data)
}

export const deleteDept = (id: number) => {
  return request.delete(`/depts`, {
    params: { id },
  })
}

export const batchDeleteDepts = (ids: string) => {
  return request.delete('/depts', {
    params: { ids },
  })
}

export const updateDept = (data: Dept) => {
  return request.put(`/depts`, data)
}
