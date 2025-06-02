<script setup lang="ts">
import { EditPen, SwitchButton } from '@element-plus/icons-vue'
</script>

<template>
  <el-header
    class="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-[#00547d] via-[#00aaa0] to-[#a8eb12]"
  >
    <span class="text-white text-2xl font-bold font-serif">Tlias智能学习辅助系统</span>
    <div class="flex items-center space-x-4 text-white">
      <a href="#" class="flex items-center hover:underline">
        <el-icon>
          <EditPen />
        </el-icon>
        <span class="ml-1">修改密码</span>
      </a>
      <span>|</span>
      <a href="#" class="flex items-center hover:underline">
        <el-icon>
          <SwitchButton />
        </el-icon>
        <span class="ml-1">退出登录</span>
      </a>
    </div>
  </el-header>
</template>
