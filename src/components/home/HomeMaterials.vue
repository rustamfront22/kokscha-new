<template>
  <section id="details" class="materials theme-dark" aria-labelledby="materials-title">
    <div class="container">
      <header class="materials__head" v-reveal>
        <p class="label-mono">{{ t("Materials and details") }}</p>
        <h2 id="materials-title" class="display">
          {{ t("The details") }} <em>{{ t("decide everything") }}</em>
        </h2>
      </header>

      <div class="materials__layout">
        <!-- Переключатель реальных кадров с производства -->
        <div class="materials__gallery">
          <div class="materials__photo">
            <Transition name="fade" mode="out-in">
              <img :key="current.id" :src="current.image" :alt="t(current.title)" loading="lazy" decoding="async" />
            </Transition>
          </div>
          <div class="materials__tabs" role="tablist" :aria-label="t('Materials and details')">
            <button
              v-for="(item, i) in items"
              :id="`mat-tab-${item.id}`"
              :key="item.id"
              :ref="(el) => (tabEls[i] = el)"
              type="button"
              role="tab"
              class="materials__tab"
              :aria-selected="currentIndex === i"
              :aria-controls="`mat-panel-${item.id}`"
              :tabindex="currentIndex === i ? 0 : -1"
              @click="currentIndex = i"
              @keydown="onTabKey($event, i)"
            >
              <span class="label-mono">{{ String(i + 1).padStart(2, "0") }}</span>
              {{ t(item.title) }}
            </button>
          </div>
          <p :id="`mat-panel-${current.id}`" class="materials__text" role="tabpanel" :aria-labelledby="`mat-tab-${current.id}`">
            {{ t(current.text) }}
          </p>
        </div>

        <!-- Лупа: настоящее увеличение фото модели из CRM -->
        <div class="materials__lens-block">
          <div
            ref="lensArea"
            class="lens-area"
            :class="{ 'is-pinned': lens.pinned }"
            :style="{ '--ratio': ratio }"
            tabindex="0"
            role="img"
            :aria-label="product ? `${t('Model')} ${product.title}. ${t('Move the magnifier with the mouse, touch or arrow keys.')}` : ''"
            @pointermove="onPointer"
            @pointerdown="onPointerDown"
            @pointerup="onPointerUp"
            @pointerleave="lens.visible = lens.pinned"
            @keydown="onLensKey"
            @focus="showLensCentered"
            @blur="lens.visible = false"
          >
            <img v-if="product" :src="product.thumbnail" alt="" decoding="async" draggable="false" @load="onImgLoad" />
            <span
              v-if="product && lens.visible"
              class="lens"
              :style="lensStyle"
              aria-hidden="true"
            />
          </div>
          <p class="lens-caption">
            <UiIcon name="expand" :size="16" />
            {{ coarse ? t("Tap the photo to zoom in, drag to move, tap again to close.") : t("Move the magnifier with the mouse, touch or arrow keys.") }}
            <span v-if="product" class="text-muted">· {{ t("Model") }} {{ product.title }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import { useProductStore } from "@/store/product";
import { useConfigurator } from "@/composables/useConfigurator";

const { t } = useI18n();
const store = useProductStore();
const { product } = useConfigurator();

// Формулировки — из существующего контента компании (companyContent / страница «Сотрудничество»)
const items = [
  { id: "finish", image: "/media/finishing.jpg", title: "PVC veneer, enamel, patina", text: "Free materials and decor description" },
  { id: "decor", image: "/media/door-detail.jpg", title: "Wide range of decor", text: "Wide range of decor description" },
  { id: "build", image: "/media/workshop.jpg", title: "Reliability", text: "Reliability description" },
];
const currentIndex = ref(0);
const current = computed(() => items[currentIndex.value]);
const tabEls = ref([]);

const onTabKey = (e, i) => {
  const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
  if (!(e.key in map)) return;
  e.preventDefault();
  const next = (i + map[e.key] + items.length) % items.length;
  currentIndex.value = next;
  tabEls.value[next]?.focus();
};

/* ---------- Лупа ---------- */
const ZOOM = 2.6;
const LENS = 160;
const lensArea = ref(null);
const lens = reactive({ x: 0.5, y: 0.45, visible: false, pinned: false });
// Рамка повторяет реальные пропорции фото — иначе увеличение не совпадёт с изображением
const ratio = ref(0.45);
const onImgLoad = (e) => {
  const { naturalWidth: w, naturalHeight: h } = e.target;
  if (w && h) ratio.value = w / h;
};

const lensStyle = computed(() => {
  const el = lensArea.value;
  if (!el) return {};
  const w = el.clientWidth;
  const h = el.clientHeight;
  const px = lens.x * w;
  const py = lens.y * h;
  return {
    width: `${LENS}px`,
    height: `${LENS}px`,
    left: `${px - LENS / 2}px`,
    top: `${py - LENS / 2}px`,
    backgroundImage: `url(${product.value?.thumbnail})`,
    backgroundSize: `${w * ZOOM}px ${h * ZOOM}px`,
    backgroundPosition: `${-(px * ZOOM - LENS / 2)}px ${-(py * ZOOM - LENS / 2)}px`,
  };
});

// Сенсорный экран: страница прокручивается свайпом по фото как обычно (touch-action: pan-y).
// Касание без сдвига открывает лупу в этой точке, дальше её можно водить пальцем
// (в этом режиме touch-action: none), повторное касание закрывает.
const coarse = typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;
let touchStart = null;

const moveLens = (e) => {
  const rect = lensArea.value.getBoundingClientRect();
  lens.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  lens.y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
};

const onPointer = (e) => {
  if (e.pointerType === "mouse") {
    moveLens(e);
    lens.visible = true;
    return;
  }
  if (lens.pinned) moveLens(e);
};

const onPointerDown = (e) => {
  if (e.pointerType === "mouse") return onPointer(e);
  touchStart = { x: e.clientX, y: e.clientY, at: Date.now() };
  if (lens.pinned) moveLens(e);
};

const onPointerUp = (e) => {
  if (e.pointerType === "mouse" || !touchStart) return;
  const moved = Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y);
  const tap = moved < 10 && Date.now() - touchStart.at < 400;
  touchStart = null;
  if (!tap) return;
  if (lens.pinned) {
    lens.pinned = false;
    lens.visible = false;
  } else {
    moveLens(e);
    lens.pinned = true;
    lens.visible = true;
  }
};

const showLensCentered = () => {
  lens.visible = true;
};

const onLensKey = (e) => {
  const step = e.shiftKey ? 0.1 : 0.04;
  const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
  if (e.key === "Escape") {
    lens.visible = false;
    return;
  }
  if (!(e.key in moves)) return;
  e.preventDefault();
  lens.visible = true;
  lens.x = Math.min(1, Math.max(0, lens.x + moves[e.key][0]));
  lens.y = Math.min(1, Math.max(0, lens.y + moves[e.key][1]));
};

onMounted(() => store.fetchProducts().catch(() => {}));
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.materials {
  padding-block: var(--section-y);
}

.materials__head {
  display: grid;
  gap: var(--space-4);
  margin-bottom: var(--space-7);
}

.materials__layout {
  display: grid;
  gap: var(--space-7);

  @include up(lg) {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
    gap: var(--space-8);
    align-items: start;
  }
}

.materials__gallery {
  display: grid;
  gap: var(--space-5);
}

.materials__photo {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 6px;
  background: var(--surface);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.materials__tabs {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--border);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.materials__tab {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-4) var(--space-4) 0;
  text-align: left;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--text-muted);
  border-top: 2px solid transparent;
  margin-top: -1px;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);

  &:hover {
    color: var(--text);
  }

  &[aria-selected="true"] {
    color: var(--text);
    border-top-color: var(--c-oak-light);
  }
}

.materials__text {
  max-width: 60ch;
  font-size: var(--fs-lead);
  color: var(--text-muted);
}

.materials__lens-block {
  display: grid;
  gap: var(--space-3);
}

.lens-area {
  position: relative;
  aspect-ratio: var(--ratio);
  width: min(100%, calc(72vh * var(--ratio)), 420px);
  justify-self: center;
  padding: 0;
  overflow: hidden;
  border-radius: 6px;
  background: linear-gradient(180deg, #efe8dc 0%, #e2d7c6 100%);
  cursor: crosshair;
  touch-action: pan-y pinch-zoom;

  &.is-pinned {
    touch-action: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: fill; // рамка = пропорции фото, поэтому искажений нет и лупа совпадает с изображением
    mix-blend-mode: multiply;
    user-select: none;
    pointer-events: none;
  }
}

.lens {
  position: absolute;
  border-radius: 50%;
  background-color: #f6f1e8;
  background-repeat: no-repeat;
  box-shadow:
    0 0 0 2px var(--c-oak-light),
    0 20px 40px -10px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.lens-caption {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-xs);
  color: var(--text-muted);

  svg {
    color: var(--c-oak-light);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 360ms var(--ease);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
