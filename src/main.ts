import './assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入 TDesign 样式
import 'tdesign-vue-next/es/style/index.css'

// 引入 TDesign 组件库
import TDesign from 'tdesign-vue-next'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TDesign)

app.use(ElementPlus, {
  locale: zhCn,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
