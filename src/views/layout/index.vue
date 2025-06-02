<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import LayoutSidebar from '@/components/layout/LayoutSidebar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 获取当前路由实例
const route = useRoute()

const pageTitle = computed(() => {
  return (route.meta.title as string) || ''
})
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <Header />

    <el-container class="flex-1 overflow-hidden">
      <LayoutSidebar />
      <el-main class="p-4 bg-gray-50 overflow-auto">
        <div class="mb-6" v-show="pageTitle">
          <h1
            class="text-2xl font-semibold text-gray-800 border-l-4 border-blue-600 pl-4 drop-shadow-sm select-none"
          >
            {{ pageTitle }}
          </h1>
        </div>

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
