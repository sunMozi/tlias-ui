<script setup lang="ts">
import { ref, computed } from 'vue'
import { motion } from 'motion-v'
import { login } from '@/api/login'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { MessagePlugin } from 'tdesign-vue-next'


const username = ref('')
const password = ref('')

const isLoginEnabled = computed(() => {
  return username.value.trim() !== '' && password.value.trim() !== ''
})

const handleLogin = async () => {
  if (!isLoginEnabled.value) return

  const res = await login({
    username: username.value,
    password: password.value,
  })

  const userStore = useUserStore()
  userStore.setUserInfo(res)
  router.push('/')
  MessagePlugin.success('登录成功')


}

const floatAnimation = {
  animate: { y: [0, -10, 0], x: [0, 10, 0] },
  transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
}

const pulseAnimation = {
  animate: { scale: [1, 1.05, 1] },
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
}

const rotateScaleAnimation = {
  animate: { rotate: [0, 360], scale: [1, 1.1, 1] },
  transition: { duration: 12, repeat: Infinity, ease: 'linear' }
}

const floatRotateAnimation = {
  animate: { y: [0, -10, 0], rotate: [0, 10, -10, 0] },
  transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
}
</script>

<template>
  <div
    class="relative w-full min-h-screen bg-[#0d1b2a] overflow-hidden flex items-center justify-center p-4 animate-bg-pulse">
    <motion.div class="absolute -top-20 -left-20 w-80 h-80 bg-[#ff6b6b] rounded-2xl opacity-50 rotate-45"
      v-bind="rotateScaleAnimation" />
    <motion.div class="absolute top-10 right-0 w-64 h-64 bg-[#4ecdc4] rounded-full opacity-40"
      v-bind="floatRotateAnimation" />
    <motion.div class="absolute bottom-0 -right-32 w-96 h-96 bg-[#f7fff7] rounded-br-[4rem] opacity-30"
      :animate="{ x: [-10, 10, -10], rotate: [0, 5, -5, 0] }"
      :transition="{ duration: 15, repeat: Infinity, ease: 'easeInOut' }" />
    <motion.div class="absolute bottom-10 left-0 w-48 h-48 bg-[#ffe66d] rounded-full opacity-40"
      v-bind="rotateScaleAnimation" />

    <div
      class="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0, scale: [1, 1.01, 1] }"
      :transition="{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }">

      <motion.div class="w-full md:w-1/2 bg-white p-8 md:px-12 md:py-16 flex flex-col justify-between"
        :initial="{ opacity: 0, x: -40 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.5, delay: 0.1 }">

        <div>
          <motion.img src="/logo.svg" alt="Logo" class="h-8 w-auto mb-6"
            :initial="{ opacity: 0, scale: 0.8, rotate: -10 }" :animate="{ opacity: 1, scale: 1, rotate: 0 }"
            :transition="{ duration: 0.6, ease: 'easeOut' }" />
          <h2 class="text-3xl font-bold text-gray-800 mb-2">欢迎登录</h2>
          <p class="text-gray-500 mb-8">请输入您的账户信息以继续</p>
        </div>

        <motion.div class="flex-1" :initial="{ opacity: 0, x: -20 }" :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.4, delay: 0.2 }">
          <div class="space-y-6">
            <div class="flex flex-col">
              <label for="username" class="text-sm text-gray-600 mb-1">用户名</label>
              <input id="username" type="text" v-model="username" placeholder="请输入用户名"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] focus:shadow-lg"
                autocomplete="username" />
            </div>
            <div class="flex flex-col">
              <label for="password" class="text-sm text-gray-600 mb-1">密码</label>
              <input id="password" type="password" v-model="password" placeholder="请输入密码"
                class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] focus:shadow-lg"
                autocomplete="current-password" />
            </div>
            <motion.button type="button" @click="handleLogin" :disabled="!isLoginEnabled" :class="[
              'w-full rounded-full py-2 font-semibold text-white text-lg transition-transform duration-200',
              isLoginEnabled
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
                : ' cursor-not-allowed',
            ]">
              登录
            </motion.button>
          </div>
        </motion.div>

        <motion.div class="mt-8 text-center text-sm text-gray-500" :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.5 }">
          <span>没有账号？</span>
          <a href="#" class="text-blue-600 hover:underline ml-1">注册</a>
          <span class="mx-2">·</span>
          <a href="#" class="text-blue-600 hover:underline">忘记密码</a>
        </motion.div>
      </motion.div>


      <div class="hidden md:flex w-1/2 bg-[#f0f4f8] items-center justify-center relative overflow-hidden rounded-xl">
        <div class="relative z-10 w-3/4 h-3/4 bg-white rounded-xl shadow-xl p-6 overflow-hidden">

          <motion.div class="absolute -top-20 -left-20 w-80 h-80 bg-[#ff6b6b] rounded-2xl opacity-50 rotate-45"
            v-bind="floatAnimation" />
          <motion.div class="absolute top-10 right-0 w-64 h-64 bg-[#4ecdc4] rounded-full opacity-40"
            v-bind="pulseAnimation" />
          <motion.div class="absolute bottom-0 -right-32 w-96 h-96 bg-[#f7fff7] rounded-br-[4rem] opacity-30"
            :animate="{ x: [-10, 10, -10] }" :transition="{ duration: 10, repeat: Infinity, ease: 'easeInOut' }" />
          <motion.div class="absolute bottom-10 left-0 w-48 h-48 bg-[#c5ac30] rounded-full opacity-40"
            v-bind="floatAnimation" />
        </div>

        <motion.div
          class="absolute top-1/3 left-1/2 w-[120px] h-[120px] bg-purple-300 rounded-full opacity-25 blur-[90px] pointer-events-none"
          :animate="{ scale: [1, 1.1, 1] }" :transition="{ duration: 12, repeat: Infinity }" />

        <motion.div
          class="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-tr from-blue-300 to-blue-500 rounded-full opacity-40 filter blur-xl shadow-lg"
          v-bind="rotateScaleAnimation">
          <motion.div
            class="absolute top-1/3 left-1/2 w-[120px] h-[120px] bg-purple-300 rounded-full opacity-25 blur-[90px] pointer-events-none"
            :animate="{ scale: [1, 1.1, 1] }" :transition="{ duration: 12, repeat: Infinity }" />
        </motion.div>
        <motion.div
          class="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full opacity-60 shadow-md"
          v-bind="pulseAnimation" />
        <motion.div
          class="absolute bottom-16 left-14 w-28 h-28 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full opacity-40 filter blur-md shadow-lg"
          v-bind="floatRotateAnimation" />
        <motion.div
          class="absolute bottom-6 left-10 w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-70 shadow-md"
          v-bind="pulseAnimation" />
        <motion.div class="absolute bottom-32 left-24 w-20 h-20 bg-purple-300 rounded-full opacity-30 filter blur-sm"
          v-bind="floatAnimation" />
        <motion.div class="absolute top-24 left-12 w-32 h-32 bg-cyan-200 rounded-full opacity-25 filter blur-lg"
          v-bind="pulseAnimation" />
        <motion.div
          class="absolute bottom-[12%] right-[8%] w-[200px] h-[200px] bg-gradient-to-tr from-yellow-300 via-red-300 to-pink-400 opacity-30 rounded-[50%_50%_40%_60%/40%_60%_50%_50%] blur-2xl pointer-events-none"
          v-bind="floatRotateAnimation" />
        <motion.div
          class="absolute top-1/3 left-1/2 w-[120px] h-[120px] bg-purple-300 rounded-full opacity-25 blur-[90px] pointer-events-none"
          :animate="{ scale: [1, 1.1, 1] }" :transition="{ duration: 12, repeat: Infinity }" />
      </div>
    </div>
    <motion.div
      class="absolute top-[10%] left-[5%] w-[260px] h-[260px] bg-gradient-to-br from-pink-400 to-indigo-400 opacity-40 blur-3xl rounded-[60%_40%_60%_40%/50%_60%_40%_50%] pointer-events-none"
      :animate="{ rotate: [0, 360] }" :transition="{ duration: 30, repeat: Infinity, ease: 'linear' }" />

    <motion.div
      class="absolute bottom-[12%] right-[8%] w-[200px] h-[200px] bg-gradient-to-tr from-yellow-300 via-red-300 to-pink-400 opacity-30 rounded-[50%_50%_40%_60%/40%_60%_50%_50%] blur-2xl pointer-events-none"
      v-bind="floatRotateAnimation" />
  </div>
</template>
