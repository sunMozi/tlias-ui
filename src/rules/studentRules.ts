import type { FormRules } from 'tdesign-vue-next'

const rules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 30, message: '姓名长度应为2-30个字符', trigger: 'blur' },
  ],
  no: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    {
      pattern: /^[A-Za-z0-9]{10}$/,
      message: '学号格式不正确，需为10位字母或数字',
      trigger: 'blur',
    },
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '手机号格式不正确',
    },
  ],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      pattern: /(^\d{15}$)|(^\d{17}([0-9Xx])$)/,
      message: '身份证号码格式不正确',
    },
  ],
  isCollege: [{ required: true, message: '请选择是否院校', trigger: 'change' }],
  address: [{ required: false }, { max: 100, message: '地址长度不能超过100字符', trigger: 'blur' }],
  degree: [{ required: true, message: '请选择学历', trigger: 'change' }],
  graduationDate: [{ required: true, message: '请选择毕业时间', trigger: 'change' }],
  clazzId: [{ required: true, message: '请选择班级', trigger: 'change' }],
}

export default rules
