<template>
  <div class="product-page theme-dark">
    <div v-if="store.isLoading" class="container product-page__loading" aria-hidden="true">
      <div class="skeleton product-page__sk-image" />
      <div class="product-page__sk-text">
        <div class="skeleton" style="height: 14px; width: 30%" />
        <div class="skeleton" style="height: 56px; width: 70%" />
        <div class="skeleton" style="height: 220px" />
      </div>
    </div>
    <p v-if="store.isLoading" class="sr-only" role="status">{{ t("Loading…") }}</p>

    <div v-else-if="store.status === 'error'" class="container section">
      <StateMessage type="error" :title="t('Failed to load the catalog')" :text="t('Please check your connection and try again.')">
        <button class="btn btn--primary" type="button" @click="reload">{{ t("Try again") }}</button>
      </StateMessage>
    </div>

    <div v-else-if="!product" class="container section">
      <StateMessage type="empty" :title="t('Model not found')" :text="t('This model may have been removed or the link is incorrect.')">
        <RouterLink class="btn btn--primary" :to="{ name: 'products' }">{{ t("Back to catalog") }}</RouterLink>
      </StateMessage>
    </div>

    <CurrentCard v-else :data="product" :related="related" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import CurrentCard from "../components/views/product/CurrentCard.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import { useProductStore } from "../store/product";
import { setPageMeta } from "@/composables/usePageMeta";

const { t } = useI18n();
const route = useRoute();
const store = useProductStore();

// Модель вычисляется из реактивного route.params — при переходе на «похожую»
// модель страница обновляется (раньше params деструктурировался один раз в setup).
const product = computed(() => (store.status === "success" ? store.findById(route.params.id) : null));
const related = computed(() => store.related(product.value, 10));

watch(
  [product, () => t("Model"), () => store.status],
  ([p, modelLabel]) => {
    if (p) {
      setPageMeta({
        title: `${modelLabel} ${p.title}${p.type ? ` · ${p.type}` : ""}`,
        description: p.description || [p.type, p.style, p.color].filter(Boolean).join(", "),
      });
    } else if (store.status === "success") {
      setPageMeta({ title: t("Model not found") });
    }
  },
  { immediate: true },
);

const reload = () => store.fetchProducts({ force: true }).catch(() => {});

onMounted(() => {
  store.fetchProducts().catch(() => {});
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.product-page {
  min-height: 70vh;
}

// Состояния загрузки / ошибки / «не найдено» — под прозрачной шапкой
.product-page > .container {
  padding-top: calc(var(--header-h) + var(--space-7));
}

.product-page__loading {
  display: grid;
  gap: var(--space-6);
  padding-block: var(--space-8);

  @include up(lg) {
    grid-template-columns: 1fr 1fr;
  }
}

.product-page__sk-image {
  aspect-ratio: 4 / 5;
}

.product-page__sk-text {
  display: grid;
  gap: var(--space-4);
  align-content: start;
}
</style>
