<template>
  <div class="flex justify-center p-4">
    <el-pagination background class="rounded-xl shadow-sm px-6 py-2 border border-gray-200"
      :current-page="pagination.page" :page-size="pagination.pageSize" :page-sizes="[5, 10, 20, 50, 100]"
      :total="pagination.total" layout="total, prev, pager, next, jumper, sizes"
      @size-change="$emit('size-change', $event)" @current-change="$emit('page-change', $event)" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
}

defineProps<{
  pagination: PaginationInfo
}>()
</script>
