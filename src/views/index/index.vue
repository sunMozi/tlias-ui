<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'

// 拆分单独的 DOM ref，和对应的 ECharts 实例 ref
const studentBarRef = ref<HTMLElement | null>(null)
const genderPieRef = ref<HTMLElement | null>(null)
const logLineRef = ref<HTMLElement | null>(null)
const classStackRef = ref<HTMLElement | null>(null)

const studentChart = ref<echarts.ECharts | null>(null)
const genderChart = ref<echarts.ECharts | null>(null)
const logChart = ref<echarts.ECharts | null>(null)
const classChart = ref<echarts.ECharts | null>(null)

// 新增统计数据
const totalStudents = ref(1245)
const totalEmployees = ref(655)
const activeLogs = ref(3421)
const averageScores = ref(85.6)
const productVisits = ref(0) // 定义累计推广用户浏览

// 新增关键指标数据
const todayOrders = ref(2000)
const todaySales = ref(2000)
const todayAvgPrice = ref(200)
const todayRechargeCount = ref(2000)
const todayRechargeAmount = ref(2000)

// 新增顶部同步时间
const lastSyncTime = ref('17:30')

// 模拟动态更新同步时间
const syncData = () => {
  const now = new Date()
  lastSyncTime.value = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
}

// 模拟动态更新数据
const updateStats = () => {
  totalStudents.value += Math.floor(Math.random() * 10)
  totalEmployees.value += Math.floor(Math.random() * 5)
  activeLogs.value += Math.floor(Math.random() * 20)
  averageScores.value = parseFloat((averageScores.value + Math.random()).toFixed(1))

  todayOrders.value += Math.floor(Math.random() * 10)
  todaySales.value += Math.floor(Math.random() * 10)
  todayAvgPrice.value = parseFloat((todayAvgPrice.value + Math.random()).toFixed(1))
  todayRechargeCount.value += Math.floor(Math.random() * 5)
  todayRechargeAmount.value += Math.floor(Math.random() * 10)
}

const initCharts = () => {
  // 学员分布柱状图
  if (studentBarRef.value) {
    studentChart.value = echarts.init(studentBarRef.value)
    studentChart.value.setOption({
      title: {
        text: '学员地区分布',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉'] },
      yAxis: { type: 'value' },
      series: [
        {
          data: [120, 200, 150, 80, 130, 170, 90],
          type: 'bar',
          itemStyle: { color: '#5470C6' },
        },
      ],
    })
  }

  // 员工性别饼图
  if (genderPieRef.value) {
    genderChart.value = echarts.init(genderPieRef.value)
    genderChart.value.setOption({
      title: {
        text: '员工性别占比',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 335, name: '男', itemStyle: { color: '#91CC75' } },
            { value: 275, name: '女', itemStyle: { color: '#EE6666' } },
            { value: 45, name: '其他', itemStyle: { color: '#73C0DE' } },
          ],
        },
      ],
    })
  }

  // 日志活跃趋势折线图
  if (logLineRef.value) {
    logChart.value = echarts.init(logLineRef.value)
    logChart.value.setOption({
      title: {
        text: '日志活跃趋势',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: { type: 'value' },
      series: [
        {
          data: [120, 180, 150, 200, 170, 220, 190],
          type: 'line',
          smooth: true,
          itemStyle: { color: '#FC8452' },
        },
      ],
    })
  }

  // 班级成绩堆叠柱状图
  if (classStackRef.value) {
    classChart.value = echarts.init(classStackRef.value)
    classChart.value.setOption({
      title: {
        text: '班级成绩对比',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0 },
      xAxis: { type: 'category', data: ['语文', '数学', '英语', '物理', '化学'] },
      yAxis: { type: 'value' },
      series: [
        {
          name: '班级 A',
          type: 'bar',
          stack: '总量',
          data: [90, 85, 88, 92, 87],
          itemStyle: { color: '#5470C6' },
        },
        {
          name: '班级 B',
          type: 'bar',
          stack: '总量',
          data: [80, 78, 82, 88, 90],
          itemStyle: { color: '#91CC75' },
        },
      ],
    })
  }
}

// 窗口 resize 时调用 chart.resize()
const resizeHandler = () => {
  studentChart.value?.resize()
  genderChart.value?.resize()
  logChart.value?.resize()
  classChart.value?.resize()
}

onMounted(() => {
  // 等待 DOM 完全渲染
  nextTick(() => {
    initCharts()
    window.addEventListener('resize', resizeHandler)
  })
  syncData() // 初始化同步时间
  setInterval(updateStats, 5000) // 每5秒更新一次数据
})

onBeforeUnmount(() => {
  // 销毁实例，移除事件监听
  studentChart.value?.dispose()
  genderChart.value?.dispose()
  logChart.value?.dispose()
  classChart.value?.dispose()
  window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen space-y-6">
    <!-- 数据中心 -->
    <div class="flex justify-between items-center bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800">数据中心</h1>
      <p class="text-gray-500">上次同步时间 - {{ lastSyncTime }}</p>
    </div>

    <!-- 关键指标卡片 -->
    <div class="grid grid-cols-4 gap-6">
      <div class="bg-blue-100 shadow rounded-lg p-6 text-center">
        <h2 class="text-sm font-semibold text-blue-700">累计推广用户浏览</h2>
        <p class="text-3xl font-bold text-blue-600">{{ productVisits }}</p>
      </div>
      <div class="bg-purple-100 shadow rounded-lg p-6 text-center">
        <h2 class="text-sm font-semibold text-purple-700">累计成交订单</h2>
        <p class="text-3xl font-bold text-purple-600">{{ todayOrders }}</p>
      </div>
      <div class="bg-pink-100 shadow rounded-lg p-6 text-center">
        <h2 class="text-sm font-semibold text-pink-700">累计成交金额</h2>
        <p class="text-3xl font-bold text-pink-600">{{ todaySales }}</p>
      </div>
      <div class="bg-green-100 shadow rounded-lg p-6 text-center">
        <h2 class="text-sm font-semibold text-green-700">今日充值金额</h2>
        <p class="text-3xl font-bold text-green-600">{{ todayRechargeAmount }}</p>
      </div>
    </div>

    <!-- 经营情况总览 -->
    <div class="grid grid-cols-3 gap-6">
      <!-- 销售情况 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">销售情况</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">完成进度</span>
            <span class="text-sm text-gray-700">3/11</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full" style="width: 27%"></div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">上升率</span>
            <span class="text-sm text-gray-700">23%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-500 h-2 rounded-full" style="width: 23%"></div>
          </div>
        </div>
      </div>

      <!-- 电商流量统计 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">电商流量统计</h2>
        <div ref="logLineRef" class="w-full h-64"></div>
      </div>

      <!-- 成交转化统计 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">成交转化统计</h2>
        <div ref="genderPieRef" class="w-full h-64"></div>
      </div>
    </div>

    <!-- 推广效果 -->
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">推广效果</h2>
        <div ref="studentBarRef" class="w-full h-64"></div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">站内性能统计</h2>
        <div ref="classStackRef" class="w-full h-64"></div>
      </div>
    </div>
  </div>
</template>
