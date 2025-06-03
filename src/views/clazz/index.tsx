import { defineComponent, onMounted, ref } from 'vue'
import type { Clazz } from '@/types/clazz'
import { getClazzList } from '@/api/clazz'
import type { PrimaryTableCol } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'

export default defineComponent(() => {
  const clazzList = ref<Clazz[]>([])
  const loading = ref(false)

  const getClazzAll = async () => {
    loading.value = true
    try {
      const list = await getClazzList()
      clazzList.value = list
    } catch (error) {
      MessagePlugin.error('获取班级列表失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const columns: PrimaryTableCol[] = [
    { colKey: 'room', title: '教室', align: 'center' },
    { colKey: 'name', title: '班级名称', align: 'center' },
    { colKey: 'masterName', title: '班主任', align: 'center' },
    { colKey: 'beginDate', title: '开始时间', align: 'center' },
    {colKey: 'beginDate', title: '结束时间', align: 'center'}
    { colKey: 'endDate', title: '结束时间', align: 'center' },
    { colKey: 'status', title: '状态', align: 'center' },
    { colKey: 'action', title: '操作', align: 'center' },
  ]

  onMounted(() => {
    getClazzAll()
  })

  return () => (
    <div class="p-4 bg-white rounded shadow-sm">
      <t-table
        row-key="id"
        data={clazzList.value}
        columns={columns}
        hover
        table-layout="fixed"
        bordered
        size="medium"
        loading={loading.value}
      />
    </div>
  )
})
