<template>
  <section id="story" class="story theme-dark" aria-labelledby="story-title">
    <div class="container">
      <header class="story__head" v-reveal>
        <p class="label-mono">{{ t("Our approach") }}</p>
        <h2 id="story-title" class="display">
          {{ t("Every door") }} <em>{{ t("is a small architecture") }}</em>
        </h2>
      </header>

      <div class="story__layout">
        <!-- Закреплённый визуал (десктоп): меняется вместе с активной сценой -->
        <div class="story__sticky" aria-hidden="true">
          <div class="story__frame">
            <TransitionGroup name="scene">
              <div v-for="(scene, i) in scenes" v-show="i === active" :key="scene.id" class="story__scene">
                <StoryVisual :scene="scene.id" :doors="doors" :swatch-model="swatchModel" />
              </div>
            </TransitionGroup>
            <ol class="story__dots">
              <li v-for="(scene, i) in scenes" :key="scene.id" :class="{ 'is-active': i === active }" />
            </ol>
          </div>
        </div>

        <ol class="story__steps">
          <li
            v-for="(scene, i) in scenes"
            :key="scene.id"
            :ref="(el) => (stepEls[i] = el)"
            class="story__step"
            :class="{ 'is-active': i === active }"
          >
            <div class="story__inline">
              <StoryVisual :scene="scene.id" :doors="doors" :swatch-model="swatchModel" />
            </div>
            <span class="label-mono story__num">{{ String(i + 1).padStart(2, "0") }} / {{ String(scenes.length).padStart(2, "0") }}</span>
            <h3 class="h2 story__title">{{ t(scene.title) }}</h3>
            <p class="story__text">{{ t(scene.text) }}</p>

            <!-- Реальные цвета моделей: выбор меняет дверь на настоящую модель этого цвета -->
            <div v-if="scene.id === 'color' && swatches.length" class="story__swatches" role="group" :aria-label="t('Colour')">
              <button
                v-for="sw in swatches"
                :key="sw.id"
                type="button"
                class="story__swatch"
                :style="{ '--sw': sw.hex }"
                :aria-pressed="swatchModel?.id === sw.id"
                :aria-label="`${colorLabel(sw.color)} — ${t('Model')} ${sw.title}`"
                :title="colorLabel(sw.color)"
                @click="swatchId = sw.id"
              />
              <p class="story__swatch-label">
                {{ swatchModel ? `${colorLabel(swatchModel.color)} · ${t("Model")} ${swatchModel.title}` : "" }}
              </p>
              <p class="story__note">{{ t("On-screen shades are approximate.") }}</p>
            </div>

            <RouterLink v-if="scene.link" :to="scene.link" class="btn btn--link story__link">
              {{ t(scene.linkLabel) }}
              <UiIcon name="arrow-right" class="btn__arrow" />
            </RouterLink>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import StoryVisual from "./StoryVisual.vue";
import { useProductStore } from "@/store/product";
import { colorLabel, colorSwatch } from "@/utils/doorColors";

const { t } = useI18n();
const store = useProductStore();

// Тексты — существующие формулировки компании (ключи переводов уже были на сайте)
const scenes = [
  {
    id: "form",
    title: "Form and proportions",
    text: "Products in various styles description",
    link: { name: "products" },
    linkLabel: "Catalog",
  },
  {
    id: "color",
    title: "Texture and colour",
    text: "Huge selection of models description",
  },
  {
    id: "interior",
    title: "In real interiors",
    text: "Watch how Ko'kcha doors look in real interiors — hotels, salons, offices and homes of our clients.",
    link: { name: "video" },
    linkLabel: "Video",
  },
  {
    id: "craft",
    title: "Production",
    text: "We keep the focus on the material, precise assembly and clean installation. The door should look neat, modern and last a long time.",
    link: { name: "about" },
    linkLabel: "About the company",
  },
];

// Три модели разных коллекций для сцены «Форма»
const doors = computed(() => {
  const seen = new Set();
  return store.products.filter((p) => (seen.has(p.type) ? false : seen.add(p.type))).slice(0, 3);
});

// Свотчи: по одной модели на заметно отличающийся оттенок
const swatches = computed(() => {
  const seen = new Set();
  const list = [];
  for (const p of store.products) {
    const hex = colorSwatch(p.color);
    if (seen.has(hex)) continue;
    seen.add(hex);
    list.push({ id: p.id, title: p.title, color: p.color, hex });
    if (list.length >= 10) break;
  }
  return list;
});

const swatchId = ref(null);
const swatchModel = computed(() => store.findById(swatchId.value ?? swatches.value[0]?.id));

/* Активная сцена — шаг, ближайший к центру экрана. Обычный скролл, без перехвата;
   пересчёт не чаще одного раза за кадр. */
const active = ref(0);
const stepEls = ref([]);
let frame = 0;

const updateActive = () => {
  frame = 0;
  const mid = window.innerHeight / 2;
  let best = 0;
  let bestDist = Infinity;
  stepEls.value.forEach((el, i) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dist = Math.abs(r.top + r.height / 2 - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  active.value = best;
};

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(updateActive);
};

onMounted(() => {
  store.fetchProducts().catch(() => {});
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateActive();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  if (frame) cancelAnimationFrame(frame);
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.story {
  padding-block: var(--section-y);
}

.story__head {
  display: grid;
  gap: var(--space-4);
  max-width: 900px;
  margin-bottom: var(--space-8);
}

.story__layout {
  display: grid;

  @include up(lg) {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: var(--space-9);
  }
}

.story__sticky {
  display: none;

  @include up(lg) {
    display: block;
    position: sticky;
    top: calc(var(--header-h) + 5vh);
    height: min(76vh, 720px);
  }
}

.story__frame {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  background: var(--surface);
}

.story__scene {
  position: absolute;
  inset: 0;
}

.scene-enter-active,
.scene-leave-active {
  transition: opacity 600ms var(--ease), transform 900ms var(--ease-out);
}

.scene-enter-from {
  opacity: 0;
  transform: scale(1.03);
}

.scene-leave-to {
  opacity: 0;
}

.story__dots {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  display: grid;
  gap: var(--space-2);
  transform: translateY(-50%);

  li {
    width: 3px;
    height: 22px;
    border-radius: 2px;
    background: rgba(245, 241, 233, 0.25);
    transition: background-color var(--dur) var(--ease), height var(--dur) var(--ease);
  }

  li.is-active {
    height: 40px;
    background: var(--c-oak-light);
  }
}

.story__steps {
  display: grid;
  gap: var(--space-9);

  @include up(lg) {
    gap: 0;
  }
}

.story__step {
  display: grid;
  align-content: center;
  gap: var(--space-4);

  @include up(lg) {
    min-height: 80vh;
    opacity: 0.35;
    transition: opacity var(--dur-slow) var(--ease);

    &.is-active {
      opacity: 1;
    }
  }
}

.story__inline {
  aspect-ratio: 4 / 5;
  max-height: 70vh;
  overflow: hidden;
  border-radius: 6px;
  background: var(--surface);
  margin-bottom: var(--space-3);

  @include up(lg) {
    display: none;
  }
}

.story__text {
  max-width: 48ch;
  font-size: var(--fs-lead);
  color: var(--text-muted);
}

.story__link {
  justify-self: start;
  margin-top: var(--space-2);
}

.story__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.story__swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--sw);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
  outline-offset: 3px;
  transition: transform var(--dur) var(--ease);

  &:hover {
    transform: scale(1.08);
  }

  &[aria-pressed="true"] {
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.18),
      0 0 0 2px var(--c-graphite-deep),
      0 0 0 3px var(--c-oak-light);
  }
}

.story__swatch-label {
  flex-basis: 100%;
  font-size: var(--fs-sm);
  font-weight: 600;
}

.story__note {
  flex-basis: 100%;
  font-size: var(--fs-xs);
  color: var(--text-muted);
}
</style>
