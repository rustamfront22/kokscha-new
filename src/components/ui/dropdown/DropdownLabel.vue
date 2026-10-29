<script setup>
defineProps({
  inset: { type: Boolean, default: false },
})
</script>

<template>
  <div :class="['dropdown-label', inset && 'dropdown-item--inset']">
    <slot />
  </div>
</template>
