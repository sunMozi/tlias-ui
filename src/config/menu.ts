import {
  Promotion,
  Menu as MenuIcon,
  HomeFilled,
  UserFilled,
  Tools,
  Help,
  Avatar,
  Histogram,
  WarningFilled,
  Share,
  Document,
  Notebook,
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

/** 菜单项类型定义 */
export interface MenuItem {
  /** 路由路径或唯一索引 */
  index: string
  /** 显示标题 */
  title: string
  /** 图标组件 */
  icon: Component
  /** 子菜单（可选） */
  children?: MenuItem[]
  /** 权限标识（可选，用于后端权限过滤） */
  permission?: string
  /** 是否隐藏（可选，用于动态控制可见性） */
  hidden?: boolean
}

/** 侧边菜单配置列表 */
export const menuList: MenuItem[] = [
  {
    index: '/index',
    title: '首页',
    icon: Promotion,
  },
  {
    index: 'clazz', // 可以与路由 path 保持一致
    title: '班级学员管理',
    icon: MenuIcon,
    children: [
      { index: '/clazz', title: '班级管理', icon: HomeFilled, permission: 'clazz:view' },
      { index: '/stu', title: '学员管理', icon: UserFilled, permission: 'stu:view' },
    ],
  },
  {
    index: 'system',
    title: '系统信息管理',
    icon: Tools,
    children: [
      { index: '/dept', title: '部门管理', icon: Help, permission: 'dept:view' },
      { index: '/emp', title: '员工管理', icon: Avatar, permission: 'emp:view' },
      { index: '/doc', title: '接口文档', icon: Notebook, permission: 'doc:view' },
    ],
  },
  {
    index: 'report',
    title: '数据统计管理',
    icon: Histogram,
    children: [
      {
        index: '/report/emp',
        title: '员工信息统计',
        icon: WarningFilled,
        permission: 'report:emp',
      },
      { index: '/report/stu', title: '学员信息统计', icon: Share, permission: 'report:stu' },
      { index: '/log', title: '日志信息统计', icon: Document, permission: 'log:view' },
    ],
  },
]
