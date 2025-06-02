import request from '@/utils/request'
import type { Employee } from '@/types/employee'

export function getDeptList(
  page: number,
  pageSize: number,
): Promise<{
  rows: Employee[]
  total: number
  code: number
  data: { total: number; rows: Employee[] }
  msg: string
}> {
  return request.get('/emps', {
    params: { page, pageSize },
  })
}
