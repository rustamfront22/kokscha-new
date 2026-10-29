<template>
  <a class="skip-link" href="#main">{{ t("Skip to content") }}</a>
  <div class="layout">
    <Header />
    <main id="main" class="main" :class="{ 'main--under-header': !route.meta.overlayHeader }" tabindex="-1">
      <RouterView />
    </main>
    <Footer />
    <CallbackWidget />
  </div>
</template>

<script setup>
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Header from "@/components/partials/Header.vue";
import Footer from "@/components/partials/Footer.vue";
import CallbackWidget from "@/components/partials/CallbackWidget.vue";
import { applyDocumentMeta, metaOverride } from "@/composables/usePageMeta";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();

// Сброс переопределений до того, как новая страница выставит свои (например, название модели).
router.beforeEach((to, from) => {
  if (to.fullPath !== from.fullPath) metaOverride.value = null;
});

// Заголовок, description, Open Graph и <html lang> — по маршруту и выбранному языку.
watch(
  [() => route.name, locale, metaOverride],
  () => {
    const override = metaOverride.value || {};
    applyDocumentMeta({
      title: override.title ?? (route.meta.title ? t(route.meta.title) : ""),
      description: override.description ?? (route.meta.description ? t(route.meta.description) : ""),
      locale: locale.value,
    });
  },
  { immediate: true },
);
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  outline: none;
}

.main--under-header {
  padding-top: var(--header-h);
}
</style>
