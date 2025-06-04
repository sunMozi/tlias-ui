import request from '@/utils/request'
import type { Student } from '@/types/stu.ts'

export interface StudentQueryParams {
  page: number
  pageSize: number
  name?: string
  room?: string
  beginDate?: string
  endDate?: string
  masterId?: number
}

export const getStuAll = (
  params: StudentQueryParams,
): Promise<{
  rows: Student[]
  total: number
}> => {
  return request.get('/stus', { params })
}
