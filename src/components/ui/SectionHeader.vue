<script setup>
defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, default: "" },
  lead: { type: String, default: "" },
  as: { type: String, default: "h2" },
  align: { type: String, default: "start" }, // start | center | split
  size: { type: String, default: "h2" }, // display | h1 | h2 | h3
  titleId: { type: String, default: undefined },
});
</script>

<template>
  <header
    class="section-head"
    :class="{ 'section-head--center': align === 'center', 'section-head--split': align === 'split' }"
  >
    <div class="section-head__text">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <component :is="as" :id="titleId" :class="size">
        <slot name="title">{{ title }}</slot>
      </component>
      <p v-if="lead" class="lead">{{ lead }}</p>
    </div>
    <div v-if="$slots.actions" class="section-head__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.section-head__text {
  display: grid;
  gap: var(--space-4);
}

.section-head--center .section-head__text {
  justify-items: center;
}

.section-head--center .lead {
  margin-inline: auto;
}
</style>
