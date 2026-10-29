<script setup>
import { useDropdownContext } from './useDropdown'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  // Закрывать ли dropdown после клика. По умолчанию true.
  closeOnSelect: { type: Boolean, default: true },
  inset: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])
const { close } = useDropdownContext()

const onClick = (e) => {
  if (props.disabled) return
  emit('select', e)
  if (props.closeOnSelect) close()
}

const onKeydown = (e) => {
  if (props.disabled) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('select', e)
    if (props.closeOnSelect) close()
  }
}
</script>

<template>
  <div
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :data-disabled="disabled || undefined"
    :aria-disabled="disabled || undefined"
    :class="['dropdown-item', inset && 'dropdown-item--inset']"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
