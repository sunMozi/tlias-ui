<template>
  <div class="flex justify-center items-center ">
    <div ref="empJobChartRef" style="width: 100%; height: 400px; margin-top: 40px;"></div>
    <div ref="genderChartRef" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { getEmpGenderData, getEmpJobData } from '@/api/report'
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

// 注册图表组件
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

const empGenderData = ref<any>([])
const empJobData = ref<any>([])

// 异步初始化
const chartInit = async () => {
  try {
    let res = await getEmpGenderData()
    empGenderData.value = res
    res = await getEmpJobData()
    empJobData.value = res
    console.log(empJobData.value)
    initGenderChart()
    initEmpJobChart()
    window.addEventListener('resize', handleResize)
  } catch (e) {
    console.error('获取图表数据失败', e)
  }
}

// 初始化性别统计图
const initGenderChart = () => {
  if (!genderChartRef.value || !empGenderData.value) return

  const genderColors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']

  genderChartInstance = echarts.init(genderChartRef.value)
  genderChartInstance.setOption({
    title: {
      text: '性别统计',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}人 ({d}%)'
    },
    legend: {
      bottom: 10,
      textStyle: {
        fontSize: 12
      }
    },
    color: genderColors,
    series: [{
      name: '性别',
      type: 'pie',
      radius: ['40%', '70%'],
      padAngle: 6,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 3,
        shadowBlur: 15,
        shadowColor: 'rgba(0, 0, 0, 0.15)'
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
          formatter: '{b}\n{c}人\n({d}%)'
        }
      },
      labelLine: {
        show: false
      },
      data: empGenderData.value
    }]
  })
}

// 初始化职位统计图
const initEmpJobChart = () => {
  if (!empJobChartRef.value) return

  empJobChartInstance = echarts.init(empJobChartRef.value)
  empJobChartInstance.setOption({
    title: {
      text: '职位统计',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: empJobData.value.jobList,
      axisTick: { alignWithLabel: true },
      axisLabel: { rotate: 30 }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#E0E0E0'
        }
      }
    },
    series: [{
      name: '人数',
      type: 'bar',
      barWidth: '50%',
      data: empJobData.value.dataList,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#409EFF' },
          { offset: 1, color: '#66B1FF' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        color: '#333',
        fontWeight: 500
      }
    }]
  })
}


// 响应式处理
const handleResize = () => {
  genderChartInstance?.resize()
  empJobChartInstance?.resize()
}

// 生命周期
onMounted(() => {
  chartInit()
})

onBeforeUnmount(() => {
  genderChartInstance?.dispose()
  empJobChartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>
