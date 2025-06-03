<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { menuList } from '@/config/menu'
import { Fold, Expand } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleMenuClick = (index: string) => {
  router.push(index)
}
</script>

<template>
  <el-aside :style="{ width: isCollapse ? '64px' : '240px' }" class="transition-all duration-300 ease-in-out border-r border-gray-200 bg-white shadow-sm
           overflow-y-auto overflow-x-hidden min-w-0 custom-scrollbar">
    <!-- 顶部区域：标题与收起按钮 -->
    <div class="flex items-center justify-between h-14 px-3 border-b border-gray-100 bg-white">
      <transition name="fade">
        <div v-if="!isCollapse" class="text-gray-700 text-sm font-semibold tracking-wide">
          功能导航
        </div>
      </transition>
      <el-button circle size="small" @click="toggleCollapse" :icon="isCollapse ? Expand : Fold" class="ml-auto" />
    </div>

    <!-- 菜单区域 -->
    <el-menu class="h-full border-0 bg-transparent text-sm min-w-0" :default-active="route.path" :collapse="isCollapse"
      :collapse-transition="true" @select="handleMenuClick" router background-color="transparent" text-color="#4B5563"
      active-text-color="#2563eb" unique-opened>
      <template v-for="item in menuList" :key="item.index">
        <!-- 有子菜单 -->
        <el-sub-menu v-if="item.children" :index="item.index">
          <template #title>
            <el-icon class="text-base">
              <component :is="item.icon" />
            </el-icon>
            <span class="ml-1">{{ item.title }}</span>
          </template>

          <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index"
            class="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis">
            <el-icon class="text-sm text-gray-400 mr-1">
              <component :is="child.icon" />
            </el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 无子菜单 -->
        <el-menu-item v-else :index="item.index"
          class="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis">
          <el-icon class="text-base">
            <component :is="item.icon" />
          </el-icon>
          <span class="ml-1">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<style scoped>
/* 动画样式 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 收起时优化隐藏 */
.el-menu--collapse .el-sub-menu__title span,
.el-menu--collapse .el-menu-item span {
  display: none;
}

/* 自定义滚动条，只作用于本组件滚动容器 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.5);
  /* Tailwind slate-500 @ 50% */
  border-radius: 3px;
  border: 1.5px solid transparent;
  background-clip: content-box;
}

.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.8);
}

/* 防止菜单项溢出宽度导致横向滚动 */
.el-menu,
.el-menu-item,
.el-sub-menu__title {
  min-width: 0 !important;
}
</style>
