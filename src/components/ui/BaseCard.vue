<template>
  <div :class="mergedClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  class?: string
}

const props = defineProps<Props>()

const baseClass = 'p-6 bg-white rounded-xl shadow space-y-4'

const mergedClass = computed(() => `${baseClass} ${props.class ?? ''}`)
</script>
