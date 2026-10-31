<template>
  <section id="interior" class="interior" aria-labelledby="interior-title">
    <div class="container">
      <header class="interior__head" v-reveal>
        <p class="label-mono">{{ t("Interior preview") }}</p>
        <h2 id="interior-title" class="display">
          {{ t("Try the door") }} <em>{{ t("in a room") }}</em>
        </h2>
      </header>

      <div class="interior__layout">
        <figure class="stage" :style="sceneStyle">
          <div class="stage__wall">
            <div class="stage__opening" :style="{ height: `${doorHeightPct}%` }">
              <Transition name="door" mode="out-in">
                <img
                  v-if="product"
                  :key="product.id"
                  :src="product.thumbnail"
                  :alt="product ? `${t('Model')} ${product.title}, ${colorLabel(product.color)}` : ''"
                  decoding="async"
                />
              </Transition>
              <span class="stage__ruler" aria-hidden="true">
                <span class="label-mono">{{ heightLabel }}</span>
              </span>
            </div>
          </div>
          <div class="stage__baseboard" />
          <div class="stage__floor" />
          <figcaption class="stage__note">
            {{ t("Illustrative preview on a prepared scene: proportions follow the model size, colours on screen may differ from reality.") }}
          </figcaption>
        </figure>

        <div class="interior__panel">
          <div class="interior__group">
            <p class="label-mono">{{ t("Scene") }}</p>
            <div class="interior__scenes" role="group" :aria-label="t('Scene')">
              <button
                v-for="s in scenes"
                :key="s.id"
                type="button"
                class="scene-btn"
                :aria-pressed="sceneId === s.id"
                @click="sceneId = s.id"
              >
                <span class="scene-btn__preview" :style="{ '--wall': s.wall, '--floor': s.floor }" aria-hidden="true" />
                {{ t(s.label) }}
              </button>
            </div>
          </div>

          <div class="interior__group">
            <p class="label-mono">{{ t("Model") }} · {{ typeLabel(product?.type) }}</p>
            <ul v-if="models.length" class="interior__models">
              <li v-for="m in models" :key="m.id">
                <button
                  type="button"
                  class="model-btn"
                  :aria-pressed="product?.id === m.id"
                  :aria-label="`${t('Model')} ${m.title}, ${colorLabel(m.color)}`"
                  @click="setModel(m.id)"
                >
                  <img :src="m.thumbnail" alt="" loading="lazy" decoding="async" />
                  <span>{{ m.title }}</span>
                </button>
              </li>
            </ul>
            <div v-else class="skeleton" style="height: 96px; border-radius: 6px" aria-hidden="true" />
            <p class="interior__hint">{{ t("The model is synchronised with the configurator above.") }}</p>
          </div>

          <div v-if="product" class="interior__current">
            <div>
              <p class="interior__model">{{ t("Model") }} {{ product.title }}</p>
              <p class="text-muted">{{ colorLabel(product.color) }} · {{ styleLabel(product.style) }}</p>
            </div>
            <button class="btn btn--primary" type="button" @click="request">
              {{ t("Get a consultation") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useProductStore } from "@/store/product";
import { useConfigurator } from "@/composables/useConfigurator";
import { openLeadModal } from "@/composables/useLeadModal";
import { colorLabel } from "@/utils/doorColors";
import { typeLabel, styleLabel } from "@/utils/crmLabels";

const { t } = useI18n();
const store = useProductStore();
const { product, setModel, modelsFor } = useConfigurator();

// Подготовленные сцены. Сейчас это нарисованные CSS-интерьеры (светлые стены, чтобы
// фото двери на белом фоне корректно «вставало» через multiply).
// Для будущих фотосцен достаточно добавить photo + anchor ({ left, bottom, height } в %).
const scenes = [
  { id: "plaster", label: "Light plaster", wall: "#ece6db", floor: "#b48a5e", plank: "#a87e53" },
  { id: "sand", label: "Warm sand", wall: "#e3d4bd", floor: "#8a6648", plank: "#7d5b40" },
  { id: "concrete", label: "Light concrete", wall: "#dddbd6", floor: "#6f6a64", plank: "#66615b" },
];
const sceneId = ref(scenes[0].id);
const scene = computed(() => scenes.find((s) => s.id === sceneId.value));
const sceneStyle = computed(() => ({
  "--wall": scene.value.wall,
  "--floor": scene.value.floor,
  "--plank": scene.value.plank,
}));

// Высота стены в сцене условно 3,0 м — дверь занимает долю по своей реальной высоте из CRM
const WALL_HEIGHT_M = 3;
const doorHeightM = computed(() => {
  const h = parseFloat(String(product.value?.size || "").split(/x/i)[0]);
  return Number.isFinite(h) && h > 0 ? h : 2.4;
});
const doorHeightPct = computed(() => Math.min(92, (doorHeightM.value / WALL_HEIGHT_M) * 100));
const heightLabel = computed(() => `${doorHeightM.value.toFixed(2).replace(".", ",")} ${t("m")}`);

// Лента моделей: та же коллекция и стиль, что в конфигураторе (если таких мало — вся коллекция).
// Выбранная модель всегда в ленте — раньше при модели дальше 12-й ни одна кнопка не была активной.
const models = computed(() => {
  const p = product.value;
  if (!p) return [];
  const sameStyle = modelsFor(p.type, p.style);
  const list = (sameStyle.length >= 4 ? sameStyle : modelsFor(p.type)).slice(0, 12);
  if (!list.some((m) => m.id === p.id)) list.splice(list.length ? list.length - 1 : 0, 1, p);
  return list;
});

const request = () => {
  const p = product.value;
  if (!p) return;
  openLeadModal("interior-preview", {
    title: `${t("Model")} ${p.title}`,
    lines: [typeLabel(p.type), colorLabel(p.color), t(scene.value.label)],
  });
};

onMounted(() => store.fetchProducts().catch(() => {}));
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.interior {
  padding-block: var(--section-y);
  background: var(--c-ivory);
}

.interior__head {
  display: grid;
  gap: var(--space-4);
  margin-bottom: var(--space-7);
}

.interior__layout {
  display: grid;
  gap: var(--space-6);

  @include up(lg) {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr);
    gap: var(--space-7);
    align-items: start;
  }
}

/* ---------- Сцена ---------- */
.stage {
  position: relative;
  margin: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto auto; // 1fr без minmax растягивается по высоте фото
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 6px;
  transition: background-color var(--dur-slow) var(--ease);

  @include up(md) {
    aspect-ratio: 16 / 11;
  }
}

.stage__wall {
  position: relative;
  min-height: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background:
    radial-gradient(ellipse at 30% 10%, rgba(255, 255, 255, 0.55) 0%, transparent 55%),
    var(--wall);
  transition: background-color var(--dur-slow) var(--ease);
}

.stage__opening {
  position: relative;
  flex: 0 0 auto;
  aspect-ratio: 9 / 20;
  min-height: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center bottom;
    mix-blend-mode: multiply;
    // у фото из CRM белые поля сверху и по бокам: укрупняем от нижнего края,
    // чтобы полотно примерно совпало с высотой проёма (предпросмотр иллюстративный)
    transform: scale(1.22);
    transform-origin: center bottom;
  }
}

.stage__ruler {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -38px;
  width: 1px;
  background: rgba(36, 35, 32, 0.35);

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: -5px;
    width: 11px;
    height: 1px;
    background: rgba(36, 35, 32, 0.5);
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }

  .label-mono {
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);
    white-space: nowrap;
    color: rgba(36, 35, 32, 0.65);
  }
}

.stage__baseboard {
  height: 10px;
  background: color-mix(in srgb, var(--wall) 82%, #fff);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
}

.stage__floor {
  height: clamp(48px, 7vw, 110px);
  background:
    repeating-linear-gradient(90deg, var(--floor) 0 22%, var(--plank) 22% 22.4%),
    var(--floor);
  transition: background-color var(--dur-slow) var(--ease);
}

.stage__note {
  position: absolute;
  left: var(--space-4);
  right: var(--space-4);
  bottom: var(--space-3);
  font-size: var(--fs-xs);
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);

  // На телефоне подпись не помещается на полу и наезжает на стену — выносим её под сцену
  @include down(md) {
    position: static;
    padding-top: var(--space-3);
    background: var(--bg);
    color: var(--text-muted);
    text-shadow: none;
  }
}

/* ---------- Панель ---------- */
.interior__panel {
  display: grid;
  gap: var(--space-6);
}

.interior__group {
  display: grid;
  gap: var(--space-3);
}

.interior__scenes {
  display: grid;
  gap: var(--space-2);
}

.scene-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 52px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: var(--fs-sm);
  text-align: left;
  transition: border-color var(--dur) var(--ease), background-color var(--dur) var(--ease);

  &:hover {
    border-color: var(--border-strong);
  }

  &[aria-pressed="true"] {
    border-color: var(--c-graphite);
    background: var(--c-white);
  }
}

.scene-btn__preview {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(180deg, var(--wall) 0 64%, var(--floor) 64% 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.interior__models {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 72px;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  scrollbar-width: thin;
}

.model-btn {
  display: grid;
  gap: 4px;
  justify-items: center;
  width: 100%;
  padding: 6px 6px 4px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--c-linen);
  font-size: 0.6875rem;
  font-variant-numeric: tabular-nums;

  img {
    width: 100%;
    aspect-ratio: 9 / 16;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  &[aria-pressed="true"] {
    border-color: var(--c-graphite);
    background: var(--c-white);
  }
}

.interior__hint {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.interior__current {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border);
}

.interior__model {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 400;
  letter-spacing: -0.02em;
}

.door-enter-active,
.door-leave-active {
  transition: opacity 300ms var(--ease);
}

.door-enter-from,
.door-leave-to {
  opacity: 0;
}
</style>
