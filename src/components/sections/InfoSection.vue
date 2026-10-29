<template>
  <section class="info">
    <div class="container">
      <div class="info__box">
        <h2 class="info__title">{{ title }}</h2>

        <!-- text может быть строкой -->
        <p v-if="typeof text === 'string'" class="info__text">
          {{ text }}
        </p>

        <!-- или массивом -->
        <div v-else class="info__text">
          <p v-for="(p, i) in text" :key="i">{{ p }}</p>
        </div>

        <ul v-if="bullets?.length" class="info__list">
          <li v-for="(b, i) in bullets" :key="i">{{ b }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  text: { type: [String, Array], default: "" }, // ✅ FIX
  bullets: { type: Array, default: () => [] },
});
</script>

<style scoped lang="scss">
.info {
  padding: 56px 0;
}
.info__box {
  border-radius: 20px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}
.info__title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 14px;
}
.info__text {
  opacity: 0.9;
  line-height: 1.6;
}
.info__list {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}
.info__list li {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
}
</style>