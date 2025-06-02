import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/index',
    children: [
      { path: 'index', component: () => import('@/views/index/index.vue') },
      { path: 'clazz', component: () => import('@/views/clazz/index.vue') },
      { path: 'stu', component: () => import('@/views/stu/index.vue') },
      { path: 'dept', component: () => import('@/views/dept/index.vue') },
      { path: 'emp', component: () => import('@/views/emp/index.vue') },
      { path: 'doc', component: () => import('@/views/doc/index.vue') },
      { path: 'report/emp', component: () => import('@/views/report/emp/index.vue') },
      { path: 'report/stu', component: () => import('@/views/report/stu/index.vue') },
      { path: 'log', component: () => import('@/views/log/index.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
