import request from '@/utils/request'

export const getEmpGenderData = async (): Promise<Report[]> => {
  return await request.get('/report/empGenderData')
}
