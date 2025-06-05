<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import { EditPen, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 退出登录处理函数
function handleLogout() {
  userStore.clearUserInfo()
  router.replace({ path: '/login' })
}
</script>

<template>
  <el-header
    class="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-[#00547d] via-[#00aaa0] to-[#a8eb12] shadow-md">
    <!-- 左侧标题 -->
    <h1 class="text-white text-xl font-semibold tracking-wide select-none">
      Tlias 智能学习辅助系统
    </h1>

    <!-- 右侧操作 -->
    <div class="flex items-center gap-5 text-white text-sm font-medium">
      <!-- 修改密码 -->
      <a href="#" class="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200">
        <el-icon size="20">
          <EditPen />
        </el-icon>
        <span>修改密码</span>
      </a>

      <!-- 分隔符 -->
      <span class="text-white/50">|</span>

      <!-- 退出登录 -->
      <button class="flex items-center gap-1 hover:opacity-80 transition-opacity duration-200" @click="handleLogout">
        <el-icon size="20">
          <SwitchButton />
        </el-icon>
        <span>退出登录</span>
      </button>
    </div>
  </el-header>
</template>
