<script setup>
import { useI18n } from "vue-i18n";

// items: [{ label, to? }] — последний элемент считается текущей страницей.
defineProps({
  items: { type: Array, default: () => [] },
});

const { t } = useI18n();
</script>

<template>
  <nav class="breadcrumbs" :aria-label="t('Breadcrumbs')">
    <ol>
      <li v-for="(item, i) in items" :key="i">
        <RouterLink v-if="item.to && i < items.length - 1" :to="item.to">{{ item.label }}</RouterLink>
        <span v-else :aria-current="i === items.length - 1 ? 'page' : undefined">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
