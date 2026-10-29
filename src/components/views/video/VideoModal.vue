<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BaseModal from "@/components/ui/BaseModal.vue";

const props = defineProps({
  video: { type: Object, default: null },
});

const emit = defineEmits(["close"]);
const { t } = useI18n();

const isOpen = computed(() => !!props.video);
</script>

<template>
  <BaseModal :open="isOpen" variant="media" labelledby="video-modal-title" @close="emit('close')">
    <div v-if="video" class="video-modal">
      <video
        :key="video.src"
        class="video-modal__player"
        :src="video.src"
        :poster="video.poster"
        controls
        autoplay
        playsinline
        preload="metadata"
        controlslist="nodownload noremoteplayback"
      ></video>
      <p id="video-modal-title" class="video-modal__title">{{ t(video.titleKey) }}</p>
    </div>
  </BaseModal>
</template>

<style scoped>
.video-modal {
  display: grid;
  justify-items: center;
  gap: var(--space-4);
  padding-top: var(--space-7);
}

.video-modal__player {
  width: auto;
  max-width: 100%;
  max-height: calc(100dvh - 9rem);
  aspect-ratio: 9 / 16;
  background: #000;
}

.video-modal__title {
  max-width: 60ch;
  text-align: center;
  color: var(--text-on-dark-muted);
  font-size: var(--fs-sm);
}
</style>
