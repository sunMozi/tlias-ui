<script setup lang="ts">
// ...existing code...
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" class="w-full h-full" />
  </router-view>
</template>
