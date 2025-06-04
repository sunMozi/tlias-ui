<template>
  <el-dialog
    :model-value="visible"
    @close="onClose"
    :title="dialogTitle"
    width="800px"
    :destroy-on-close="true"
    class="rounded-lg shadow-lg border border-gray-200 bg-white"
  >
    <el-form
      ref="formRef"
      :model="localEmployee"
      :rules="rules"
      autocomplete="off"
      size="default"
      label-width="100px"
      label-position="left"
      class="p-4"
    >
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="el-icon-user mr-2 text-blue-500"></i>基本信息
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="localEmployee.username"
              placeholder="员工登录账号"
              clearable
              maxlength="20"
              show-word-limit
              class="form-input"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="localEmployee.name"
              placeholder="员工真实姓名"
              clearable
              maxlength="30"
              show-word-limit
              class="form-input"
            />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select
              v-model="localEmployee.gender"
              placeholder="请选择性别"
              clearable
              class="form-input"
            >
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="localEmployee.phone"
              placeholder="11位手机号码"
              clearable
              maxlength="11"
              show-word-limit
              class="form-input"
            />
          </el-form-item>

          <el-form-item label="职位" prop="job">
            <el-select
              v-model="localEmployee.job"
              placeholder="请选择职位"
              size="large"
              style="width: 240px"
            >
              <el-option
                v-for="item in jobList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="薪资" prop="salary">
            <el-input-number
              v-model="localEmployee.salary"
              :min="0"
              :precision="2"
              controls-position="right"
              :step="500"
              class="w-full form-input"
            >
              <template #prefix>
                <span class="text-gray-500 mr-1">¥</span>
              </template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="入职日期" prop="entryDate">
            <el-date-picker
              v-model="localEmployee.entryDate"
              type="date"
              placeholder="选择入职日期"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              clearable
              class="w-full form-input"
            />
          </el-form-item>

          <el-form-item label="所属部门" prop="department">
            <el-select
              v-model="localEmployee.deptId"
              placeholder="请选择部门"
              clearable
              class="form-input"
            >
              <el-option
                v-for="dept in deptList"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"
              />
            </el-select>
          </el-form-item>

          <el-upload
            action="http://localhost:8080/upload"
            :show-file-list="false"
            :limit="1"
            accept="image/png, image/jpeg"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
          >
            <template v-if="localEmployee.image">
              <div
                class="w-[96px] h-[96px] rounded-lg overflow-hidden border border-gray-200 shadow-sm"
              >
                <img :src="localEmployee.image" class="w-full h-full object-cover" alt="头像" />
              </div>
            </template>
            <el-button v-else size="small" type="primary" class="upload-btn">
              <i class="el-icon-upload mr-1"></i> 上传头像
            </el-button>
          </el-upload>
        </div>
      </div>

      <!-- 工作经历区域 -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="el-icon-office-building mr-2 text-blue-500"></i>工作经历
        </h3>

        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
          <div
            v-for="(exp, index) in localEmployee.exprList"
            :key="index"
            class="flex items-center gap-4 py-2 px-4 border border-gray-200 rounded-md bg-white"
          >
            <!-- 开始 - 结束 日期 -->
            <div class="flex items-center gap-2">
              <el-date-picker
                v-model="exp.begin"
                type="date"
                placeholder="开始"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                class="w-[120px] form-input-sm"
              />
              <span class="text-gray-400">至</span>
              <el-date-picker
                v-model="exp.end"
                type="date"
                placeholder="结束"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                class="w-[120px] form-input-sm"
              />
            </div>

            <!-- 公司 -->
            <div class="flex-1">
              <el-input v-model="exp.company" placeholder="公司名称" class="form-input-sm w-full" />
            </div>

            <!-- 职位 -->
            <div class="flex-1">
              <el-input v-model="exp.job" placeholder="职位名称" class="form-input-sm w-full" />
            </div>

            <!-- 删除按钮 -->
            <div>
              <el-button type="danger" size="small" plain circle @click="removeExperience(index)">
                <i class="el-icon-delete" />
              </el-button>
            </div>
          </div>

          <div
            v-if="!localEmployee.exprList || localEmployee.exprList.length === 0"
            class="text-gray-500 text-sm text-center py-4"
          >
            暂无工作经历，请添加
          </div>

          <div class="mt-4 flex justify-center">
            <el-button
              type="success"
              plain
              icon="el-icon-plus"
              size="small"
              class="add-exp-btn"
              @click="addExperience"
            >
              添加工作经历
            </el-button>
          </div>
        </div>
      </div>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer bg-gray-100 px-6 py-4 rounded-b-lg flex justify-end gap-4">
        <el-button @click="onClose" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="onSave" class="save-btn">
          <i class="el-icon-check mr-1"></i>保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, reactive, onMounted } from 'vue'
import type { Employee } from '@/types/employee'
import { ElMessage } from 'element-plus'
import { updateEmployee, createEmployee } from '@/api/employee'
import { getDeptAll } from '@/api/dept'
import type { Dept } from '@/types/dept'

const props = defineProps<{
  visible: boolean
  employee: Employee | null
}>()

const emit = defineEmits<{
  (e: 'save', employee: Employee): void
  (e: 'close'): void
}>()

const formRef = ref<InstanceType<(typeof import('element-plus'))['ElForm']> | null>(null)

const localEmployee = reactive<Employee>({
  id: 0,
  username: '',
  name: '',
  phone: '',
  gender: 1,
  job: '',
  salary: 0,
  image: '',
  entryDate: '',
  deptId: '',
  exprList: [],
})

const jobList = [
  { label: '班主任', value: 1 },
  { label: '教师', value: 2 },
  { label: '学工主管', value: 3 },
  { label: '教研主管', value: 4 },
  { label: '咨询师', value: 5 },
  { label: '其他', value: 6 },
]

const deptList = ref([] as Dept[])

const getDeptList = async () => {
  const res = await getDeptAll()
  deptList.value = res
}

onMounted(() => {
  getDeptList()
})

watch(
  () => props.employee,
  (newVal) => {
    if (newVal) {
      Object.assign(localEmployee, newVal)
      // 确保工作经历数组存在
      if (!localEmployee.exprList) {
        localEmployee.exprList = []
      }
    } else {
      // 清空表单数据以支持新增功能
      Object.assign(localEmployee, {
        id: 0,
        username: '',
        name: '',
        phone: '',
        gender: 1,
        job: '',
        salary: 0,
        image: '',
        entryDate: '',
        deptId: '',
        exprList: [],
      })
    }
  },
  { immediate: true, deep: true },
)

const dialogTitle = computed(() => (props.employee ? '编辑员工' : '新增员工'))

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入有效的手机号码',
      trigger: 'blur',
    },
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  job: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  salary: [
    { required: true, message: '请输入工资', trigger: 'blur' },
    {
      type: 'number',
      min: 0,
      message: '工资不能为负数',
      trigger: 'blur',
    },
  ],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
}

function onClose() {
  emit('close')
}

function onSave() {
  // 触发表单验证
  formRef.value?.validate((valid) => {
    if (valid) {
      if (localEmployee.id === 0) {
        // 新增员工逻辑
        createEmployee(localEmployee).then(() => {
          ElMessage.success('新增员工成功')
          emit('save', localEmployee)
          onClose()
        })
      } else {
        // 编辑员工逻辑
        updateEmployee(localEmployee).then(() => {
          ElMessage.success('员工信息保存成功')
          emit('save', localEmployee)
          onClose()
        })
      }
    }
  })
}

function handleExceed() {
  ElMessage.warning('最多只能上传1张头像')
}

function beforeUpload(file: File) {
  const isJPGorPNG =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGorPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPGorPNG && isLt2M
}

function handleUploadSuccess(response: { data: string }) {
  localEmployee.image = response.data
  ElMessage.success('头像上传成功')
}

function removeExperience(index: number) {
  if (localEmployee.exprList && localEmployee.exprList.length > index) {
    localEmployee.exprList.splice(index, 1)
  }
}

function addExperience() {
  if (!localEmployee.exprList) {
    localEmployee.exprList = []
  }
  localEmployee.exprList.push({
    begin: '',
    end: '',
    company: '',
    job: '',
    id: 0,
    empId: 0,
  })
}
</script>
