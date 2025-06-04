import request from '@/utils/request'
import { Student } from '@/types/stu'

export interface StudentQueryParams {
  page: number
  pageSize: number
  name?: string
  room?: string
  beginDate?: string
  endDate?: string
  masterId?: number
}

export const getStuAll = ((params: StudentQueryParams): Promise: {
  rows: Student[]
  total: number
} ) => {
  return request.get('/stus')
}
