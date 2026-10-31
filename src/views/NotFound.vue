<script setup>
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";

const { t } = useI18n();
</script>

<template>
  <section class="not-found theme-dark">
    <div class="container not-found__inner">
      <p class="not-found__code" aria-hidden="true">404</p>
      <h1 class="display">{{ t("Page not found") }}</h1>
      <p class="lead">{{ t("The page you are looking for does not exist or has been moved.") }}</p>
      <div class="actions">
        <RouterLink :to="{ name: 'index' }" class="btn btn--primary">
          {{ t("Go to homepage") }}
        </RouterLink>
        <RouterLink :to="{ name: 'products' }" class="btn btn--outline">
          {{ t("Catalog") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  min-height: 80vh;
  padding-top: calc(var(--header-h) + clamp(3rem, 2rem + 6vw, 8rem));
  padding-bottom: clamp(4rem, 3rem + 8vw, 10rem);
}

.not-found__inner {
  display: grid;
  gap: var(--space-5);
  justify-items: start;
  max-width: 760px;
  margin-inline: auto;
}

.not-found__code {
  font-family: var(--font-display);
  font-size: clamp(6rem, 4rem + 10vw, 12rem);
  line-height: 0.9;
  color: var(--c-oak-light);
  opacity: 0.35;
}
</style>
