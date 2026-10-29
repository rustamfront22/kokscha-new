<template>
  <section class="rail" :aria-labelledby="headingId">
    <div class="container">
      <SectionHeader :eyebrow="eyebrow" :title="title || t('New models')" :lead="lead" align="split" :title-id="headingId">
        <template #actions>
          <div class="rail__controls">
            <RouterLink v-if="showCatalogLink" :to="{ name: 'products' }" class="btn btn--link rail__all">
              {{ t("View all models") }}
            </RouterLink>
            <button class="rail__btn" type="button" :aria-label="t('Previous')" :disabled="atStart" @click="scrollBy(-1)">
              <UiIcon name="arrow-left" />
            </button>
            <button class="rail__btn" type="button" :aria-label="t('Next')" :disabled="atEnd" @click="scrollBy(1)">
              <UiIcon name="arrow-right" />
            </button>
          </div>
        </template>
      </SectionHeader>
    </div>

    <div class="rail__viewport">
      <ul v-if="loading" class="rail__track" aria-hidden="true">
        <li v-for="n in 4" :key="n" class="rail__item">
          <div class="skeleton rail__skeleton" />
        </li>
      </ul>
      <ul v-else ref="track" class="rail__track" tabindex="0" :aria-label="title || t('New models')" @scroll.passive="updateEdges">
        <li v-for="item in list" :key="item.id" class="rail__item">
          <Card :data="item" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Card from "../product/Card.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { useProductStore } from "@/store/product.js";

// Горизонтальная лента моделей на scroll-snap (вместо vue3-carousel).
// Без items показывает последние добавленные модели из каталога.
const props = defineProps({
  items: { type: Array, default: null },
  title: { type: String, default: "" },
  eyebrow: { type: String, default: "" },
  lead: { type: String, default: "" },
  limit: { type: Number, default: 10 },
  showCatalogLink: { type: Boolean, default: true },
});

const { t } = useI18n();
const store = useProductStore();
const headingId = `rail-${Math.random().toString(36).slice(2, 8)}`;

const track = ref(null);
const atStart = ref(true);
const atEnd = ref(false);

const list = computed(() => props.items ?? store.latest(props.limit));
const loading = computed(() => !props.items && store.isLoading);

const updateEdges = () => {
  const el = track.value;
  if (!el) return;
  atStart.value = el.scrollLeft <= 4;
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
};

const scrollBy = (dir) => {
  const el = track.value;
  if (!el) return;
  const item = el.querySelector(".rail__item");
  const step = item ? item.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
  el.scrollBy({ left: dir * step * Math.max(1, Math.floor(el.clientWidth / step)), behavior: "smooth" });
};

watch(list, () => nextTick(updateEdges));

onMounted(() => {
  if (!props.items) store.fetchProducts().catch(() => {});
  nextTick(updateEdges);
  window.addEventListener("resize", updateEdges, { passive: true });
});

onBeforeUnmount(() => window.removeEventListener("resize", updateEdges));
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.rail__controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.rail__all {
  margin-right: var(--space-4);
}

.rail__btn {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease);

  &:hover:not(:disabled) {
    background: var(--c-graphite);
    border-color: var(--c-graphite);
    color: var(--c-ivory);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  @include down(md) {
    display: none;
  }
}

.rail__viewport {
  /* Выравниваем первую карточку по контейнеру, а ленту пускаем до края экрана */
  --rail-pad: max(var(--gutter), calc((100vw - var(--container)) / 2));
}

.rail__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(220px, 72vw, 300px);
  gap: 20px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--rail-pad);
  padding: var(--space-2) var(--rail-pad) var(--space-5);
  scrollbar-width: thin;
  scrollbar-color: var(--c-sand) transparent;

  &:focus-visible {
    outline-offset: -2px;
  }

  @include up(md) {
    grid-auto-columns: clamp(260px, 30vw, 310px);
  }
}

.rail__item {
  scroll-snap-align: start;
}

.rail__skeleton {
  aspect-ratio: 3 / 5;
}
</style>
