// hook/useDebounceFn.ts
import { ref, onBeforeUnmount } from 'vue'

export interface DebounceOptions {
  wait?: number
  immediate?: boolean
}

export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  options: DebounceOptions = {},
) {
  const { wait = 300, immediate = false } = options
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)

  const cancel = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  const debounced = (...args: Parameters<T>): void => {
    if (timer.value) {
      clearTimeout(timer.value)
    }

    if (immediate && !timer.value) {
      fn(...args)
    }

    timer.value = setTimeout(() => {
      if (!immediate) {
        fn(...args)
      }
      timer.value = null
    }, wait)
  }

  onBeforeUnmount(() => {
    cancel()
  })

  return {
    run: debounced,
    cancel,
  }
}
