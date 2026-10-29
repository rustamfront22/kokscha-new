<script setup>
import UiIcon from "./UiIcon.vue";

defineProps({
  type: { type: String, default: "empty" }, // loading | error | empty
  title: { type: String, default: "" },
  text: { type: String, default: "" },
});
</script>

<template>
  <div
    class="state"
    :class="`state--${type}`"
    :role="type === 'error' ? 'alert' : 'status'"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    <span class="state__icon" aria-hidden="true">
      <span v-if="type === 'loading'" class="spinner" />
      <UiIcon v-else :name="type === 'error' ? 'refresh' : 'door'" :size="28" :stroke-width="1.3" />
    </span>
    <p v-if="title" class="state__title h3">{{ title }}</p>
    <p v-if="text" class="state__text">{{ text }}</p>
    <div v-if="$slots.default" class="state__actions actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.state {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding: clamp(3rem, 2rem + 4vw, 5rem) var(--space-5);
  text-align: center;
  border: 1px solid var(--border);
  background: var(--surface);
}

.state__icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: var(--space-2);
  border-radius: 50%;
  color: var(--accent-ink);
  background: var(--surface-alt);
}

.state--error .state__icon {
  color: var(--c-error);
}

.state__text {
  max-width: 46ch;
  color: var(--text-muted);
}

.state__actions {
  margin-top: var(--space-3);
  justify-content: center;
}
</style>
