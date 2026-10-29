<script setup>
// Нумерованные этапы работы. steps: [{ title, text }] — уже переведённые строки.
defineProps({
  steps: { type: Array, default: () => [] },
  columns: { type: Number, default: 4 },
});
</script>

<template>
  <ol class="steps" :style="{ '--cols': columns }">
    <li v-for="(step, i) in steps" :key="i" class="steps__item" v-reveal="i * 80">
      <span class="steps__num">{{ String(i + 1).padStart(2, "0") }}</span>
      <h3 class="steps__title h4">{{ step.title }}</h3>
      <p v-if="step.text" class="steps__text">{{ step.text }}</p>
    </li>
  </ol>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.steps {
  display: grid;
  gap: 0;
  counter-reset: step;

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include up(lg) {
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  }
}

.steps__item {
  position: relative;
  display: grid;
  align-content: start;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-5) var(--space-6) 0;
  border-top: 1px solid var(--border-strong);

  @include up(md) {
    padding-right: var(--space-6);
  }
}

.steps__num {
  font-family: var(--font-display);
  font-size: 2.5rem;
  line-height: 1;
  color: var(--accent);
}

.steps__text {
  color: var(--text-muted);
  font-size: var(--fs-sm);
}

:global(.section--dark) .steps__item {
  border-color: rgba(243, 238, 230, 0.2);
}

:global(.section--dark) .steps__text {
  color: var(--text-on-dark-muted);
}
</style>
