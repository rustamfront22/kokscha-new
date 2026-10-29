<script setup>
const props = defineProps({
  title: { type: String, default: "" },
  items: { type: Array, default: () => [] },
});
</script>

<template>
  <section class="py-12">
    <div class="container">
      <h2 class="text-2xl md:text-3xl font-bold">{{ title }}</h2>

      <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(it, i) in items"
          :key="i"
          class="rounded-2xl bg-white/5 border border-white/10 p-5"
        >
          <div class="text-lg font-semibold">{{ it.title }}</div>
          <div class="text-sm opacity-80 mt-1">{{ it.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>