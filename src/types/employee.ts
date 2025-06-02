export interface Employee {
  /** 员工唯一标识 */
  id: number

  /** 员工姓名 */
  name: string

  /** 性别（1：男，2：女） */
  gender: 1 | 2

  /** 头像地址（可能为空） */
  image: string

  /** 所属部门名称（可能为 null） */
  deptName: string | null

  /** 职位 ID（字符串，后续需映射为中文） */
  job: string

  /** 入职日期（格式为 YYYY-MM-DD） */
  entryDate: string

  /** 最后操作时间（格式为 YYYY-MM-DD HH:mm:ss） */
  updateTime: string
}
