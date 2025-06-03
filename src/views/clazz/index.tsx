import { defineComponent, ref, watch, onMounted } from 'vue'
import {
  Button,
  Tag,
  type PrimaryTableCol,
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
  DatePicker,
  DateRangePicker,
  Pagination,
  Table,
  MessagePlugin,
  type TableRowData,
  DialogPlugin,
} from 'tdesign-vue-next'
import { getClazzList, updateClazz, createClazz, deleteClazz } from '@/api/clazz'
import { getEmployeeList } from '@/api/employee'
import type { Clazz } from '@/types/clazz'
import dayjs from 'dayjs'
import { omit } from '@/utils/useOmit'

export default defineComponent(() => {
  const clazzList = ref<Clazz[]>([])
  const loading = ref(false)

  const currentPage = ref(1)
  const pageSize = ref(5)
  const pageTotal = ref(0)

  const searchParams = ref({
    name: '',
    date: [] as [string, string] | [],
  })

  // 员工列表，用于下拉选择，value是id，label是姓名
  const employees = ref<{ label: string; value: number | string }[]>([])

  const subjects = [
    { label: 'Java', value: 1 },
    { label: '前端', value: 2 },
    { label: '大数据', value: 3 },
    { label: 'Python', value: 4 },
    { label: 'Go', value: 5 },
    { label: '嵌入式', value: 6 },
  ]

  const subjectMap: Record<number, string> = {
    1: 'Java',
    2: '前端',
    3: '大数据',
    4: 'Python',
    5: 'Go',
    6: '嵌入式',
  }

  onMounted(async () => {
    const res = await getEmployeeList()
    employees.value = res.map((item) => ({
      label: item.name,
      value: item.id,
    }))
  })

  const getClazzAll = async () => {
    const [begin, end] = searchParams.value.date || []
    loading.value = true
    try {
      const res = await getClazzList({
        page: currentPage.value,
        pageSize: pageSize.value,
        name: searchParams.value.name,
        begin,
        end,
      })
      clazzList.value = res.rows
      pageTotal.value = res.total
    } finally {
      loading.value = false
    }
  }

  const resetSearch = () => {
    searchParams.value = { name: '', date: [] }
    currentPage.value = 1
    getClazzAll()
  }

  watch([currentPage, pageSize, searchParams], () => getClazzAll(), { immediate: true })

  const dialogVisible = ref(false)
  const isEditMode = ref(false)

  const form = ref<Clazz>({
    id: '',
    name: '',
    room: '',
    masterName: '',
    masterId: '',
    beginDate: '',
    endDate: '',
    updateTime: '',
    status: '',
    subject: '',
  })

  const formRef = ref()

  const rules = {
    name: [{ required: true, message: '请输入班级名称', type: 'error' as const }],
    room: [{ required: true, message: '请输入教室名称', type: 'error' as const }],
    masterId: [{ required: true, message: '请选择班主任', type: 'error' as const }],
    beginDate: [
      { required: true, message: '请选择起始时间', type: 'error' as const },
      {
        validator: (val: string) =>
          !form.value.endDate || dayjs(val).isBefore(dayjs(form.value.endDate)),
        message: '起始时间不能晚于结束时间',
        type: 'error' as const,
      },
    ],
    endDate: [
      { required: true, message: '请选择结束时间', type: 'error' as const },
      {
        validator: (val: string) =>
          !form.value.beginDate || dayjs(val).isAfter(dayjs(form.value.beginDate)),
        message: '结束时间不能早于起始时间',
        type: 'error' as const,
      },
    ],
    subject: [{ required: true, message: '请选择学科', type: 'error' as const }],
  }

  const handleEdit = (row: Clazz) => {
    form.value = {
      ...row,
      masterId: row.masterId || '',
      subject: row.subject || '',
    }
    isEditMode.value = true
    dialogVisible.value = true
  }

  const handleAdd = () => {
    form.value = {
      id: '',
      name: '',
      room: '',
      masterName: '',
      masterId: '',
      beginDate: '',
      endDate: '',
      updateTime: '',
      status: '',
      subject: '',
    }
    isEditMode.value = false
    dialogVisible.value = true
  }

  const saveForm = async () => {
    const result = await formRef.value.validate()

    if (result === true) {
      const safePayload = omit(form.value, ['createTime', 'updateTime'])

      if (isEditMode.value) {
        console.log('保存编辑的班级信息：', safePayload)
        await updateClazz(safePayload as Clazz)
        MessagePlugin.success('班级信息已更新')
      } else {
        console.log('新增班级信息：', safePayload)
        await createClazz(safePayload as Clazz)
        MessagePlugin.success('班级信息已新增')
      }

      dialogVisible.value = false
      getClazzAll()
    } else {
      const errors = result as Record<string, { message: string }[]>
      const errorMessages: string[] = []
      Object.values(errors).forEach((fieldErrors) => {
        fieldErrors.forEach((err) => {
          if (err.message) errorMessages.push(err.message)
        })
      })
      MessagePlugin.error(errorMessages.slice(0, 3).join('；') || '表单校验未通过，请检查输入')
    }
  }

  const handleDelete = (row: Clazz) => {
    const confirmDialog = DialogPlugin.confirm({
      header: '确认删除',
      body: `确定要删除班级「${row.name}」吗？该操作不可撤销。`,
      theme: 'warning',
      confirmBtn: '删除',
      cancelBtn: '取消',
      onConfirm: async () => {
        try {
          await deleteClazz(row.id)
          MessagePlugin.success('删除成功')
          getClazzAll()
        } catch (error) {
          console.error('删除班级失败:', error)
        } finally {
          confirmDialog.hide()
        }
      },
      onClose: () => {
        confirmDialog.hide()
      },
    })
  }
  const getStatusTag = (status: string) => {
    const map: Record<string, { theme: 'success' | 'default' | 'warning'; label: string }> = {
      在读: { theme: 'success', label: '在读' },
      未开始: { theme: 'warning', label: '未开始' },
      已结课: { theme: 'default', label: '已结课' },
    }
    return map[status] || { theme: 'default', label: status }
  }

  const columns: PrimaryTableCol<Clazz>[] = [
    { colKey: 'row-select', type: 'multiple', width: 50 },
    { colKey: 'name', title: '班级名称', align: 'center', width: 150 },
    { colKey: 'room', title: '教室', align: 'center', width: 100 },
    { colKey: 'masterName', title: '班主任', align: 'center', width: 100 },
    {
      colKey: 'subject',
      title: '学科',
      align: 'center',
      width: 100,
      cell: (_h, context) => subjectMap[context.row.subject as number] || '未知',
    },
    {
      colKey: 'duration',
      title: '起止时间',
      align: 'center',
      width: 200,
      cell: (_h, context) =>
        `${dayjs(context.row.beginDate).format('YYYY-MM-DD')} ~ ${dayjs(context.row.endDate).format('YYYY-MM-DD')}`,
    },
    {
      colKey: 'updateTime',
      title: '最后更新时间',
      align: 'center',
      width: 160,
      cell: (_h, context) => dayjs(context.row.updateTime).format('YYYY-MM-DD HH:mm'),
    },
    {
      colKey: 'status',
      title: '状态',
      align: 'center',
      width: 100,
      cell: (_h, context) => {
        const status = getStatusTag(context.row.status)
        return (
          <Tag theme={status.theme} variant="light">
            {status.label}
          </Tag>
        )
      },
    },
    {
      colKey: 'action',
      title: '操作',
      align: 'center',
      width: 160,
      cell: (_h, context) => {
        const row = context.row
        return (
          <div class="flex justify-center gap-2">
            <Button size="small" onClick={() => handleEdit(row)}>
              编辑
            </Button>
            <Button size="small" theme="danger" variant="outline" onClick={() => handleDelete(row)}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  const onPageChange = (pageInfo: { current: number } | number) => {
    currentPage.value = typeof pageInfo === 'number' ? pageInfo : pageInfo.current
  }

  const onPageSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
  }

  return () => (
    <>
      <div class="p-6 bg-white rounded-xl shadow space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <Form layout="inline" class="flex flex-wrap gap-4">
            <FormItem label="班级名称" name="name">
              <Input v-model={searchParams.value.name} placeholder="请输入班级名称" />
            </FormItem>
            <FormItem label="节课时间" name="date">
              <DateRangePicker
                v-model={searchParams.value.date}
                allow-input
                placeholder="请选择起止时间"
              />
            </FormItem>
          </Form>
          <div class="flex gap-2">
            <Button theme="primary" onClick={getClazzAll}>
              查询
            </Button>
            <Button onClick={resetSearch}>清空</Button>
          </div>
        </div>
        <div class="flex justify-end">
          <Button theme="primary" variant="outline" onClick={handleAdd}>
            新增班级
          </Button>
        </div>
      </div>

      <div class="mt-4 p-6 bg-white rounded-xl shadow-sm">
        <Table
          row-key="id"
          data={clazzList.value}
          columns={columns as unknown as PrimaryTableCol<TableRowData>[]}
          hover
          bordered
          size="medium"
          table-layout="fixed"
          loading={loading.value}
        />
      </div>

      <div class="mt-4 p-4 bg-white rounded-xl shadow-sm flex justify-end">
        <Pagination
          page-size={pageSize.value}
          total={pageTotal.value}
          current={currentPage.value}
          on-change={onPageChange}
          on-page-size-change={onPageSizeChange}
          size="small"
          show-page-size
          show-jumper
        />
      </div>

      {/* 通用弹窗 */}
      <Dialog
        visible={dialogVisible.value}
        header={isEditMode.value ? '编辑班级' : '新增班级'}
        onClose={() => (dialogVisible.value = false)}
        width="600px"
        footer={() => (
          <>
            <Button onClick={() => (dialogVisible.value = false)}>取消</Button>
            <Button theme="primary" onClick={saveForm}>
              保存
            </Button>
          </>
        )}
      >
        <Form ref={formRef} data={form} rules={rules} labelWidth="100px" status-icon>
          <FormItem label="班级名称" name="name">
            <Input v-model={form.value.name} placeholder="请输入班级名称" />
          </FormItem>

          <FormItem label="教室" name="room">
            <Input v-model={form.value.room} placeholder="请输入教室" />
          </FormItem>

          <FormItem label="班主任" name="masterId">
            <Select
              value={form.value.masterId}
              options={employees.value}
              placeholder="请选择班主任"
              clearable
              allow-search
              filterable
              onChange={(value) => {
                form.value.masterId = value as string | number
                const selected = employees.value.find((e) => e.value === value)
                form.value.masterName = selected?.label || ''
              }}
            />
          </FormItem>

          <FormItem label="起始时间" name="beginDate">
            <DatePicker
              v-model={form.value.beginDate}
              placeholder="请选择起始时间"
              format="YYYY-MM-DD"
              clearable
              allow-input
            />
          </FormItem>

          <FormItem label="结束时间" name="endDate">
            <DatePicker
              v-model={form.value.endDate}
              placeholder="请选择结束时间"
              format="YYYY-MM-DD"
              clearable
              allow-input
            />
          </FormItem>

          <FormItem label="学科" name="subject">
            <Select
              v-model={form.value.subject}
              options={subjects}
              placeholder="请选择学科"
              clearable
            />
          </FormItem>
        </Form>
      </Dialog>
    </>
  )
})
