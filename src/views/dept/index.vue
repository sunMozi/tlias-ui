<!-- DepartmentTable.vue -->
<template>
  <div class="p-4 bg-white rounded-xl shadow-sm">
    <el-table :data="tableData" border stripe class="w-full text-sm"
      header-cell-class-name="bg-gray-50 text-gray-700 font-medium">
      <!-- 序号 -->
      <el-table-column label="#" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 部门名称 -->
      <el-table-column prop="name" label="部门名称" min-width="120" />

      <!-- 最后修改时间 -->
      <el-table-column prop="updateTime" label="最后修改时间" min-width="180">
        <template #default="scope">
          <span class="text-gray-500">{{ formatDate(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <div class="flex justify-center space-x-2">
            <el-button type="primary" size="small" class="!px-3" @click="onEdit(scope.row)">
              修改
            </el-button>
            <el-button type="danger" size="small" class="!px-3" @click="onDelete(scope.row)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Department {
  id: number
  name: string
  createTime: string
  updateTime: string
}

const tableData = ref<Department[]>([
  {
    id: 1,
    name: '学工部',
    createTime: '2024-09-01T23:06:29',
    updateTime: '2024-09-01T23:06:29',
  },
  {
    id: 2,
    name: '教研部',
    createTime: '2024-09-01T23:06:29',
    updateTime: '2024-09-01T23:06:29',
  },
])

const formatDate = (value: string): string => {
  const date = new Date(value)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const onEdit = (row: Department) => {
  console.log('编辑：', row)
}

const onDelete = (row: Department) => {
  console.log('删除：', row)
}
</script>
