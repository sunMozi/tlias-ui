import { DialogPlugin, MessagePlugin, Form, FormItem, InputNumber } from 'tdesign-vue-next'
import { ref, h } from 'vue'
import { putViolation } from '@/api/stu'

export const disciplineDialog = (row: any, onSuccess?: () => void) => {
  const formRef = ref()
  const score = ref<number>(0)

  let dialogInstance: any = null

  dialogInstance = DialogPlugin.confirm({
    header: '违纪处理',
    theme: 'warning',
    confirmBtn: '确认处理',
    cancelBtn: '取消',
    body: () =>
      h(
        Form,
        {
          ref: formRef,
          model: { score: score.value },
          labelWidth: '80px',
        },
        () => [
          h(
            FormItem,
            {
              label: '扣分分数',
              name: 'score',
            },
            () =>
              h(InputNumber, {
                modelValue: score.value,
                'onUpdate:modelValue': (val: number) => (score.value = val),
                placeholder: '请输入扣分分数',
                min: 0,
                max: 100,
                theme: 'normal',
              }),
          ),
        ],
      ),
    onConfirm: async () => {
      if (score.value === 0) {
        MessagePlugin.warning('请输入扣分分数')
        return
      }
      await putViolation(row.id, score.value)
      MessagePlugin.success('违纪处理已提交')
      dialogInstance.hide()
      onSuccess?.()
    },
    onClose: () => {
      dialogInstance.hide()
    },
  })
}
