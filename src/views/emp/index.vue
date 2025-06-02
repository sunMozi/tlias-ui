<template>
  <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
    <!-- 操作栏 -->
    <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      <!-- 筛选区 -->
      <div class="flex flex-wrap items-center gap-4">
        <!-- 姓名 -->
        <div class="flex items-center gap-2 whitespace-nowrap">
          <span class="text-gray-700 text-sm font-medium">姓名</span>
          <el-input v-model="filters.name" placeholder="请输入员工姓名" clearable class="w-48" size="default" />
        </div>

        <!-- 性别 -->
        <div class="flex items-center gap-2 whitespace-nowrap w-32">
          <span class="text-gray-700 text-sm font-medium">性别</span>
          <el-select v-model="filters.gender" placeholder="请选择" clearable class="w-32" size="default">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </div>

        <!-- 入职时间 -->
        <div class="flex items-center gap-2 whitespace-nowrap">
          <span class="text-gray-700 text-sm font-medium">入职时间</span>
          <el-date-picker v-model="filters.entryDateRange" type="daterange" start-placeholder="开始日期"
            end-placeholder="结束日期" range-separator="至" format="YYYY-MM-DD" value-format="YYYY-MM-DD" unlink-panels
            clearable class="w-72" size="default" />
        </div>

        <!-- 查询 / 清空 -->
        <div class="ml-auto flex items-center gap-2">
          <el-button type="primary" icon="Search" @click="handleSearch"> 查询 </el-button>
          <el-button icon="Refresh" @click="handleReset"> 清空 </el-button>
        </div>
      </div>

      <!-- 操作按钮区 -->
      <div class="mt-4 flex gap-3">
        <el-button type="primary" icon="Plus" @click="handleAddEmployee"> 添加员工 </el-button>
        <el-button type="danger" icon="Delete" :disabled="!selectedRows.length" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>
    </div>

    <!-- 员工表格 -->
    <el-table :data="empList" v-loading="loading" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性别" :formatter="formatGender" />
      <el-table-column label="头像">
        <template #default="{ row }">
          <div class="w-[100px] h-[50px] mx-a overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <el-image :src="row.image" fit="cover" class="w-full h-full object-cover" />
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="deptName" label="所属部门" />
      <el-table-column prop="job" label="职位" :formatter="formatDept" />
      <el-table-column prop="entryDate" label="入职日期" />
      <el-table-column prop="updateTime" min-width="100" label="最后操作时间" />
      <el-table-column label="操作" min-width="100" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="flex justify-center mt-6">
      <Pagination :pagination="pagination" @page-change="handlePageChange" @size-change="handleSizeChange" />
    </div>
  </div>

  <EmployeeEditDialog :visible="editDialogVisible" :employee="employee" @close="editDialogVisible = false"
    @save="handleSaveEmployee" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import type { Employee } from '@/types/employee'
import { getDeptList, getEmployeeById, deleteEmployee } from '@/api/employee'
import Pagination from '@/components/Pagination.vue'
import EmployeeEditDialog from '@/components/EmployeeEditDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

/** 员工列表数据 */
const empList = ref<Employee[]>([])

/** 加载状态 */
const loading = ref(false)

/** 分页信息 */
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

/** 当前要编辑的员工详情，可以为 null */
const employee = ref<Employee | null>(null)

/** 编辑弹窗显示/隐藏 */
const editDialogVisible = ref(false)

/** 筛选条件 */
const filters = reactive({
  name: '',
  gender: '',
  entryDateRange: [] as string[],
})

/** 表格多选行 */
const selectedRows = ref<Employee[]>([])


const genderMap: Record<number, string> = {
  1: '男',
  2: '女',
}
/** 格式化性别 */
const formatGender = (row: Employee): string => {
  return genderMap[row.gender] || '未知'
}

/** 将后端返回的职位 ID 映射为中文 */
const formatDept = (emp: Employee): string => {
  const jobMap: Record<string, string> = {
    '1': '班主任',
    '2': '讲师',
    '3': '学工主管',
    '4': '教研主管',
    '5': '咨询师',
    '6': '未知',
  }
  return jobMap[emp.job] || '未知职位'
}

const getEmpList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      name: filters.name,
      gender: filters.gender,
      begin: filters.entryDateRange[0] || '',
      end: filters.entryDateRange[1] || '',
    }
    const res = await getDeptList(params)
    empList.value = res.rows
    pagination.total = res.total
  } catch (error) {
    console.error('获取员工列表失败:', error)
  } finally {
    loading.value = false
  }
}

/** 查询按钮 */
const handleSearch = () => {
  pagination.page = 1
  getEmpList()
}

/** 清空筛选条件 */
const handleReset = () => {
  filters.name = ''
  filters.gender = ''
  filters.entryDateRange = []
  pagination.page = 1
  getEmpList()
}

/** 表格多选时触发 */
const handleSelectionChange = (rows: Employee[]) => {
  selectedRows.value = rows
}

/** 新增员工（这里只做演示，具体弹窗逻辑自行实现） */
const handleAddEmployee = () => {
  employee.value = null
  editDialogVisible.value = true
  getEmpList() // 新增员工后刷新列表
}

/** 编辑某行员工 */
const handleEdit = async (row: Employee) => {
  const res = await getEmployeeById(row.id)
  employee.value = res
  editDialogVisible.value = true
}
/** 保存员工（新增/编辑） */
const handleSaveEmployee = async () => {
  if (!employee.value) return
  // TODO: 调用保存或更新接口，例如：
  // if (employee.value.id) { updateEmployee(employee.value) }
  // else { createEmployee(employee.value) }
  // 保存完成后：
  editDialogVisible.value = false
  getEmpList() // 保存员工后刷新列表
}


/** 删除单个员工 */
const handleDelete = async (row: Employee) => {
  try {
    await ElMessageBox.confirm(
      `确认删除员工【${row.name}】吗？`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await deleteEmployee([row.id])
    ElMessage.success('删除成功')
    getEmpList()
  } catch (error) {
    // 用户取消时不做处理
    console.error('删除员工失败:', error)
  }
}

/** 批量删除 */
const handleBatchDelete = async () => {
  if (!selectedRows.value.length) return

  try {
    await ElMessageBox.confirm(
      `确认批量删除这 ${selectedRows.value.length} 名员工吗？`,
      '批量删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const ids = selectedRows.value.map((i) => i.id)
    await deleteEmployee(ids)
    ElMessage.success('批量删除成功')
    getEmpList()
  } catch (error) {
    // 用户取消时不做处理
    console.error('批量删除员工失败:', error)
  }
}


/** 页码变化 */
const handlePageChange = (page: number) => {
  pagination.page = page
  getEmpList()
}

/** 每页条数变化 */
const handleSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  getEmpList()
}

onMounted(() => {
  getEmpList()
})
</script>
