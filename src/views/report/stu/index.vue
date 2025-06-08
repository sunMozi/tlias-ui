<template>
  <div class="flex flex-col md:flex-row justify-center items-center gap-6 p-6">
    <div ref="genderChartRef" class="w-full md:w-1/2 h-[400px]"></div>
    <div ref="empJobChartRef" class="w-full md:w-1/2 h-[400px]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { getStudentDegreeData, getStudentCountData } from '@/api/report'
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

const genderChartRef = ref<HTMLElement | null>(null)
const empJobChartRef = ref<HTMLElement | null>(null)

let genderChartInstance: EChartsType | any
let empJobChartInstance: EChartsType | any

const studentDegreeData = ref<any[]>([])
const studentCountData = ref<any>({ clazzList: [], dataList: [] })

// 图表数据初始化
const chartInit = async () => {
  try {
    const degreeRes = await getStudentDegreeData()
    const countRes = await getStudentCountData()
    studentDegreeData.value = degreeRes
    studentCountData.value = countRes
    initStudentDegreeData()
    initStudentCountData()
    window.addEventListener('resize', handleResize)
  } catch (e) {
    console.error('图表数据获取失败:', e)
  }
}

const initStudentDegreeData = () => {
  if (!genderChartRef.value) return

  genderChartInstance = echarts.init(genderChartRef.value)

  // 定义丰富的颜色数组
  const richColorPalette = [
    '#FF6B6B', // 红
    '#FFD93D', // 黄
    '#6BCB77', // 绿
    '#4D96FF', // 蓝
    '#FF9671', // 橙
    '#845EC2', // 紫
    '#00C9A7', // 青
    '#FFC75F', // 金
    '#F9F871'  // 淡黄
  ]

  genderChartInstance.setOption({
    title: {
      text: '学生学历统计',
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
      top: 'bottom',
      textStyle: {
        fontSize: 12
      }
    },
    color: richColorPalette, // 使用自定义颜色集
    series: [
      {
        name: '学历分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 8,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 3
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 22,
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: studentDegreeData.value
      }
    ]
  })
}

// 班级柱状图
const initStudentCountData = () => {
  if (!empJobChartRef.value) return

  empJobChartInstance = echarts.init(empJobChartRef.value)
  empJobChartInstance.setOption({
    title: {
      text: '学生班级统计',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: studentCountData.value.clazzList,
      axisLabel: {
        rotate: 30,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '人数',
        type: 'bar',
        data: studentCountData.value.dataList,
        itemStyle: {
          color: '#67C23A',
          borderRadius: [6, 6, 0, 0]
        },
        barWidth: '40%'
      }
    ]
  })
}

// 自适应
const handleResize = () => {
  genderChartInstance?.resize()
  empJobChartInstance?.resize()
}

onMounted(() => {
  chartInit()
})

onBeforeUnmount(() => {
  genderChartInstance?.dispose()
  empJobChartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 可扩展 Tailwind 的默认图表容器外观 */
</style>
