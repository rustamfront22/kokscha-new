<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
});
</script>

<template>
  <section class="py-10">
    <div class="container">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="(s, i) in items"
          :key="i"
          class="rounded-2xl bg-white/5 border border-white/10 p-5"
        >
          <div class="text-3xl font-bold">{{ s.value }}</div>
          <div class="text-sm opacity-80 mt-1">{{ s.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>