<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import LayoutSidebar from '@/components/layout/LayoutSidebar.vue'
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <Header />

    <el-container class="flex-1 overflow-hidden">
      <LayoutSidebar />
      <el-main class="p-4 bg-gray-50 overflow-auto">
        <router-view v-slot="{ Component }">
          <div class="w-full h-full">
            <component :is="Component" />
          </div>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.el-container {
  display: flex;
  flex-direction: row;
  height: calc(100% - 4rem);
  /* 减去 header 高度 */
}

.el-main {
  flex-grow: 1;
  min-width: 0;
  background-color: #f9fafb;
}
</style>
