<template>
  <article class="door-card">
    <div class="door-card__media">
      <AppImage :src="data.thumbnail" :alt="imageAlt" fit="contain" :fallback-label="t('Image unavailable')" />
    </div>

    <div class="door-card__body">
      <p v-if="data.type" class="door-card__type">{{ typeLabel(data.type) }}</p>
      <h3 class="door-card__title">
        <!-- Ссылка растянута на всю карточку через ::after; кнопка заявки лежит рядом, а не внутри ссылки -->
        <RouterLink :to="{ name: 'product', params: { id: data.id } }" class="door-card__link">
          {{ t("Model") }} {{ data.title }}
        </RouterLink>
      </h3>
      <p v-if="meta" class="door-card__meta">{{ meta }}</p>
    </div>

    <div class="door-card__footer">
      <button class="door-card__request" type="button" @click="onLeadClick">
        {{ t("Submit your application") }}
      </button>
      <span class="door-card__arrow" aria-hidden="true">
        <UiIcon name="arrow-up-right" :size="18" />
      </span>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AppImage from "@/components/ui/AppImage.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import { typeLabel } from "@/utils/crmLabels";
import { colorLabel } from "@/utils/doorColors";

const props = defineProps(["data"]);
const { t } = useI18n();

const meta = computed(() => [colorLabel(props.data.color), props.data.size].filter(Boolean).join(" · "));
const imageAlt = computed(() =>
  [`${t("Model")} ${props.data.title}`, typeLabel(props.data.type), colorLabel(props.data.color)].filter(Boolean).join(", "),
);

const onLeadClick = () =>
  openLeadModal("product-card", { title: `${t("Model")} ${props.data.title}`, lines: [typeLabel(props.data.type), colorLabel(props.data.color)].filter(Boolean) });
</script>

<style scoped>
.door-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius);
  background: #fbf9f5;
  color: var(--c-graphite);
  transition:
    border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}

.door-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-3px);
}

/* Фокус клавиатуры на растянутой ссылке — обводка всей карточки */
.door-card:has(.door-card__link:focus-visible) {
  outline: 2px solid var(--focus-ring);
  outline-offset: 3px;
}

.door-card__media {
  position: relative;
  aspect-ratio: 3 / 4;
  padding: 8% 14% 4%;
  background: linear-gradient(180deg, #efe8dc 0%, #e4d9c8 100%);
  overflow: hidden;
}

/* Фото дверей из CRM на белом фоне: multiply растворяет фон в тёплом оттенке */
.door-card__media :deep(img) {
  mix-blend-mode: multiply;
  transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out);
}

.door-card:hover .door-card__media :deep(img) {
  transform: scale(1.035);
}

.door-card__body {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-4) var(--space-3);
}

.door-card__type {
  font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-oak-ink);
}

.door-card__title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.door-card__link::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  z-index: 1;
}

.door-card__link:focus-visible {
  outline: none;
}

.door-card__meta {
  font-size: var(--fs-sm);
  color: var(--c-muted);
}

.door-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: auto;
  padding: var(--space-3) var(--space-4) var(--space-4);
  border-top: 1px solid var(--c-line);
}

.door-card__request {
  position: relative;
  z-index: 2; /* над растянутой ссылкой */
  padding: var(--space-2) 0;
  font-size: var(--fs-sm);
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid transparent;
  transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.door-card__request:hover {
  color: var(--accent-ink);
  border-color: currentColor;
}

.door-card__arrow {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--c-line-strong);
  border-radius: 50%;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.door-card:hover .door-card__arrow {
  background: var(--c-graphite);
  border-color: var(--c-graphite);
  color: var(--c-ivory);
}

@media (max-width: 479px) {
  .door-card__media {
    padding: 8% 10% 4%;
  }

  .door-card__body {
    padding: var(--space-3) var(--space-3) var(--space-2);
  }

  .door-card__title {
    font-size: 1.25rem;
  }

  .door-card__footer {
    padding: var(--space-2) var(--space-3) var(--space-3);
  }

  .door-card__arrow {
    display: none;
  }

  .door-card__request {
    font-size: var(--fs-xs);
  }
}
</style>
