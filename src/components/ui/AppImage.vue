<script setup>
import { ref, watch } from "vue";
import UiIcon from "./UiIcon.vue";

// Изображение с ленивой загрузкой и аккуратной заглушкой.
// При ошибке показываем встроенный плейсхолдер (без повторных запросов —
// прежний вариант подставлял несуществующий /no-image.png и мог зацикливаться).
const props = defineProps({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  fit: { type: String, default: "cover" }, // cover | contain
  eager: { type: Boolean, default: false },
  sizes: { type: String, default: undefined },
  width: { type: [Number, String], default: undefined },
  height: { type: [Number, String], default: undefined },
  fallbackLabel: { type: String, default: "" },
});

const failed = ref(!props.src);
const loaded = ref(false);

watch(
  () => props.src,
  (src) => {
    failed.value = !src;
    loaded.value = false;
  },
);
</script>

<template>
  <div class="app-image" :class="[`app-image--${fit}`, { 'is-loaded': loaded }]">
    <img
      v-if="!failed"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
      :sizes="sizes"
      :width="width"
      :height="height"
      @load="loaded = true"
      @error="failed = true"
    />
    <div v-else class="app-image__fallback" role="img" :aria-label="alt || fallbackLabel">
      <UiIcon name="door" :size="36" :stroke-width="1.2" />
      <span v-if="fallbackLabel">{{ fallbackLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.app-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.app-image img {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out);
}

.app-image.is-loaded img {
  opacity: 1;
}

.app-image--cover img {
  object-fit: cover;
}

.app-image--contain img {
  object-fit: contain;
}

.app-image__fallback {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: var(--space-2);
  color: var(--c-oak);
  background: var(--surface-alt);
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
