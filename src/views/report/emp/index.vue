<template>
  <div class="flex justify-center items-center">
    <div ref="empJobChartRef" style="width: 100%; height: 400px; margin-top: 40px;"></div>
    <div ref="genderChartRef" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { getEmpGenderData } from '@/api/report'
import {
  PieChart,
  BarChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsType } from 'echarts'

const chartInit = () => {

}

const EmpGenderData = ref([])

echarts.use([
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
])

// DOM 引用
const genderChartRef = ref<HTMLElement | null>(null)
const empJobChartRef = ref<HTMLElement | null>(null)

// 图表实例
let genderChartInstance: EChartsType | any
let empJobChartInstance: EChartsType | any

// 图表初始化函数
const initGenderChart = () => {
  if (!genderChartRef.value) return
  genderChartInstance = echarts.init(genderChartRef.value)
  genderChartInstance.setOption({
    title: {
      text: '性别统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'bottom'
    },
    series: [{
      name: '性别',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: { show: false },
      data: [
        { value: 40, name: '男性' },
        { value: 26, name: '女性' }
      ]
    }]
  })
}

const initEmpJobChart = () => {
  if (!empJobChartRef.value) return
  empJobChartInstance = echarts.init(empJobChartRef.value)
  empJobChartInstance.setOption({
    title: {
      text: '职位统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['开发', '测试', '产品', '设计', '运维']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '人数',
      type: 'bar',
      data: [12, 8, 6, 4, 10],
      itemStyle: {
        color: '#409EFF'
      }
    }]
  })
}

// 监听窗口尺寸变化
const handleResize = () => {
  genderChartInstance?.resize()
  empJobChartInstance?.resize()
}

onMounted(() => {
  initGenderChart()
  initEmpJobChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  genderChartInstance?.dispose()
  empJobChartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>
