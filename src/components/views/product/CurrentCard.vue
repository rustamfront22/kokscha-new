<template>
  <article class="product theme-dark">
    <div class="container">
      <Breadcrumbs :items="crumbs" />

      <div class="product__grid">
        <div class="product__gallery">
          <button class="product__image" type="button" :aria-label="t('Open image')" @click="zoomOpen = true">
            <AppImage :src="data.thumbnail" :alt="imageAlt" fit="contain" eager :fallback-label="t('Image unavailable')" />
            <span class="product__zoom" aria-hidden="true"><UiIcon name="expand" :size="18" /></span>
          </button>
        </div>

        <div class="product__info">
          <p v-if="data.type" class="eyebrow">{{ data.type }}</p>
          <h1 class="h1 product__title">{{ t("Model") }} {{ data.title }}</h1>
          <p v-if="data.color" class="product__subtitle">{{ data.color }}</p>

          <section class="product__specs" aria-labelledby="specs-title">
            <h2 id="specs-title" class="product__section-title">{{ t("Characteristics") }}</h2>
            <dl>
              <div v-for="spec in specs" :key="spec.label" class="product__spec">
                <dt>{{ spec.label }}</dt>
                <dd>{{ spec.value }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="data.description" class="product__description" aria-labelledby="desc-title">
            <h2 id="desc-title" class="product__section-title">{{ t("description") }}</h2>
            <p>{{ data.description }}</p>
          </section>

          <div class="product__cta">
            <p class="product__cta-text">
              {{ t("Contact us and we will tell you about the models, terms and cost.") }}
            </p>
            <div class="actions">
              <button class="btn btn--primary btn--lg" type="button" @click="onLeadClick">
                {{ t("Request a consultation") }}
                <UiIcon name="arrow-right" class="btn__arrow" />
              </button>
              <a class="btn btn--outline btn--lg" :href="`tel:${PHONE_TEL}`">
                <UiIcon name="phone" />
                {{ t("To call") }}
              </a>
            </div>
            <ul class="product__perks">
              <li><UiIcon name="check" :size="16" />{{ t("Individual production") }}</li>
              <li><UiIcon name="check" :size="16" />{{ t("Turnkey installation") }}</li>
              <li><UiIcon name="check" :size="16" />{{ t("Quality assurance") }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <NewProducts
      v-if="related.length"
      class="product__related"
      :items="related"
      :title="t('Similar models')"
      :eyebrow="data.type"
    />

    <BaseModal :open="zoomOpen" variant="media" :label="imageAlt" @close="zoomOpen = false">
      <div class="product__zoomed">
        <img :src="data.thumbnail" :alt="imageAlt" />
      </div>
    </BaseModal>
  </article>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import NewProducts from "../home/NewProducts.vue";
import AppImage from "@/components/ui/AppImage.vue";
import BaseModal from "@/components/ui/BaseModal.vue";
import Breadcrumbs from "@/components/ui/Breadcrumbs.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import { PHONE_TEL } from "@/config/company";

const props = defineProps({
  data: { type: Object, required: true },
  related: { type: Array, default: () => [] },
});

const { t } = useI18n();
const zoomOpen = ref(false);

watch(
  () => props.data.id,
  () => (zoomOpen.value = false),
);

const crumbs = computed(() => {
  const items = [
    { label: t("Home"), to: { name: "index" } },
    { label: t("Catalog"), to: { name: "products" } },
  ];
  if (props.data.type) items.push({ label: props.data.type, to: { name: "products", query: { cat: props.data.type } } });
  items.push({ label: `${t("Model")} ${props.data.title}` });
  return items;
});

// Только реальные поля из CRM; пустые значения не выводим.
const specs = computed(() =>
  [
    { label: t("Type"), value: props.data.type },
    { label: t("Style"), value: props.data.style },
    { label: t("Colour"), value: props.data.color },
    { label: t("Size"), value: props.data.size },
    { label: t("Filling"), value: props.data.fill },
  ].filter((s) => s.value),
);

const imageAlt = computed(() =>
  [`${t("Model")} ${props.data.title}`, props.data.type, props.data.color].filter(Boolean).join(", "),
);

const onLeadClick = () => openLeadModal("product-page");
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.product {
  padding-top: calc(var(--header-h) + clamp(1.5rem, 1rem + 2vw, 3rem));
}

.product__grid {
  display: grid;
  gap: var(--space-7);
  margin-top: var(--space-5);

  @include up(lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(3rem, 2rem + 4vw, 7rem);
    align-items: start;
  }
}

.product__gallery {
  @include up(lg) {
    position: sticky;
    top: calc(var(--header-h) + var(--space-5));
  }
}

.product__image {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  padding: 7% 18%;
  background: radial-gradient(ellipse at 50% 30%, #f3ede3 0%, #e3d8c7 70%);
  border-radius: var(--radius);
  cursor: zoom-in;

  :deep(img) {
    mix-blend-mode: multiply;
  }

  @include down(sm) {
    padding: 6% 14%;
  }
}

.product__zoom {
  position: absolute;
  right: var(--space-4);
  bottom: var(--space-4);
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border);
}

.product__info {
  display: grid;
  gap: var(--space-5);
  align-content: start;
}

.product__title {
  margin-top: calc(var(--space-2) * -1);
}

.product__subtitle {
  margin-top: calc(var(--space-3) * -1);
  font-size: var(--fs-lead);
  color: var(--text-muted);
}

.product__section-title {
  margin-bottom: var(--space-3);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--text-muted);
}

.product__specs dl {
  border-top: 1px solid var(--border);
}

.product__spec {
  display: grid;
  grid-template-columns: minmax(110px, 0.6fr) 1fr;
  gap: var(--space-4);
  padding-block: var(--space-3);
  border-bottom: 1px solid var(--border);

  dt {
    color: var(--text-muted);
  }

  dd {
    font-weight: 600;
  }
}

.product__description p {
  max-width: 62ch;
  color: var(--text-muted);
  white-space: pre-line;
}

.product__cta {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);

  .actions .btn {
    @include down(sm) {
      width: 100%;
    }
  }
}

.product__cta-text {
  color: var(--text-muted);
}

.product__perks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-5);
  font-size: var(--fs-sm);

  li {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  svg {
    color: var(--accent-ink);
  }
}

.product__related {
  margin-top: var(--section-y);
  padding-block: var(--section-y);
  border-top: 1px solid var(--border);
}

.product__zoomed {
  display: grid;
  place-items: center;
  padding: var(--space-6) 0;

  img {
    max-height: 86vh;
    width: auto;
    background: var(--c-white);
  }
}
</style>
