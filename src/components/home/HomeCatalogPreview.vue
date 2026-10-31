<template>
  <section id="catalog-preview" class="cp" aria-labelledby="cp-title">
    <div class="container">
      <header class="cp__head" v-reveal>
        <div>
          <p class="label-mono">{{ t("Catalog") }}</p>
          <h2 id="cp-title" class="display">
            {{ t("Find") }} <em>{{ t("your model") }}</em>
          </h2>
        </div>
        <p class="cp__count" aria-live="polite">
          {{ store.status === "success" ? t("Models found: {count}", { count: filtered.length }) : "" }}
        </p>
      </header>

      <div class="cp__controls">
        <div class="cp__chips" role="group" :aria-label="t('Categories')">
          <button class="chip" type="button" :aria-pressed="!cat" @click="selectCat(null)">
            {{ t("All models") }} <span class="chip__count">{{ store.products.length }}</span>
          </button>
          <button
            v-for="c in store.categories"
            :key="c.name"
            class="chip"
            type="button"
            :aria-pressed="cat === c.name"
            @click="selectCat(c.name)"
          >
            {{ typeLabel(c.name) }} <span class="chip__count">{{ c.count }}</span>
          </button>
        </div>
        <div class="cp__selects">
          <label class="cp__select">
            <span class="sr-only">{{ t("Style") }}</span>
            <select v-model="style" class="select" :disabled="!styleOptions.length">
              <option value="">{{ t("All styles") }}</option>
              <option v-for="s in styleOptions" :key="s" :value="s">{{ styleLabel(s) }}</option>
            </select>
          </label>
          <label class="cp__select">
            <span class="sr-only">{{ t("Sort") }}</span>
            <select v-model="sort" class="select">
              <option value="new">{{ t("Newest first") }}</option>
              <option value="model-asc">{{ t("Model number: ascending") }}</option>
              <option value="model-desc">{{ t("Model number: descending") }}</option>
            </select>
          </label>
          <button v-if="cat || style || sort !== 'new'" class="btn btn--ghost btn--sm" type="button" @click="reset">
            <UiIcon name="close" :size="16" />
            {{ t("Reset filters") }}
          </button>
        </div>
      </div>

      <div v-if="store.isLoading" class="cp__grid" aria-hidden="true">
        <div v-for="n in 4" :key="n" class="skeleton cp__sk" />
      </div>
      <p v-if="store.isLoading" class="sr-only" role="status">{{ t("Loading…") }}</p>

      <StateMessage
        v-else-if="store.status === 'error'"
        type="error"
        :title="t('Failed to load the catalog')"
        :text="t('Please check your connection and try again.')"
      >
        <button class="btn btn--primary" type="button" @click="store.fetchProducts({ force: true }).catch(() => {})">
          {{ t("Try again") }}
        </button>
      </StateMessage>

      <StateMessage
        v-else-if="!filtered.length"
        type="empty"
        :title="t('No models found')"
        :text="t('Try changing the filters or view the full catalog.')"
      >
        <button class="btn btn--primary" type="button" @click="reset">{{ t("Reset filters") }}</button>
      </StateMessage>

      <ul v-else class="cp__grid">
        <li v-for="item in filtered.slice(0, 8)" :key="item.id">
          <Card :data="item" />
        </li>
      </ul>

      <div v-if="store.status === 'success' && filtered.length" class="cp__more">
        <RouterLink :to="catalogLink" class="btn btn--primary btn--lg">
          {{ filtered.length > 8 ? t("Show all {count} models", { count: filtered.length }) : t("Open the catalog") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Card from "@/components/views/product/Card.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import { useProductStore } from "@/store/product";
import { typeLabel, styleLabel } from "@/utils/crmLabels";

const { t } = useI18n();
const store = useProductStore();

const cat = ref(null);
const style = ref("");
const sort = ref("new");

const inCat = computed(() => (cat.value ? store.products.filter((p) => p.type === cat.value) : store.products));
const styleOptions = computed(() => [...new Set(inCat.value.map((p) => p.style).filter(Boolean))]);

// Цен в CRM нет, поэтому сортировка — по новизне (id) и номеру модели
const filtered = computed(() => {
  const list = style.value ? inCat.value.filter((p) => p.style === style.value) : [...inCat.value];
  const num = (p) => Number(p.title) || 0;
  if (sort.value === "new") list.sort((a, b) => Number(b.id) - Number(a.id));
  if (sort.value === "model-asc") list.sort((a, b) => num(a) - num(b));
  if (sort.value === "model-desc") list.sort((a, b) => num(b) - num(a));
  return list;
});

// Полный каталог открывается с теми же фильтрами (?cat= и ?style= уже поддерживаются страницей)
const catalogLink = computed(() => {
  const query = {};
  if (cat.value) query.cat = cat.value;
  if (style.value) query.style = style.value;
  return { name: "products", query };
});

const selectCat = (value) => {
  cat.value = value;
};

watch(cat, () => {
  if (style.value && !styleOptions.value.includes(style.value)) style.value = "";
});

const reset = () => {
  cat.value = null;
  style.value = "";
  sort.value = "new";
};

onMounted(() => store.fetchProducts().catch(() => {}));
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.cp {
  padding-block: var(--section-y);
  background: var(--c-ivory);
}

.cp__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  > div {
    display: grid;
    gap: var(--space-4);
  }
}

.cp__count {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.cp__controls {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-6);

  @include up(xl) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
}

.cp__chips {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  scrollbar-width: none;
  padding-block: 2px;
  mask-image: linear-gradient(90deg, #000 calc(100% - 40px), transparent); // подсказка, что ряд прокручивается

  &::-webkit-scrollbar {
    display: none;
  }
}

.cp__selects {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.cp__select {
  flex: 1 1 180px;

  .select {
    min-height: 42px;
    font-size: var(--fs-sm);
    background-color: transparent;
    border-radius: var(--radius-pill);
  }
}

.cp__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }

  @include up(xl) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.cp__sk {
  aspect-ratio: 3 / 5;
}

.cp__more {
  display: flex;
  justify-content: center;
  margin-top: var(--space-7);
}
</style>
