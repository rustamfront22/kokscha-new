<script setup>
const props = defineProps({
  title: { type: String, default: "" },
  steps: { type: Array, default: () => [] },
  finish: { type: String, default: "" },
});
</script>

<template>
  <section class="py-12">
    <div class="container">
      <h2 class="text-2xl md:text-3xl font-bold">{{ title }}</h2>

      <ol class="mt-6 grid md:grid-cols-2 gap-4">
        <li
          v-for="(s, i) in steps"
          :key="i"
          class="rounded-2xl bg-white/5 border border-white/10 p-5"
        >
          <div class="text-sm opacity-70">Шаг {{ i + 1 }}</div>
          <div class="mt-1">{{ s }}</div>
        </li>
      </ol>

      <div v-if="finish" class="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
        <div class="font-semibold">Итог</div>
        <div class="opacity-90 mt-1">{{ finish }}</div>
      </div>
    </div>
  </section>
</template>