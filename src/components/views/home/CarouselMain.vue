<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__media" aria-hidden="true">
      <picture>
        <source media="(max-width: 767px)" srcset="/media/hero-poster-sm.jpg" />
        <img class="hero__poster" src="/media/hero-poster.jpg" alt="" fetchpriority="high" decoding="async" />
      </picture>
      <video
        v-if="videoSrc"
        ref="video"
        class="hero__video"
        :class="{ 'is-ready': videoReady }"
        :src="videoSrc"
        autoplay
        muted
        loop
        playsinline
        preload="none"
        poster="/media/hero-poster.jpg"
        @playing="onPlaying"
        @pause="playing = false"
      />
      <div class="hero__shade" />
    </div>

    <div class="container hero__content">
      <p class="eyebrow hero__eyebrow">Ko‘kcha eshiklar · {{ t("Production") }}</p>
      <h1 id="hero-title" class="display hero__title">
        {{ capitalize(t("modern doors")) }}
        <em>{{ t("for interior and entrance solutions") }}</em>
      </h1>
      <p class="hero__lead">
        {{ t("Modern interior and entrance doors.  Model selection, consultation, turnkey delivery and installation.") }}
      </p>
      <div class="actions hero__actions">
        <RouterLink :to="{ name: 'products' }" class="btn btn--light btn--lg">
          {{ t("Catalog") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </RouterLink>
        <button class="btn btn--outline-light btn--lg" type="button" @click="openLeadModal('hero')">
          {{ t("Submit your application") }}
        </button>
      </div>
    </div>

    <div class="hero__bottom">
      <div class="container hero__bottom-inner">
        <ul class="hero__badges">
          <li>{{ t("Premium doors") }}</li>
          <li>{{ t("GOST / ISO") }}</li>
          <li>{{ t("Up to 10 years warranty") }}</li>
          <li>{{ t("Under the size") }}</li>
        </ul>
        <button
          v-if="videoSrc"
          class="hero__toggle"
          type="button"
          :aria-label="playing ? t('Pause video') : t('Play video')"
          @click="togglePlay"
        >
          <UiIcon :name="playing ? 'pause' : 'play'" :size="16" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";

const { t } = useI18n();

// Оптимизированная копия /video/hero.mp4 (720p, ~3,8 МБ вместо 68 МБ). Оригинал не удалён.
const HERO_VIDEO = "/media/hero-720.mp4";

const video = ref(null);
const videoSrc = ref("");
const videoReady = ref(false);
const playing = ref(false);
let idleHandle = null;

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Видео подключаем только после загрузки страницы и если пользователь не просил
// экономить трафик / уменьшить анимацию. Иначе остаётся постер.
const shouldLoadVideo = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = navigator.connection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""))) return false;
  return true;
};

const startVideo = () => {
  if (shouldLoadVideo()) videoSrc.value = HERO_VIDEO;
};

const onPlaying = () => {
  playing.value = true;
  videoReady.value = true;
};

const togglePlay = () => {
  const el = video.value;
  if (!el) return;
  if (el.paused) el.play().catch(() => {});
  else el.pause();
};

onMounted(() => {
  const schedule = () => {
    idleHandle = "requestIdleCallback" in window
      ? window.requestIdleCallback(startVideo, { timeout: 2500 })
      : window.setTimeout(startVideo, 1200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
});

onBeforeUnmount(() => {
  if (idleHandle && "cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
  else clearTimeout(idleHandle);
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.hero {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: max(620px, min(100svh, 980px));
  padding-top: var(--header-h);
  color: var(--c-ivory);
  background: var(--c-graphite);
  overflow: hidden;
}

.hero__media {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  z-index: -1;
}

.hero__poster,
.hero__video {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__video {
  opacity: 0;
  transition: opacity 1.2s var(--ease);

  &.is-ready {
    opacity: 1;
  }
}

.hero__shade {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(36, 35, 32, 0.55) 0%, rgba(36, 35, 32, 0.1) 30%, rgba(36, 35, 32, 0.2) 55%, rgba(36, 35, 32, 0.88) 100%),
    linear-gradient(90deg, rgba(36, 35, 32, 0.6) 0%, rgba(36, 35, 32, 0) 70%);
}

.hero__content {
  display: grid;
  align-content: end;
  justify-items: start;
  gap: var(--space-5);
  padding-block: var(--space-8) var(--space-7);
}

.hero__eyebrow {
  color: var(--c-sand);
}

.hero__title {
  max-width: 17ch;

  em {
    display: block;
    color: var(--c-sand);
  }

  &:lang(zh) {
    max-width: 12em;
  }
}

.hero__lead {
  max-width: 52ch;
  font-size: var(--fs-lead);
  color: var(--text-on-dark-muted);
}

.hero__actions {
  margin-top: var(--space-2);

  @include down(sm) {
    width: 100%;

    .btn {
      flex: 1 1 100%;
    }
  }
}

.hero__bottom {
  border-top: 1px solid rgba(245, 241, 233, 0.18);
}

.hero__bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: 64px;

  @include down(md) {
    padding-right: 84px; /* не перекрываться с плавающей кнопкой звонка */
  }
}

.hero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-6);
  padding-block: var(--space-3);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(245, 241, 233, 0.78);

  li {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
  }

  li + li::before {
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--c-oak);
    margin-left: calc(var(--space-6) * -0.5 - 2px);
    margin-right: calc(var(--space-6) * 0.5 - 2px - var(--space-3));
  }

  @include down(md) {
    gap: var(--space-2) var(--space-4);

    li + li::before {
      display: none;
    }
  }
}

.hero__toggle {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(245, 241, 233, 0.4);
  border-radius: 50%;
  color: var(--c-ivory);
  transition: background-color var(--dur) var(--ease);

  &:hover {
    background: rgba(245, 241, 233, 0.12);
  }
}
</style>
