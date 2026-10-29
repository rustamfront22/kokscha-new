<template>
  <div class="door-grid">
    <ul class="door-grid__list">
      <li v-for="item in visible" :key="item.id">
        <Card :data="item" />
      </li>
    </ul>

    <div v-if="items.length > pageSize" class="door-grid__more">
      <p class="door-grid__count" aria-live="polite">
        {{ t("Shown {shown} of {total}", { shown: visible.length, total: items.length }) }}
      </p>
      <div class="door-grid__progress" aria-hidden="true">
        <span :style="{ width: `${(visible.length / items.length) * 100}%` }" />
      </div>
      <button v-if="visible.length < items.length" class="btn btn--outline" type="button" @click="showMore">
        <UiIcon name="plus" />
        {{ t("Show more") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Card from "../product/Card.vue";
import UiIcon from "@/components/ui/UiIcon.vue";

// Сетка дверей с постраничной подгрузкой «Показать ещё».
const props = defineProps({
  items: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 12 },
});

const { t } = useI18n();
const limit = ref(props.pageSize);

const visible = computed(() => props.items.slice(0, limit.value));

const showMore = () => {
  limit.value += props.pageSize;
};

// Новый набор (смена фильтра) — снова с первой страницы.
watch(
  () => props.items,
  () => {
    limit.value = props.pageSize;
  },
);
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.door-grid__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-5);
  }

  @include up(xl) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.door-grid__more {
  display: grid;
  justify-items: center;
  gap: var(--space-4);
  margin-top: var(--space-7);
}

.door-grid__count {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.door-grid__progress {
  width: min(240px, 60%);
  height: 2px;
  background: var(--border);

  span {
    display: block;
    height: 100%;
    background: var(--c-graphite);
    transition: width var(--dur) var(--ease);
  }
}
</style>
