<template>
  <div class="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
    <!-- 操作栏 -->
    <div class="flex justify-between items-center mb-4">
      <div class="space-x-2">
        <el-button type="danger" size="small" @click="handleBatchDelete" :disabled="!selectedIds.length">
          批量删除
        </el-button>
        <el-button type="success" size="small" @click="handleAdd"> 新增部门 </el-button>
      </div>
    </div>

    <!-- 部门表格 -->
    <el-table v-loading="loading" :data="empList" border stripe class="w-full text-sm"
      header-cell-class-name="bg-gray-100 text-gray-800 text-sm font-medium" :empty-text="'暂无部门数据'"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="60">
        <template #default="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="部门名称" min-width="120" />
      <el-table-column prop="createTime" label="创建时间" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="最后修改时间" min-width="180">
        <template #default="{ row }">
          {{ formatDate(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" align="center">
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

  <!-- 新增弹窗 -->
  <el-dialog v-model="addDialogVisible" title="新增部门" width="400px" class="rounded-lg">
    <el-form :model="addForm" ref="addFormRef" label-width="80px" class="px-2">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入部门名称" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end space-x-2 px-4 py-2">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="success" @click="submitAddForm">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 编辑弹窗 -->
  <el-dialog v-model="editDialogVisible" title="编辑部门" width="400px" class="rounded-lg">
    <el-form :model="editForm" ref="editFormRef" label-width="80px" class="px-2">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入部门名称" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="flex justify-end space-x-2 px-4 py-2">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDeptList, createDept, deleteDept, batchDeleteDepts, updateDept } from '@/api/dept'
import type { Dept } from '@/types/dept'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination.vue'

const empList = ref<Dept[]>([])
const loading = ref(false)

const pagination = ref({ page: 1, pageSize: 10, total: 0 })
const selectedIds = ref<number[]>([])
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)

const addForm = ref({ name: '' })
const editForm = ref<Dept>({ id: 0, name: '', createTime: '', updateTime: '' })
const addFormRef = ref()
const editFormRef = ref()

const getDepts = async () => {
  loading.value = true
  try {
    const res = await getDeptList(pagination.value.page, pagination.value.pageSize)
    empList.value = res.rows
    pagination.value.total = res.total
  } catch (error) {
    console.error('获取部门列表失败', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (val?: string) => {
  if (!val) return ''
  return new Date(val).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const handleAdd = () => {
  addDialogVisible.value = true
  addForm.value.name = ''
}

const submitAddForm = async () => {
  try {
    await addFormRef.value?.validate()
    await createDept({ ...addForm.value, id: 0, createTime: '', updateTime: '' })
    ElMessage.success('新增部门成功')
    addDialogVisible.value = false
    getDepts()
  } catch (error) {
    console.error('新增部门失败', error)
  }
}

const handleEdit = (row: Dept) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

const submitEditForm = async () => {
  try {
    await editFormRef.value?.validate()
    await updateDept(editForm.value)
    ElMessage.success('编辑部门成功')
    editDialogVisible.value = false
    getDepts()
  } catch (error) {
    console.error('编辑部门失败', error)
  }
}

const handleDelete = (row: Dept) => {
  ElMessageBox.confirm(`确定要删除部门 "${row.name}" 吗？此操作不可撤销。`, '删除部门确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
    center: true,
  })
    .then(async () => {
      await deleteDept(row.id)
      ElMessage.success('删除部门成功')
      getDepts()
    })
}

const handleSelectionChange = (selection: Dept[]) => {
  selectedIds.value = selection.map((item) => item.id)
}

const handleBatchDelete = () => {
  if (!selectedIds.value.length) return
  batchDeleteDepts(selectedIds.value.join(','))
    .then(() => {
      ElMessage.success('批量删除成功')
      selectedIds.value = []
      getDepts()
    })
    .catch((error) => {
      console.error('批量删除失败', error)
    })
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  getDepts()
}

const handleSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  getDepts()
}

onMounted(getDepts)
</script>
