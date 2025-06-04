import { defineComponent, onMounted, reactive, ref } from 'vue'
import { selectStuAll, selectStuById, updateStu, createStu, delStuByIds } from '@/api/stu'
import { selectClazzAll } from '@/api/clazz'
import type { Student } from '@/types/stu'
import BaseCard from '@/components/ui/BaseCard.vue'
import rules from '@/rules/studentRules'
import {
  Button,
  DatePicker,
  Dialog,
  Form,
  FormItem,
  Input,
  MessagePlugin,
  Select,
  DialogPlugin,
} from 'tdesign-vue-next'
import dayjs from 'dayjs'

export default defineComponent(() => {
  const stuList = ref<Student[]>([])
  const clazzList = ref<{ value: number; label: string }[]>([])
  const isLoading = ref(false)
  const dialogVisible = ref(false)
  const isEditMode = ref(false)
  const selectedRowKeys = ref<number[]>([])

  const formRef = ref()

  const form = reactive({
    id: '',
    name: '',
    no: '',
    gender: '',
    phone: '',
    idCard: '',
    isCollege: '',
    address: '',
    degree: '',
    graduationDate: '',
    clazzId: '',
  })

  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const searchParams = reactive({
    page: 1,
    pageSize: 10,
    name: '',
    degree: '',
    clazzId: '',
  })

  const resetSearch = () => {
    searchParams.name = ''
    searchParams.degree = ''
    searchParams.clazzId = ''
    searchParams.page = 1
    getStuList()
  }

  const getStuList = async () => {
    try {
      isLoading.value = true
      const res = await selectStuAll(searchParams)
      stuList.value = res.rows
      pagination.value.total = res.total
    } catch (e) {
      MessagePlugin.error('数据加载失败')
      console.error('Error fetching student list:', e)
    } finally {
      isLoading.value = false
    }
  }

  const getRootList = async () => {
    const res = selectClazzAll()
    clazzList.value = (await res).map((item: { id: any; name: any }) => ({
      value: item.id,
      label: item.name,
    }))
  }

  onMounted(() => {
    getStuList()
    getRootList()
  })

  const handlePageChange = (pageInfo: any) => {
    pagination.value.current = pageInfo.current
    pagination.value.pageSize = pageInfo.pageSize

    searchParams.page = pageInfo.current
    searchParams.pageSize = pageInfo.pageSize

    getStuList()
  }
  const handleEdit = async (row: Student) => {
    isEditMode.value = true
    dialogVisible.value = true
    const res = await selectStuById(row.id)
    Object.assign(form, res)
  }

  const addStudent = () => {
    dialogVisible.value = true
    isEditMode.value = false
    resetForm()
  }

  const resetForm = () => {
    Object.assign(form, {
      id: '',
      name: '',
      no: '',
      gender: '',
      phone: '',
      idCard: '',
      isCollege: '',
      address: '',
      degree: '',
      graduationDate: '',
      clazzId: '',
    })
  }

  const handleDelete = (row: Student) => {
    const dialog = DialogPlugin.confirm({
      header: '删除确认',
      body: `确定要删除学生「${row.name}」吗？该操作不可撤销！`,
      theme: 'warning',
      onConfirm: async () => {
        try {
          await delStuByIds([row.id])
          MessagePlugin.success('删除成功')
          await getStuList()
        } catch (error) {
          MessagePlugin.error('删除失败，请稍后重试')
          console.error('删除异常:', error)
        }
        dialog.destroy()
      },
      onClose: () => {
        dialog.destroy()
      },
    })
  }

  const delStuBatch = async () => {
    if (!selectedRowKeys.value.length) {
      MessagePlugin.warning('请先选择要删除的学生')
      return
    }

    const dialog = DialogPlugin.confirm({
      header: '批量删除确认',
      body: `确定要删除选中的 ${selectedRowKeys.value.length} 名学生吗？此操作不可撤销！`,
      theme: 'warning',
      onConfirm: async () => {
        try {
          await delStuByIds(selectedRowKeys.value)
          MessagePlugin.success('删除成功')
          selectedRowKeys.value = []
          await getStuList()
        } catch (error) {
          MessagePlugin.error('删除失败，请稍后重试')
          console.error('删除失败:', error)
        }
        dialog.destroy()
      },
      onClose: () => {
        dialog.destroy()
      },
    })
  }

  const saveStudent = async () => {
    const result = await formRef.value.validate()

    if (result === true) {
      if (isEditMode.value) {
        await updateStu(form as unknown as Student)
        MessagePlugin.success('更新成功')

        dialogVisible.value = false
        await getStuList()
      } else {
        await createStu(form as unknown as Student)
        MessagePlugin.success('新增成功')
      }
    } else {
      const errors = result as Record<string, { message: string }[]>
      const errorMessages: string[] = []
      Object.values(errors).forEach((fieldErrors) => {
        fieldErrors.forEach((err) => {
          if (err.message) errorMessages.push(err.message)
        })
      })
      MessagePlugin.error(errorMessages.slice(0, 1).join(':') || '表单校验未通过，请检查输入')
    }
  }

  const degreeMap = new Map<number, string>([
    [1, '初中'],
    [2, '高中'],
    [3, '大专'],
    [4, '本科'],
    [5, '硕士'],
    [6, '博士'],
  ])

  const degrees = [...degreeMap].map(([value, label]) => ({ value, label }))

  const genders = [
    { value: 1, label: '男' },
    { value: 2, label: '女' },
  ]

  const formatGender = (gender: number) => (gender === 1 ? '男' : '女')

  const columns = [
    { colKey: 'row-select', type: 'multiple', width: 15 },
    { colKey: 'name', title: '姓名', width: 60, ellipsis: true, align: 'center' },
    {
      colKey: 'gender',
      title: '性别',
      width: 30,
      align: 'center',
      cell: (_h: any, { row }: { row: Student }) => formatGender(row.gender),
    },
    { colKey: 'no', title: '学号', width: 60, align: 'center' },
    { colKey: 'phone', title: '手机号', width: 70, ellipsis: true, align: 'center' },
    {
      colKey: 'degree',
      title: '最高学历',
      align: 'center',
      width: 50,
      cell: (_h: any, { row }: { row: Student }) => degreeMap.get(row.degree),
    },
    {
      colKey: 'updateTime',
      title: '最后更新时间',
      align: 'center',
      width: 100,
      cell: (_h: any, { row }: { row: Student }) =>
        dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    { colKey: 'violationCount', title: '违纪次数', width: 25, align: 'center' },
    { colKey: 'violationScore', title: '违纪扣分', width: 25, align: 'center' },
    {
      colKey: 'action',
      title: '操作',
      align: 'center',
      width: 80,
      cell: (_h: any, { row }: { row: Student }) => (
        <div class="flex justify-center gap-2">
          <Button size="small" onClick={() => handleEdit(row)}>
            编辑
          </Button>
          <Button size="small" theme="warning" onClick={() => handleEdit(row)}>
            违纪
          </Button>
          <Button size="small" theme="danger" variant="outline" onClick={() => handleDelete(row)}>
            删除
          </Button>
        </div>
      ),
    },
  ]

  return () => (
    <>
      <BaseCard class="mb-4">
        <Form layout="inline" class="flex flex-wrap gap-4">
          <FormItem label="班级名称">
            <Input v-model={searchParams.name} placeholder="请输入班级名称" />
          </FormItem>
          <FormItem label="学历">
            <Select
              v-model={searchParams.degree}
              options={degrees}
              placeholder="请选择学历"
              clearable
            />
          </FormItem>
          <FormItem label="班级">
            <Select
              v-model={searchParams.clazzId}
              options={clazzList.value}
              placeholder="请选择班级"
              clearable
            />
          </FormItem>
          <div class="flex gap-2">
            <Button theme="primary" onClick={getStuList}>
              查询
            </Button>
            <Button onClick={resetSearch}>清空</Button>
          </div>
        </Form>
        <div class="flex justify-left mx-4 mt-5">
          <Button theme="success" variant="base" onClick={addStudent}>
            新增学院
          </Button>
          <Button
            onClick={delStuBatch}
            style={{ marginLeft: '10px' }}
            theme="warning"
            variant="base"
          >
            批量删除
          </Button>
        </div>
      </BaseCard>

      <BaseCard>
        <t-table
          row-key="id"
          data={stuList.value}
          columns={columns}
          loading={isLoading.value}
          selected-row-keys={selectedRowKeys.value}
          onSelectChange={(keys: any[]) => (selectedRowKeys.value = keys)}
          size="medium"
          bordered
          stripe
          hover
          lazy-load
          pagination={{
            current: pagination.value.current,
            pageSize: pagination.value.pageSize,
            total: pagination.value.total,
            showJumper: true,
            onChange: handlePageChange,
          }}
        />
      </BaseCard>

      {/* 通用弹窗 */}
      <Dialog
        visible={dialogVisible.value}
        width="800px"
        onClose={() => (dialogVisible.value = false)}
        footer={() => (
          <>
            <Button onClick={() => (dialogVisible.value = false)}>取消</Button>
            <Button theme="primary" onClick={saveStudent}>
              保存
            </Button>
          </>
        )}
      >
        <Form
          rules={rules}
          ref={formRef}
          data={form}
          label-width="100px"
          reset-type="empty"
          class="flex flex-wrap gap-x-6 gap-y-4"
          status-icon
        >
          <FormItem label="姓名" name="name" class="w-[calc(50%-12px)]">
            <Input
              v-model={form.name}
              placeholder="请输入姓名"
              maxcharacter={20}
              showLimitNumber
              allowInputOverMax={false}
            />
          </FormItem>

          <FormItem label="学号" name="no" class="w-[calc(50%-12px)]">
            <Input
              v-model={form.no}
              placeholder="请输入学号"
              maxlength={10}
              showLimitNumber
              allowInputOverMax={false}
            />
          </FormItem>

          <FormItem label="性别" name="gender" class="w-[calc(50%-12px)]">
            <Select v-model={form.gender} options={genders} placeholder="请选择性别" clearable />
          </FormItem>

          <FormItem label="手机号" name="phone" class="w-[calc(50%-12px)]">
            <Input
              v-model={form.phone}
              placeholder="请输入手机号"
              maxlength={11}
              showLimitNumber
              allowInputOverMax={false}
            />
          </FormItem>

          <FormItem label="身份证号" name="idCard" class="w-[calc(50%-12px)]">
            <Input
              v-model={form.idCard}
              placeholder="请输入身份证号"
              maxlength={18}
              showLimitNumber
              allowInputOverMax={false}
            />
          </FormItem>

          <FormItem label="是否院校" name="isCollege" class="w-[calc(50%-12px)]">
            <Select
              v-model={form.isCollege}
              options={[
                { label: '是', value: 1 },
                { label: '否', value: 0 },
              ]}
              placeholder="请选择"
              clearable
            />
          </FormItem>

          <FormItem label="联系地址" name="address" class="w-[calc(50%-12px)]">
            <Input
              v-model={form.address}
              placeholder="请输入联系地址"
              maxcharacter={50}
              showLimitNumber
              allowInputOverMax={false}
            />
          </FormItem>

          <FormItem label="学历" name="degree" class="w-[calc(50%-12px)]">
            <Select v-model={form.degree} options={degrees} placeholder="请选择学历" clearable />
          </FormItem>

          <FormItem label="毕业时间" name="graduationDate" class="w-[calc(50%-12px)]">
            <DatePicker v-model={form.graduationDate} placeholder="请选择毕业时间" />
          </FormItem>

          <FormItem label="班级" name="clazzId" class="w-[calc(50%-12px)]">
            <Select
              v-model={form.clazzId}
              options={clazzList.value}
              placeholder="请选择班级"
              clearable
            />
          </FormItem>
        </Form>
      </Dialog>
    </>
  )
})
