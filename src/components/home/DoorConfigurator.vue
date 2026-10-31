<template>
  <section id="configurator" class="config theme-dark" aria-labelledby="config-title">
    <div class="container">
      <header class="config__head" v-reveal>
        <p class="label-mono">{{ t("Door configurator") }}</p>
        <h2 id="config-title" class="display">
          {{ t("Assemble") }} <em>{{ t("your door") }}</em>
        </h2>
        <p class="lead">{{ t("Choose a collection, style, finish and size — we will prepare a consultation for exactly this option.") }}</p>
      </header>

      <div v-if="store.isLoading" class="config__layout" aria-hidden="true">
        <div class="config__stage skeleton" />
        <div class="config__panel">
          <div v-for="n in 4" :key="n" class="skeleton" style="height: 72px; border-radius: 6px" />
        </div>
      </div>

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

      <div v-else class="config__layout">
        <!-- Визуал: фото выбранной реальной модели -->
        <figure class="config__stage">
          <div class="config__niche">
            <Transition name="door" mode="out-in">
              <img
                v-if="product"
                :key="product.id"
                :src="product.thumbnail"
                :alt="productAlt"
                decoding="async"
              />
            </Transition>
          </div>
          <figcaption class="config__disclaimer">
            <UiIcon name="door" :size="16" />
            <span>{{ t("The photo shows model {model}. The colour on screen may differ from the real finish.", { model: product?.title || "" }) }}</span>
          </figcaption>
        </figure>

        <div class="config__panel">
          <p v-if="notice.key" class="config__notice" role="status">
            {{ t(notice.key, notice.params) }}
          </p>

          <!-- 01 Коллекция -->
          <fieldset class="step">
            <legend class="step__legend">
              <span class="label-mono">01</span>{{ t("Collection") }}
            </legend>
            <div class="step__options">
              <button
                v-for="c in collections"
                :key="c"
                type="button"
                class="chip"
                :aria-pressed="selection.type === c"
                @click="setType(c)"
              >
                {{ typeLabel(c) }}
              </button>
            </div>
          </fieldset>

          <!-- 02 Стиль: только стили, которые реально есть в выбранной коллекции -->
          <fieldset class="step">
            <legend class="step__legend">
              <span class="label-mono">02</span>{{ t("Style") }}
            </legend>
            <div class="step__options">
              <button
                v-for="s in styles"
                :key="s"
                type="button"
                class="chip"
                :aria-pressed="selection.style === s"
                @click="setStyle(s)"
              >
                {{ styleLabel(s) }}
                <span class="chip__count">{{ modelsFor(selection.type, s).length }}</span>
              </button>
            </div>
          </fieldset>

          <!-- 03 Отделка: каждый образец — отдельная модель своего цвета -->
          <fieldset class="step">
            <legend class="step__legend">
              <span class="label-mono">03</span>{{ t("Finish") }}
              <span class="step__value">{{ product ? colorLabel(product.color) : "" }}</span>
            </legend>
            <div class="step__swatches">
              <button
                v-for="m in models"
                :key="m.id"
                type="button"
                class="swatch"
                :style="{ '--sw': colorSwatch(m.color) }"
                :aria-pressed="selection.modelId === m.id"
                :aria-label="`${colorLabel(m.color)} — ${t('Model')} ${m.title}`"
                :title="`${colorLabel(m.color)} · ${m.title}`"
                @click="setModel(m.id)"
              >
                <span class="swatch__model">{{ m.title }}</span>
              </button>
            </div>
            <p class="step__hint">{{ t("Each finish is a separate model in the catalog. Shades are approximate.") }}</p>
          </fieldset>

          <!-- 04 Размер: подтверждённые размеры модели + индивидуальный по запросу -->
          <fieldset class="step">
            <legend class="step__legend">
              <span class="label-mono">04</span>{{ t("Size") }}
            </legend>
            <div class="step__options">
              <button
                v-for="s in sizes"
                :key="s"
                type="button"
                class="chip"
                :aria-pressed="selection.size === s"
                @click="setSize(s)"
              >
                {{ formatSize(s) }}
              </button>
              <button type="button" class="chip" :aria-pressed="selection.size === CUSTOM_SIZE" @click="setSize(CUSTOM_SIZE)">
                {{ t("Custom size") }}
              </button>
            </div>
            <p v-if="selection.size === CUSTOM_SIZE" class="step__hint step__hint--accent">
              {{ t("Custom sizes are discussed during the consultation: we will clarify the opening dimensions and possibilities.") }}
            </p>
          </fieldset>

          <!-- 05 Итог -->
          <div v-if="product" class="summary" aria-live="polite">
            <p class="label-mono">05 · {{ t("Your configuration") }}</p>
            <dl class="summary__list">
              <div><dt>{{ t("Model") }}</dt><dd>{{ product.title }}</dd></div>
              <div><dt>{{ t("Collection") }}</dt><dd>{{ typeLabel(product.type) }}</dd></div>
              <div><dt>{{ t("Style") }}</dt><dd>{{ styleLabel(product.style) }}</dd></div>
              <div><dt>{{ t("Colour") }}</dt><dd>{{ colorLabel(product.color) }}</dd></div>
              <div><dt>{{ t("Size") }}</dt><dd>{{ sizeText }}</dd></div>
            </dl>
            <p class="summary__price">{{ t("Contact us and we will tell you about the models, terms and cost.") }}</p>
            <div class="actions">
              <button class="btn btn--primary btn--lg" type="button" @click="requestConsultation">
                {{ t("Get a consultation") }}
                <UiIcon name="arrow-right" class="btn__arrow" />
              </button>
              <a href="#interior" class="btn btn--outline btn--lg" @click="goInterior">{{ t("Try it in an interior") }}</a>
            </div>
            <RouterLink :to="{ name: 'product', params: { id: product.id } }" class="btn btn--link summary__more">
              {{ t("Model page") }}
              <UiIcon name="arrow-up-right" :size="16" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import StateMessage from "@/components/ui/StateMessage.vue";
import { useProductStore } from "@/store/product";
import { useConfigurator, CUSTOM_SIZE } from "@/composables/useConfigurator";
import { openLeadModal } from "@/composables/useLeadModal";
import { colorLabel, colorSwatch } from "@/utils/doorColors";
import { typeLabel, styleLabel } from "@/utils/crmLabels";

const { t } = useI18n();
const store = useProductStore();
const { selection, collections, styles, models, product, sizes, notice, setType, setStyle, setModel, setSize, modelsFor } =
  useConfigurator();

// «2.40 x 0.90» из CRM → «2,40 × 0,90 м»
const formatSize = (s) => `${s.replace(/\./g, ",").replace(/\s*x\s*/i, " × ")} ${t("m")}`;

const sizeText = computed(() =>
  selection.size === CUSTOM_SIZE ? t("Custom size") : selection.size ? formatSize(selection.size) : "—",
);

const productAlt = computed(() =>
  product.value ? [`${t("Model")} ${product.value.title}`, typeLabel(product.value.type), colorLabel(product.value.color)].join(", ") : "",
);

const requestConsultation = () => {
  const p = product.value;
  if (!p) return;
  openLeadModal("configurator", {
    title: `${t("Model")} ${p.title}`,
    lines: [typeLabel(p.type), styleLabel(p.style), colorLabel(p.color), sizeText.value].filter(Boolean),
  });
};

const goInterior = (e) => {
  const el = document.querySelector("#interior");
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
};

onMounted(() => store.fetchProducts().catch(() => {}));
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.config {
  padding-block: var(--section-y);
}

.config__head {
  display: grid;
  gap: var(--space-4);
  max-width: 820px;
  margin-bottom: var(--space-7);
}

.config__layout {
  display: grid;
  gap: var(--space-6);

  @include up(lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-8);
    align-items: start;
  }
}

.config__stage {
  margin: 0;
  display: grid;
  gap: var(--space-3);
  min-height: 420px;

  @include up(lg) {
    position: sticky;
    top: calc(var(--header-h) + var(--space-5));
  }

  // На телефоне — компактное закреплённое превью: результат выбора виден, пока листаешь опции
  @include down(lg) {
    position: sticky;
    top: var(--header-h);
    z-index: 2;
    min-height: 0;
    padding-block: var(--space-2);
    background: var(--bg);

    .config__niche {
      aspect-ratio: auto;
      height: 40vh;
      max-height: 340px;
      padding: 4% 30% 2%;
    }
  }
}

.config__niche {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 5;
  max-height: 78vh;
  padding: 8% 22% 4%;
  overflow: hidden;
  border-radius: 6px;
  background:
    radial-gradient(ellipse at 50% 30%, #f3ede3 0%, #e3d8c7 70%),
    #e8dfd0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    mix-blend-mode: multiply;
  }

  @include down(sm) {
    padding: 8% 16% 4%;
  }
}

.config__disclaimer {
  display: flex;
  gap: var(--space-2);
  align-items: flex-start;
  font-size: var(--fs-xs);
  color: var(--text-muted);

  svg {
    flex: 0 0 auto;
    margin-top: 1px;
    color: var(--c-oak-light);
  }
}

.config__panel {
  display: grid;
  gap: var(--space-5);
}

.config__notice {
  padding: var(--space-3) var(--space-4);
  border-left: 2px solid var(--c-oak-light);
  background: rgba(212, 174, 126, 0.08);
  font-size: var(--fs-sm);
}

.step {
  display: grid;
  gap: var(--space-3);
  padding: 0 0 var(--space-5);
  border: 0;
  border-bottom: 1px solid var(--border);
  min-width: 0;
}

.step__legend {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  float: left; // legend внутри grid: иначе браузер вырывает его из потока
  width: 100%;
  margin-bottom: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 400;
  letter-spacing: -0.02em;

  .label-mono {
    color: var(--c-oak-light);
  }
}

.step__value {
  margin-left: auto;
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.step__options {
  clear: both;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.step__swatches {
  clear: both;
  display: flex;
  flex-wrap: wrap;
  gap: 1.9rem var(--space-3); // по вертикали — место под номер модели под кружком
}

.swatch {
  position: relative;
  display: grid;
  place-items: end center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--sw);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
  transition: transform var(--dur) var(--ease);

  &:hover {
    transform: translateY(-2px);
  }

  &[aria-pressed="true"] {
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.2),
      0 0 0 3px var(--c-graphite-deep),
      0 0 0 4px var(--c-oak-light);
  }
}

.swatch__model {
  position: absolute;
  bottom: -1.35rem;
  font-size: 0.6875rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.step__swatches + .step__hint {
  margin-top: var(--space-4);
}

.step__hint {
  font-size: var(--fs-xs);
  color: var(--text-muted);

  &--accent {
    color: var(--text);
    padding-left: var(--space-3);
    border-left: 2px solid var(--c-oak-light);
  }
}

.summary {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: 6px;
  background: var(--surface);
  border: 1px solid var(--border);

  .actions .btn {
    @include down(sm) {
      width: 100%;
    }
  }
}

.summary__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3) var(--space-5);

  dt {
    font-size: var(--fs-xs);
    color: var(--text-muted);
  }

  dd {
    font-weight: 600;
  }
}

.summary__price {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.summary__more {
  justify-self: start;
}

.door-enter-active,
.door-leave-active {
  transition: opacity 300ms var(--ease), transform 420ms var(--ease-out);
}

.door-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.door-leave-to {
  opacity: 0;
}
</style>
