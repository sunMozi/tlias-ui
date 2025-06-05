<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import GlobalLoader from './components/ui/GlobalLoader.vue'

const loadingStore = useLoadingStore()
const loading = computed(() => loadingStore.loading)
</script>

<template>
  <!-- 全局加载动画遮罩 -->
  <GlobalLoader :modelValue="loading" />

  <!-- 路由页面切换动画 -->
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" class="w-full h-full" style="overflow: hidden" />
    </transition>
  </router-view>
</template>
