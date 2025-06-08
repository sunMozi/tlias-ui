import request from '@/utils/request'

export const getEmpGenderData = async (): Promise<Report[]> => {
  return await request.get('/report/empGenderData')
}
export const getEmpJobData = async (): Promise<Report[]> => {
  return await request.get('/report/empJobData')
}
export const getStudentDegreeData = async (): Promise<Report[]> => {
  return await request.get('/report/studentDegreeData')
}
export const getStudentCountData = async (): Promise<Report[]> => {
  return await request.get('/report/studentCountData')
}
