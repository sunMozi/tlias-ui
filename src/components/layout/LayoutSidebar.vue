<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { menuList } from '@/config/menu'

const router = useRouter()
const route = useRoute()

const handleOpen = (key: string, keyPath: string[]) => {
  console.log('菜单展开:', key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log('菜单关闭:', key, keyPath)
}

const handleMenuClick = (index: string) => {
  router.push(index)
}
</script>

<template>
  <el-aside
    style="width: 15rem"
    class="border-r border-gray-300 bg-gradient-to-b from-white to-gray-50 shadow-sm overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
  >
    <el-menu
      class="h-full bg-transparent border-0 pt-3 text-sm"
      :default-active="route.path"
      @select="handleMenuClick"
      @open="handleOpen"
      @close="handleClose"
      router
      background-color="transparent"
      text-color="#4B5563"
      active-text-color="#3B82F6"
      unique-opened
    >
      <template v-for="item in menuList" :key="item.index">
        <el-sub-menu v-if="item.children" :index="item.index" class="group">
          <template #title>
            <el-icon
              class="text-gray-500 mr-2 text-lg group-hover:text-blue-500 transition-colors duration-300"
            >
              <component :is="item.icon" />
            </el-icon>
            <span
              class="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300 truncate"
              style="max-width: 8rem"
            >
              {{ item.title }}
            </span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.index"
            :index="child.index"
            class="flex items-center px-4 py-1.5 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300 rounded-md"
          >
            <el-icon class="text-gray-400 mr-2 text-base">
              <component :is="child.icon" />
            </el-icon>
            <span class="font-medium truncate" style="max-width: 7rem">
              {{ child.title }}
            </span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item
          v-else
          :index="item.index"
          class="flex items-center px-4 py-2 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300 rounded-md"
        >
          <el-icon class="text-gray-500 mr-2 text-lg">
            <component :is="item.icon" />
          </el-icon>
          <span class="font-semibold truncate" style="max-width: 9rem">
            {{ item.title }}
          </span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>
