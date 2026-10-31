<script setup>
import { typeLabel } from "@/utils/crmLabels";
import { colorLabel } from "@/utils/doorColors";

// Визуал одной сцены повествования. Только реальные материалы:
// фото моделей из CRM, кадры из видео производства и фото проектов из Instagram.
defineProps({
  scene: { type: String, required: true },
  doors: { type: Array, default: () => [] },
  swatchModel: { type: Object, default: null },
});
</script>

<template>
  <div class="visual" :class="`visual--${scene}`">
    <template v-if="scene === 'form'">
      <div v-for="(d, i) in doors" :key="d.id" class="visual__niche" :style="{ '--i': i }">
        <img :src="d.thumbnail" :alt="typeLabel(d.type)" loading="lazy" decoding="async" />
        <span class="label-mono">{{ typeLabel(d.type) }}</span>
      </div>
    </template>

    <template v-else-if="scene === 'color'">
      <div class="visual__niche visual__niche--single">
        <Transition name="fade" mode="out-in">
          <img v-if="swatchModel" :key="swatchModel.id" :src="swatchModel.thumbnail" :alt="colorLabel(swatchModel.color)" decoding="async" />
        </Transition>
      </div>
    </template>

    <template v-else-if="scene === 'interior'">
      <img class="visual__photo visual__photo--a" src="/instagram/1.jpg" alt="" loading="lazy" decoding="async" />
      <img class="visual__photo visual__photo--b" src="/instagram/4.jpg" alt="" loading="lazy" decoding="async" />
      <img class="visual__photo visual__photo--c" src="/instagram/6.jpg" alt="" loading="lazy" decoding="async" />
    </template>

    <template v-else-if="scene === 'craft'">
      <img class="visual__cover" src="/media/workshop.jpg" alt="" loading="lazy" decoding="async" />
      <img class="visual__inset" src="/media/finishing.jpg" alt="" loading="lazy" decoding="async" />
    </template>
  </div>
</template>

<style scoped>
.visual {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #1c1b18;
}

/* Сцены с дверями: светлые ниши, фото с белым фоном растворяется через multiply */
.visual--form,
.visual--color {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4%;
  padding: 10% 6% 12%;
  background: radial-gradient(ellipse at 50% 100%, #2b2925 0%, #1c1b18 70%);
}

.visual__niche {
  position: relative;
  flex: 0 1 30%;
  aspect-ratio: 9 / 18;
  padding: 7% 9% 4%;
  background: linear-gradient(180deg, #efe8dc, #e2d7c6);
  border-radius: 999px 999px 3px 3px;
  transform: translateY(calc(var(--i, 0) * -4%));
}

.visual__niche:nth-child(2) {
  flex-basis: 34%;
  transform: translateY(-6%);
}

.visual__niche {
  overflow: hidden;
}

.visual__niche img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  mix-blend-mode: multiply;
  transform: scale(1.28); /* у фото из CRM широкие белые поля — укрупняем саму дверь */
  transform-origin: center 58%;
}

.visual__niche .label-mono {
  position: absolute;
  left: 50%;
  bottom: -2rem;
  transform: translateX(-50%);
  white-space: nowrap;
  color: rgba(243, 238, 230, 0.7);
}

.visual__niche--single {
  flex-basis: 46%;
  max-width: 300px;
}

.visual__photo {
  position: absolute;
  object-fit: cover;
  border-radius: 4px;
}

.visual__photo--a {
  left: 6%;
  top: 8%;
  width: 46%;
  height: 62%;
}

.visual__photo--b {
  right: 6%;
  top: 18%;
  width: 40%;
  height: 46%;
}

.visual__photo--c {
  right: 18%;
  bottom: 6%;
  width: 34%;
  height: 34%;
}

.visual__cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
}

.visual__inset {
  position: absolute;
  right: 6%;
  bottom: 6%;
  width: 42%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 280ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
