<template>
  <div class="p-6 bg-white rounded-2xl shadow-md border border-gray-100">

    <!-- table -->





    <!-- table -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { Employee } from '@/types/employee'; // Adjust the import path as necessary
import { getDeptList } from '@/api/employee'; // Adjust the import path as necessary


const empList = ref<Employee[]>([]); // Employee list
const loading = ref(false); // Loading state
const pagination = ref({ page: 1, pageSize: 10, total: 0 }); // Pagination state

const getEmpList = async () => {
  loading.value = true;
  getDeptList(1, 10).then((res) => {
    console.log(res);
    empList.value = res.rows;
    pagination.value.total = res.total;
  });
  loading.value = false;
};



onMounted(() => {
  getEmpList()
})

</script>
