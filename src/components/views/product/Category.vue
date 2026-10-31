<template>
  <div class="category-filter" role="group" :aria-label="t('Categories')">
    <button class="chip" type="button" :aria-pressed="!active" @click="emit('select', null)">
      {{ t("All models") }}
      <span class="chip__count">{{ total }}</span>
    </button>
    <button
      v-for="cat in categories"
      :key="cat.name"
      class="chip"
      type="button"
      :aria-pressed="active === cat.name"
      @click="emit('select', cat.name)"
    >
      {{ typeLabel(cat.name) }}
      <span class="chip__count">{{ cat.count }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { typeLabel } from "@/utils/crmLabels";

// Фильтр по категориям (поле type из CRM). Выбор отражается в ?cat= на странице каталога.
defineProps({
  categories: { type: Array, default: () => [] },
  active: { type: String, default: null },
  total: { type: Number, default: 0 },
});

const emit = defineEmits(["select"]);
const { t } = useI18n();
</script>

<style scoped>
.category-filter {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  scrollbar-width: none;
  padding-block: 2px;
  mask-image: linear-gradient(90deg, #000 calc(100% - 32px), transparent);
}

.category-filter::-webkit-scrollbar {
  display: none;
}

@media (min-width: 1024px) {
  .category-filter {
    flex-wrap: wrap;
    overflow: visible;
    mask-image: none;
  }
}
</style>
