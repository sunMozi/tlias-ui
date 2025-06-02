// src/types/employee.ts

export interface Expr {
  id: number
  begin: string
  end: string
  company: string
  job: string
  empId: number
}

export interface Employee {
  /** 员工唯一标识 */
  id: number

  /** 登录用户名（详情接口会返回） */
  username?: string

  /** 登录密码（编辑时可修改，可选） */
  password?: string

  /** 手机号码 */
  phone?: string

  /** 工资 */
  salary?: number

  /** 员工姓名 */
  name: string

  /** 性别（1：男，2：女） */
  gender: 1 | 2

  /** 头像地址（可能为空） */
  image: string

  /** 所属部门 ID */
  deptId?: string | null

  /** 所属部门名称（列表接口提供） */
  deptName?: string | null

  /** 职位 ID（字符串，后续映射为中文） */
  job: string

  /** 入职日期（格式为 YYYY-MM-DD） */
  entryDate?: string

  /** 最后操作时间（格式为 YYYY-MM-DD HH:mm:ss） */
  updateTime?: string

  /** 实习/工作经历列表（详情接口返回） */
  exprList?: Expr[]
}
