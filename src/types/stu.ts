export interface Student {
  id: number // ID
  name: string // 姓名
  no: string // 序号
  gender: 1 | 2 | number // 性别，1: 男，2: 女，保留 number 兼容其他可能值
  phone: string // 手机号
  idCard: string // 身份证号
  isCollege: 0 | 1 | number // 是否来自院校，1: 是，0: 否
  address: string // 联系地址
  degree: 1 | 2 | 3 | 4 | 5 | 6 | number // 最高学历（枚举）
  graduationDate: string // 毕业时间，使用 ISO 字符串格式
  clazzId: number // 班级ID
  violationCount: number // 违纪次数，Java Short 映射为 number
  violationScore: number // 违纪扣分，Java Short 映射为 number
  createTime: string // 创建时间，ISO 时间字符串
  updateTime: string // 修改时间，ISO 时间字符串
  clazzName: string // 班级名称
}
