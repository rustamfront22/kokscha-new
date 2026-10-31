<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AppImage from "@/components/ui/AppImage.vue";
import UiIcon from "@/components/ui/UiIcon.vue";

const props = defineProps({
  video: { type: Object, required: true },
  showDate: { type: Boolean, default: true },
});

const emit = defineEmits(["play"]);
const { locale, t } = useI18n();

const localeMap = { en: "en-GB", ru: "ru-RU", uz: "uz-Latn", zh: "zh-CN" };

const formattedDate = computed(() => {
  try {
    return new Intl.DateTimeFormat(localeMap[locale.value] || "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(props.video.date));
  } catch (e) {
    return props.video.date;
  }
});
</script>

<template>
  <article class="video-card">
    <button class="video-card__thumb" type="button" :aria-label="`${t('Watch video')}: ${t(video.titleKey)}`" @click="emit('play', video)">
      <AppImage :src="video.poster" alt="" />
      <span class="video-card__play" aria-hidden="true"><UiIcon name="play" :size="22" /></span>
    </button>
    <div class="video-card__body">
      <time v-if="showDate" class="video-card__date" :datetime="video.date">{{ formattedDate }}</time>
      <h3 class="video-card__title">{{ t(video.titleKey) }}</h3>
    </div>
  </article>
</template>

<style scoped>
.video-card {
  display: grid;
  gap: var(--space-4);
  align-content: start;
}

.video-card__thumb {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 9 / 14;
  overflow: hidden;
  background: var(--surface-alt);
}

.video-card__thumb :deep(img) {
  transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out);
}

.video-card__thumb::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(36, 35, 32, 0.45));
}

.video-card__thumb:hover :deep(img) {
  transform: scale(1.04);
}

.video-card__play {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  padding-left: 3px;
  border-radius: 50%;
  background: rgba(245, 241, 233, 0.92);
  color: var(--c-graphite);
  transform: translate(-50%, -50%);
  transition: transform var(--dur) var(--ease);
}

.video-card__thumb:hover .video-card__play {
  transform: translate(-50%, -50%) scale(1.08);
}

.video-card__body {
  display: grid;
  gap: var(--space-2);
}

.video-card__date {
  font-size: var(--fs-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-ink);
}

.video-card__title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
