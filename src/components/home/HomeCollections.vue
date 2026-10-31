<template>
  <section id="collections" class="collections" aria-labelledby="collections-title">
    <div class="container">
      <header class="collections__head" v-reveal>
        <div>
          <p class="label-mono">{{ t("Collections") }}</p>
          <h2 id="collections-title" class="display">
            {{ t("Choose") }} <em>{{ t("your collection") }}</em>
          </h2>
        </div>
        <RouterLink :to="{ name: 'products' }" class="btn btn--outline">
          {{ t("View all models") }} · {{ store.products.length || "" }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </RouterLink>
      </header>

      <ul v-if="store.isLoading" class="collections__grid" aria-hidden="true">
        <li v-for="n in 5" :key="n" class="tile tile--skeleton skeleton" :class="`tile--${n}`" />
      </ul>

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

      <ul v-else class="collections__grid">
        <li v-for="(cat, i) in items" :key="cat.name" class="tile" :class="`tile--${i + 1}`" v-reveal="(i % 3) * 80">
          <RouterLink :to="{ name: 'products', query: { cat: cat.name } }" class="tile__link">
            <div class="tile__media">
              <img :src="cat.cover" :alt="`${typeLabel(cat.name)} — ${t('Model')} ${cat.coverModel}`" loading="lazy" decoding="async" />
            </div>
            <div class="tile__body">
              <span class="label-mono">{{ String(i + 1).padStart(2, "0") }}</span>
              <h3 class="tile__title">{{ typeLabel(cat.name) }}</h3>
              <span class="tile__count">{{ t("Models: {count}", { count: cat.count }) }}</span>
            </div>
            <span class="tile__arrow" aria-hidden="true"><UiIcon name="arrow-up-right" :size="18" /></span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import { useProductStore } from "@/store/product";
import { typeLabel } from "@/utils/crmLabels";

const { t } = useI18n();
const store = useProductStore();

// Коллекции = реальные категории (type) из CRM, отсортированные по числу моделей
const items = computed(() =>
  [...store.categories]
    .sort((a, b) => b.count - a.count)
    .map((c) => {
      const cover = store.products.find((p) => p.type === c.name);
      return { ...c, cover: cover?.thumbnail, coverModel: cover?.title };
    }),
);

onMounted(() => store.fetchProducts().catch(() => {}));
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.collections {
  padding-block: var(--section-y);
  background: var(--c-ivory);
}

.collections__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-5);
  margin-bottom: var(--space-7);

  > div {
    display: grid;
    gap: var(--space-4);
  }
}

/* Асимметричная сетка: первая коллекция крупно, остальные — разного масштаба */
.collections__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);

  @include up(lg) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-auto-rows: minmax(150px, auto);
    gap: var(--space-4);
  }
}

.tile {
  min-width: 0;

  &--1 {
    grid-column: span 2;
  }

  // 7 коллекций: крупная слева, 2×2 справа, две широкие снизу; лишние — по 3 колонки
  @include up(lg) {
    grid-column: span 3;
    grid-row: span 2;

    &--1 {
      grid-column: 1 / span 6;
      grid-row: span 4;
    }

    &--6,
    &--7 {
      grid-column: span 6;
    }
  }
}

.tile--skeleton {
  min-height: 260px;
  border-radius: 6px;
}

.tile__link {
  position: relative;
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
  min-height: 240px;
  overflow: hidden;
  border-radius: 6px;
  background: linear-gradient(180deg, #efe8dc 0%, #e4d9c8 100%);
  transition: background-color var(--dur) var(--ease);
}

.tile__media {
  display: grid;
  place-items: end center;
  padding: 10% 18% 0;
  overflow: hidden;

  img {
    width: 100%;
    max-height: 100%;
    aspect-ratio: 9 / 16;
    object-fit: contain;
    object-position: center bottom;
    mix-blend-mode: multiply;
    transition: transform 900ms var(--ease-out);
  }
}

.tile--1 .tile__media {
  padding: 8% 28% 0;
}

.tile__link:hover .tile__media img {
  transform: translateY(-6px) scale(1.03);
}

.tile__body {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4);
}

.tile__title {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.875rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.tile--1 .tile__title {
  font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.75rem);
  font-weight: 300;
}

.tile__count {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.tile__arrow {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.tile__link:hover .tile__arrow {
  background: var(--c-graphite);
  color: var(--c-ivory);
  transform: rotate(45deg);
}
</style>
