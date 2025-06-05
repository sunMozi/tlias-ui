<script setup lang="ts">
import { computed, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

// 可选：监听 visible 变化做额外处理
watch(visible, () => {
  // console.log('加载状态:', val)
})
</script>

<template>
  <transition name="fade">
    <div class="spinner-box" v-if="visible">
      <div class="configure-border-1">
        <div class="configure-core"></div>
      </div>
      <div class="configure-border-2">
        <div class="configure-core"></div>
      </div>
    </div>
  </transition>
</template>


<style scoped>
.spinner-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: rgba(225, 225, 225, 0.95);
}

.configure-border-1 {
  width: 50px;
  height: 50px;
  padding: 3px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fb5b53;
  animation: configure-clockwise 3s ease-in-out 0s infinite alternate;
}

.configure-border-2 {
  width: 50px;
  height: 50px;
  padding: 3px;
  left: -50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(63, 249, 220);
  transform: rotate(45deg);
  animation: configure-xclockwise 3s ease-in-out 0s infinite alternate;
}

.configure-core {
  width: 100%;
  height: 100%;
  background-color: #1d2630;
}

@keyframes configure-clockwise {
  0% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes configure-xclockwise {
  0% {
    transform: rotate(45deg);
  }

  25% {
    transform: rotate(-45deg);
  }

  50% {
    transform: rotate(-135deg);
  }

  75% {
    transform: rotate(-225deg);
  }

  100% {
    transform: rotate(-315deg);
  }
}
</style>
