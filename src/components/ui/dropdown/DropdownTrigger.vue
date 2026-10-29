<script setup>
import { useDropdownContext } from './useDropdown'

const { isOpen, triggerRef, triggerId, contentId, toggle, open, focusFirst, focusLast } = useDropdownContext()

defineProps({
  // Если true — слот рендерится без обёртки (asChild pattern из shadcn). Слот должен содержать ровно один элемент.
  asChild: { type: Boolean, default: false },
})

const onKeydown = (e) => {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    open()
    focusFirst()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    open()
    focusLast()
  }
}
</script>

<template>
  <button
    v-if="!asChild"
    :id="triggerId"
    ref="triggerRef"
    type="button"
    aria-haspopup="menu"
    :aria-expanded="isOpen"
    :aria-controls="contentId"
    class="dropdown-trigger"
    @click="toggle"
    @keydown="onKeydown"
  >
    <slot />
  </button>

  <!-- asChild: пробрасываем биндинги пользователю через scoped slot props -->
  <slot
    v-else
    :ref="(el) => (triggerRef = el?.$el ?? el)"
    :props="{
      id: triggerId,
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
      'aria-controls': contentId,
      onClick: toggle,
      onKeydown,
    }"
  />
</template>
