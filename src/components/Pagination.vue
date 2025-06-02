<template>
  <el-pagination
    :current-page="pagination.page"
    :page-size="pagination.pageSize"
    :total="pagination.total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="$emit('size-change', $event)"
    @current-change="$emit('page-change', $event)"
  />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  pagination: {
    type: Object,
    required: true,
  },
})
</script>
