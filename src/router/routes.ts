// routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Home',
        component: () => import('@/views/index/index.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'clazz',
        name: 'Clazz',
        component: () => import('@/views/clazz/index'),
        meta: { title: '班级管理' },
      },
      {
        path: 'stu',
        name: 'Student',
        component: () => import('@/views/stu/index.vue'),
        meta: { title: '学生管理' },
      },
      {
        path: 'dept',
        name: 'Department',
        component: () => import('@/views/dept/index.vue'),
        meta: { title: '部门管理' },
      },
      {
        path: 'emp',
        name: 'Employee',
        component: () => import('@/views/emp/index.vue'),
        meta: { title: '员工管理' },
      },
      {
        path: 'doc',
        name: 'Document',
        component: () => import('@/views/doc/index.vue'),
        meta: { title: '文档管理' },
      },
      {
        path: 'report/emp',
        name: 'ReportEmployee',
        component: () => import('@/views/report/emp/index.vue'),
        meta: { title: '员工报表' },
      },
      {
        path: 'report/stu',
        name: 'ReportStudent',
        component: () => import('@/views/report/stu/index.vue'),
        meta: { title: '学生报表' },
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/log/index.vue'),
        meta: { title: '操作日志' },
      },
    ],
  },
]

export default routes
