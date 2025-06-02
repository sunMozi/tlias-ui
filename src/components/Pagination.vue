<template>
  <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
    :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
    @size-change="$emit('size-change', pagination.pageSize)" @current-change="$emit('page-change', pagination.page)" />
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
