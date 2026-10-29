import { ref, provide, inject } from 'vue'

export const DropdownKey = Symbol('Dropdown')

let uid = 0
const nextId = (prefix) => `${prefix}-${++uid}`

export function useDropdownProvider() {
  const isOpen = ref(false)
  const triggerRef = ref(null)
  const contentRef = ref(null)
  const triggerId = nextId('dropdown-trigger')
  const contentId = nextId('dropdown-content')

  const open = () => { isOpen.value = true }
  const close = () => {
    isOpen.value = false
    // вернуть фокус на триггер при закрытии — стандартное поведение меню
    triggerRef.value?.focus()
  }
  const toggle = () => { isOpen.value ? close() : open() }

  const getItems = () => {
    if (!contentRef.value) return []
    return Array.from(
      contentRef.value.querySelectorAll('[role="menuitem"]:not([data-disabled])')
    )
  }

  const focusFirst = () => {
    requestAnimationFrame(() => getItems()[0]?.focus())
  }
  const focusLast = () => {
    requestAnimationFrame(() => {
      const items = getItems()
      items[items.length - 1]?.focus()
    })
  }
  const focusNext = () => {
    const items = getItems()
    const idx = items.indexOf(document.activeElement)
    items[(idx + 1) % items.length]?.focus()
  }
  const focusPrev = () => {
    const items = getItems()
    const idx = items.indexOf(document.activeElement)
    items[(idx - 1 + items.length) % items.length]?.focus()
  }

  const ctx = {
    isOpen, triggerRef, contentRef, triggerId, contentId,
    open, close, toggle,
    focusFirst, focusLast, focusNext, focusPrev,
  }

  provide(DropdownKey, ctx)
  return ctx
}

export function useDropdownContext() {
  const ctx = inject(DropdownKey)
  if (!ctx) throw new Error('Dropdown components must be used within <Dropdown>')
  return ctx
}
