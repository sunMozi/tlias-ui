import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useLoadingStore } from '@/stores/loading'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const MIN_LOADING_TIME = 300
let loadingStartTime = 0
let hasLoadedOnce = false

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore()
  const userStore = useUserStore()

  // 加载动画控制
  if (!hasLoadedOnce) {
    loadingStore.start()
    loadingStartTime = Date.now()
  }

  const isLoggedIn = userStore.isAuthenticated

  // 白名单放行
  if (whiteList.includes(to.path)) {
    next()
    return
  }

  // 非白名单页面必须登录
  if (!isLoggedIn) {
    next({ path: '/login' })
    return
  }

  next()
})

router.afterEach(() => {
  const loadingStore = useLoadingStore()

  if (!hasLoadedOnce) {
    const elapsed = Date.now() - loadingStartTime
    const remaining = MIN_LOADING_TIME - elapsed

    if (remaining <= 0) {
      loadingStore.finish()
    } else {
      setTimeout(() => {
        loadingStore.finish()
      }, remaining)
    }

    hasLoadedOnce = true
  }
})

export default router
