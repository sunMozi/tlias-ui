import request from '@/utils/request'
import type { Student } from '@/types/stu.ts'

export interface StudentQueryParams {
  page: number
  pageSize: number
  name?: string
  degree?: string | number
  clazzId?: string
}

export const selectStuAll = (
  params: StudentQueryParams,
): Promise<{
  rows: Student[]
  total: number
}> => {
  return request.get('/students', { params })
}

export const selectStuById = (id: number): Promise<any> => {
  return request.get(`/students/${id}`)
}

export const updateStu = (data: Student) => {
  return request.put('/students', data)
}

export const createStu = (data: Student) => {
  return request.post('/students', data)
}

export function delStuByIds(ids: number[]) {
  return request.delete(`/students/${ids.join(',')}`)
}

export const selectStuByClazzId = (clazzId: number) => {
  return request.get(`/students/clazz/${clazzId}`)
}

export const putViolation = (id: number, score: number) => {
  return request.put(`/students/violation/${id}/${score}`)
}
