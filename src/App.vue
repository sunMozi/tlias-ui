<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" class="w-full h-full" style="overflow: hidden;" />
  </router-view>
</template>
