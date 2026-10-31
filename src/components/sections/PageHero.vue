<script setup>
import AppImage from "@/components/ui/AppImage.vue";

// Первый экран внутренних страниц в стиле главной («цифровой шоурум»):
// тёмная сцена, приглушённое фото фоном, само фото — в арочной раме справа.
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
  <section class="page-hero theme-dark">
    <div v-if="image" class="page-hero__backdrop" :style="{ backgroundImage: `url(${image})` }" aria-hidden="true" />

    <div class="container page-hero__grid">
      <div class="page-hero__text">
        <slot name="before" />
        <p v-if="eyebrow" class="eyebrow page-hero__eyebrow">{{ eyebrow }}</p>
        <h1 class="display page-hero__title">
          <slot name="title">{{ title }}</slot>
        </h1>
        <p v-if="lead" class="page-hero__lead">{{ lead }}</p>
        <div v-if="$slots.actions" class="actions page-hero__actions">
          <slot name="actions" />
        </div>
        <slot />
      </div>

      <figure v-if="image" class="page-hero__media">
        <div class="page-hero__frame">
          <AppImage :src="image" :alt="imageAlt" eager />
        </div>
        <figcaption v-if="caption" class="label-mono page-hero__caption">{{ caption }}</figcaption>
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
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: calc(var(--header-h) + clamp(2.5rem, 1.5rem + 4vw, 5rem));
  padding-bottom: clamp(3.5rem, 2rem + 5vw, 7rem);
}

.page-hero__backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  opacity: 0.16;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background:
      linear-gradient(90deg, var(--c-graphite-deep) 0%, rgba(22, 21, 19, 0.7) 60%, rgba(22, 21, 19, 0.85) 100%),
      linear-gradient(0deg, var(--c-graphite-deep) 0%, transparent 40%);
  }
}

.page-hero__grid {
  display: grid;
  gap: var(--space-7);
  align-items: center;

  @include up(lg) {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
    gap: var(--space-8);
  }
}

.page-hero__text {
  display: grid;
  gap: var(--space-5);
  justify-items: start;
  animation: hero-rise var(--dur-slow) var(--ease-out) both;
}

.page-hero__title {
  max-width: 16ch;

  &:lang(zh) {
    max-width: 14em;
  }
}

.page-hero__lead {
  max-width: 52ch;
  font-size: var(--fs-lead);
  color: var(--text-muted);
}

.page-hero__actions {
  margin-top: var(--space-2);

  @include down(sm) {
    width: 100%;

    :deep(.btn) {
      flex: 1 1 100%;
    }
  }
}

.page-hero__media {
  margin: 0;
  display: grid;
  gap: var(--space-3);
  justify-items: center;
  animation: hero-rise 900ms var(--ease-out) 150ms both;
}

// Арочная рама — тот же мотив, что и ниши с дверями на главной
.page-hero__frame {
  width: min(100%, 380px);
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 999px 999px 6px 6px;
  background: var(--surface);
  box-shadow: 0 40px 120px -40px rgba(212, 174, 126, 0.35);

  @include down(lg) {
    width: min(100%, 520px);
    aspect-ratio: 4 / 3;
    border-radius: 6px;
  }
}

.page-hero__caption {
  color: var(--text-muted);
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-hero__text,
  .page-hero__media {
    animation: none;
  }
}
</style>
