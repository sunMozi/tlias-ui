// src/api/employee.ts
import request from '@/utils/request'
import type { Employee } from '@/types/employee'

/** 列表查询所需字段 */
export interface EmployeeQueryParams {
  page: number
  pageSize: number
  name?: string
  gender?: string
  begin?: string
  end?: string
}

/** 列表接口：返回条数与员工数组 */
export function getDeptList(params: EmployeeQueryParams): Promise<{
  total: number
  rows: Employee[]
}> {
  return request.get('/emps', { params })
}

/** 根据 ID 获取员工详情，假设后端会返回完整的 Employee 对象 */
export function getEmployeeById(id: number): Promise<Employee> {
  return request.get(`/emps/${id}`)
}

/** 编辑员工 */
export function updateEmployee(data: Employee) {
  return request.put('/emps', data)
}

/** 创建新员工 */
export function createEmployee(data: Employee) {
  return request.post('/emps', data)
}

export function deleteEmployee(ids: number | number[]) {
  const idArray = Array.isArray(ids) ? ids : [ids]
  return request.delete('/emps', {
    params: { ids: idArray },
    paramsSerializer: (params) => params.ids.map((id: number) => `ids=${id}`).join('&'),
  })
}

export const getEmployeeList = (): Promise<Employee[]> => {
  return request.get('/emps/list')
}
