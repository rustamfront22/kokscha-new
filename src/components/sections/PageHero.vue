<script setup>
import AppImage from "@/components/ui/AppImage.vue";

// Заголовочный блок внутренних страниц: текст слева, архитектурное фото справа.
defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, default: "" },
  lead: { type: String, default: "" },
  image: { type: String, default: "" },
  imageAlt: { type: String, default: "" },
  caption: { type: String, default: "" },
});
</script>

<template>
  <section class="page-hero">
    <div class="container page-hero__grid">
      <div class="page-hero__text">
        <slot name="before" />
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1 class="h1 page-hero__title">
          <slot name="title">{{ title }}</slot>
        </h1>
        <p v-if="lead" class="lead">{{ lead }}</p>
        <div v-if="$slots.actions" class="actions page-hero__actions">
          <slot name="actions" />
        </div>
        <slot />
      </div>

      <figure v-if="image" class="page-hero__media">
        <div class="page-hero__frame">
          <AppImage :src="image" :alt="imageAlt" eager />
        </div>
        <figcaption v-if="caption" class="page-hero__caption">{{ caption }}</figcaption>
      </figure>
      <div v-else-if="$slots.aside" class="page-hero__aside">
        <slot name="aside" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.page-hero {
  padding-block: clamp(2.5rem, 1.5rem + 4vw, 5.5rem) clamp(3rem, 2rem + 4vw, 6rem);
}

.page-hero__grid {
  display: grid;
  gap: var(--space-7);
  align-items: center;

  @include up(lg) {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: clamp(3rem, 2rem + 3vw, 6rem);
  }
}

.page-hero__text {
  display: grid;
  gap: var(--space-5);
  justify-items: start;
}

.page-hero__actions {
  margin-top: var(--space-2);
}

.page-hero__media {
  position: relative;
  margin: 0;
}

.page-hero__frame {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--surface-alt);

  @include down(lg) {
    aspect-ratio: 4 / 3;
  }
}

.page-hero__media::before {
  content: "";
  position: absolute;
  inset: var(--space-5) calc(var(--space-5) * -1) calc(var(--space-5) * -1) var(--space-5);
  border: 1px solid var(--c-oak);
  opacity: 0.45;
  z-index: -1;

  @include down(lg) {
    display: none;
  }
}

.page-hero__caption {
  margin-top: var(--space-3);
  font-size: var(--fs-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}
</style>
