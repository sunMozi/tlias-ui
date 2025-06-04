import { defineComponent, type PropType } from 'vue'

type ButtonType = 'primary' | 'default' | 'danger'

export default defineComponent({
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'default',
    },
    onClick: Function as PropType<() => void>,
  },
  setup(props, { slots }) {
    return () => (
      <button class={`btn btn-${props.type}`} onClick={props.onClick}>
        {slots.default?.() || 'Button'}
      </button>
    )
  },
})
