<template>
  <div class="p-4 bg-white rounded-xl shadow-sm">
    <!-- 新增部门按钮 -->
    <div class="mb-4 flex justify-between">
      <el-button type="danger" size="small" @click="handleBatchDelete" :disabled="selectedIds.length === 0">
        批量删除
      </el-button>
      <el-button type="success" size="small" @click="handleAdd">新增部门</el-button>
    </div>

    <el-table :data="empList" border stripe class="w-full text-sm"
      header-cell-class-name="bg-gray-50 text-gray-700 font-medium" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <!-- 序号 -->
      <el-table-column label="id" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 部门名称 -->
      <el-table-column prop="name" label="部门名称" min-width="120" />

      <!-- 创建时间 -->
      <el-table-column prop="createTime" label="创建时间" min-width="180">
        <template #default="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>

      <!-- 最后修改时间 -->
      <el-table-column prop="updateTime" label="最后修改时间" min-width="180">
        <template #default="scope">
          {{ formatDate(scope.row.updateTime) }}
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :pagination="pagination" @page-change="handlePageChange" @size-change="handleSizeChange" />
  </div>

  <!-- 新增部门弹窗 -->
  <el-dialog v-model="addDialogVisible" title="新增部门" width="400px">
    <el-form :model="addForm" ref="addFormRef" label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入部门名称" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="success" @click="submitAddForm">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 编辑部门弹窗 -->
  <el-dialog v-model="editDialogVisible" title="编辑部门" width="400px">
    <el-form :model="editForm" ref="editFormRef" label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入部门名称" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getDeptList, createDept, deleteDept, batchDeleteDepts, updateDept } from '@/api/dept'
import type { Dept } from '@/types/dept'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

const empList = ref<Dept[]>([])

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
})

const getEmpList = async () => {
  try {
    const res = await getDeptList(pagination.value.page, pagination.value.pageSize)

    empList.value = res.rows
    pagination.value.total = res.total
  } catch (error) {
    console.error('获取部门列表失败', error)
  }
}

const formatDate = (val?: string) => {
  if (!val) return ''
  const date = new Date(val)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const addDialogVisible = ref(false)
const addForm = ref({ name: '' })
const addFormRef = ref()

const handleAdd = () => {
  addDialogVisible.value = true
}

const submitAddForm = async () => {
  try {
    await addFormRef.value?.validate()

    // 调用新增部门接口
    await createDept({ ...addForm.value, id: 0, createTime: '', updateTime: '' })

    // 重置表单
    addForm.value.name = ''
    addDialogVisible.value = false

    ElMessage.success('新增部门成功')
    getEmpList()
  } catch (error) {
    console.error('新增部门失败', error)
  }
}

const editDialogVisible = ref(false)
const editForm = ref<Dept>({ id: 0, name: '', createTime: '', updateTime: '' })
const editFormRef = ref()

const handleEdit = (row: Dept) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

const submitEditForm = async () => {
  try {
    await editFormRef.value?.validate()

    // 调用更新部门接口
    await updateDept(editForm.value)

    editDialogVisible.value = false
    ElMessage.success('编辑部门成功')
    getEmpList()
  } catch (error) {
    console.error('编辑部门失败', error)
  }
}

const handleDelete = (row: Dept) => {

  ElMessageBox.confirm(
    `确定要删除部门 "${row.name}" 吗？此操作不可撤销。`,
    '删除部门确认',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      customClass: 'delete-confirm-box',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          deleteDept(row.id)
            .then(() => {
              done()
              ElMessage.success('删除部门成功')
              getEmpList()
            })
            .catch((error) => {
              console.error('删除部门失败', error)
              instance.confirmButtonLoading = false
            })
        } else {
          done()
        }
      }
    }
  ).catch(() => {
    // 捕获取消操作
    ElMessage.info('已取消删除操作')
  })
}

const selectedIds = ref<number[]>([])

const handleSelectionChange = (selection: Dept[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) return
  console.log('批量删除部门 IDs:', selectedIds.value)
  const ids = selectedIds.value.join(',')

  batchDeleteDepts(ids)
    .then(() => {
      ElMessage.success('批量删除成功')
      selectedIds.value = []
      getEmpList()
    })
    .catch((error) => {
      console.error('批量删除失败', error)
    })
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  getEmpList()
}

const handleSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  getEmpList()
}

onMounted(() => {
  getEmpList()
})
</script>
