<template>
  <div class="catalog">
    <header class="catalog__head">
      <div class="container">
        <Breadcrumbs :items="[{ label: t('Home'), to: { name: 'index' } }, { label: t('Catalog') }]" />
        <div class="catalog__title-row">
          <div class="catalog__title">
            <h1 class="h1">{{ activeCategory || t("Catalog") }}</h1>
            <p class="lead">{{ t("Choose the perfect door for your project.") }}</p>
          </div>
          <p v-if="store.status === 'success'" class="catalog__found" aria-live="polite">
            {{ t("Models found: {count}", { count: filtered.length }) }}
          </p>
        </div>
      </div>
    </header>

    <div class="catalog__toolbar">
      <div class="container catalog__toolbar-inner">
        <Category
          :categories="store.categories"
          :active="activeCategory"
          :total="store.products.length"
          @select="selectCategory"
        />
        <div class="catalog__filters">
          <label class="catalog__style">
            <span class="sr-only">{{ t("Style") }}</span>
            <select class="select" :value="activeStyle || ''" :disabled="!styleOptions.length" @change="selectStyle($event.target.value)">
              <option value="">{{ t("All styles") }}</option>
              <option v-for="style in styleOptions" :key="style" :value="style">{{ style }}</option>
            </select>
          </label>
          <button v-if="hasFilters" class="btn btn--ghost btn--sm" type="button" @click="resetFilters">
            <UiIcon name="close" :size="16" />
            {{ t("Reset filters") }}
          </button>
        </div>
      </div>
    </div>

    <section class="section section--tight">
      <div class="container">
        <div v-if="store.isLoading" class="catalog__skeleton" aria-hidden="true">
          <div v-for="n in 8" :key="n" class="skeleton catalog__skeleton-card" />
        </div>
        <p v-if="store.isLoading" class="sr-only" role="status">{{ t("Loading…") }}</p>

        <StateMessage
          v-else-if="store.status === 'error'"
          type="error"
          :title="t('Failed to load the catalog')"
          :text="t('Please check your connection and try again.')"
        >
          <button class="btn btn--primary" type="button" @click="reload">{{ t("Try again") }}</button>
        </StateMessage>

        <StateMessage
          v-else-if="!filtered.length"
          type="empty"
          :title="t('No models found')"
          :text="t('Try changing the filters or view the full catalog.')"
        >
          <button class="btn btn--primary" type="button" @click="resetFilters">{{ t("Reset filters") }}</button>
        </StateMessage>

        <AllProducts v-else :items="filtered" :page-size="12" />
      </div>
    </section>

    <CtaBand
      :title="t('Do you need help choosing?')"
      :text="t('Leave a request and we will select the doors for your interior and budget.')"
      origin="catalog"
    />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Category from "../components/views/product/Category.vue";
import AllProducts from "../components/views/home/AllProducts.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import CtaBand from "@/components/sections/CtaBand.vue";
import { useProductStore } from "../store/product";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useProductStore();

// Состояние фильтров живёт в URL: ?cat= (как раньше) и необязательный ?style=.
// Читается и при первой загрузке, и при переходах — раньше ?cat= из прямой ссылки игнорировался.
const queryValue = (v) => (Array.isArray(v) ? v[0] : v) || null;
const activeCategory = computed(() => queryValue(route.query.cat));
const activeStyle = computed(() => queryValue(route.query.style));

const inCategory = computed(() =>
  activeCategory.value ? store.products.filter((p) => p.type === activeCategory.value) : store.products,
);

const styleOptions = computed(() => [...new Set(inCategory.value.map((p) => p.style).filter(Boolean))]);

const filtered = computed(() =>
  activeStyle.value ? inCategory.value.filter((p) => p.style === activeStyle.value) : inCategory.value,
);

const hasFilters = computed(() => !!(activeCategory.value || activeStyle.value));

const updateQuery = (patch) => {
  const query = { ...route.query, ...patch };
  Object.keys(query).forEach((k) => (query[k] == null || query[k] === "") && delete query[k]);
  router.push({ name: "products", query });
};

const selectCategory = (cat) => updateQuery({ cat, style: null });
const selectStyle = (style) => updateQuery({ style: style || null });
const resetFilters = () => router.push({ name: "products" });

const reload = () => store.fetchProducts({ force: true }).catch(() => {});

onMounted(() => {
  store.fetchProducts().catch(() => {});
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.catalog__head {
  padding-block: clamp(2rem, 1.5rem + 2vw, 3.5rem) var(--space-6);
}

.catalog__title-row {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-5);

  @include up(md) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
  }
}

.catalog__title {
  display: grid;
  gap: var(--space-3);
}

.catalog__found {
  font-size: var(--fs-sm);
  color: var(--text-muted);
  white-space: nowrap;
}

.catalog__toolbar {
  position: sticky;
  top: var(--header-h);
  z-index: var(--z-sticky);
  padding-block: var(--space-3);
  background: rgba(245, 241, 233, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-block: 1px solid var(--border);
}

.catalog__toolbar-inner {
  display: grid;
  gap: var(--space-3);

  @include up(lg) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--space-5);
  }
}

.catalog__filters {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.catalog__style {
  flex: 1 1 auto;

  .select {
    min-height: 40px;
    min-width: 200px;
    font-size: var(--fs-sm);
    background-color: transparent;
  }
}

.catalog__skeleton {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-5);
  }

  @include up(xl) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.catalog__skeleton-card {
  aspect-ratio: 3 / 5;
}
</style>
