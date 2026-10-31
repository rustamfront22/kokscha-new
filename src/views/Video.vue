<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import VideoCard from "@/components/views/video/VideoCard.vue";
import VideoModal from "@/components/views/video/VideoModal.vue";
import AppImage from "@/components/ui/AppImage.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { sortedVideos, instagramPosts } from "@/content/media";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/config/company";

const { t } = useI18n();

const tabs = [
  { id: "video", label: "Video" },
  { id: "projects", label: "Projects" },
];
const activeTab = ref("video");
const activeVideo = ref(null);

// Клавиатурная навигация по вкладкам (стрелки влево/вправо) по паттерну WAI-ARIA Tabs.
const tabRefs = ref([]);
const onTabKeydown = (e, index) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
  e.preventDefault();
  let next = index;
  if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
  if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
  if (e.key === "Home") next = 0;
  if (e.key === "End") next = tabs.length - 1;
  activeTab.value = tabs[next].id;
  tabRefs.value[next]?.focus();
};
</script>

<template>
  <div class="video-page theme-dark">
    <section class="vp-hero">
      <div class="container vp-hero__inner">
        <p class="eyebrow">{{ activeTab === "video" ? t("Video") : t("Projects") }}</p>
        <h1 class="display">
          {{ activeTab === "video" ? t("Video reviews from our clients") : t("Our projects on Instagram") }}
        </h1>
        <p class="lead">
          {{
            activeTab === "video"
              ? t("Watch how Ko'kcha doors look in real interiors — hotels, salons, offices and homes of our clients.")
              : t("Follow @kokcha.eshiklari.uz on Instagram to see our latest completed projects and behind-the-scenes moments.")
          }}
        </p>

        <div class="tabs" role="tablist" :aria-label="t('Video')">
          <button
            v-for="(tab, i) in tabs"
            :id="`tab-${tab.id}`"
            :key="tab.id"
            :ref="(el) => (tabRefs[i] = el)"
            class="tabs__btn"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            :tabindex="activeTab === tab.id ? 0 : -1"
            @click="activeTab = tab.id"
            @keydown="onTabKeydown($event, i)"
          >
            {{ t(tab.label) }}
          </button>
        </div>
      </div>
    </section>

    <section
      v-if="activeTab === 'video'"
      id="panel-video"
      class="section section--flush-top"
      role="tabpanel"
      aria-labelledby="tab-video"
    >
      <div class="container">
        <ul class="video-grid">
          <li v-for="(video, i) in sortedVideos" :key="video.id" v-reveal="(i % 3) * 80">
            <VideoCard :video="video" @play="activeVideo = $event" />
          </li>
        </ul>
      </div>
    </section>

    <section v-else id="panel-projects" class="section section--flush-top" role="tabpanel" aria-labelledby="tab-projects">
      <div class="container">
        <div class="follow">
          <span class="follow__icon"><UiIcon name="instagram" :size="22" /></span>
          <span class="follow__handle">{{ INSTAGRAM_HANDLE }}</span>
          <a class="btn btn--primary btn--sm follow__btn" :href="INSTAGRAM_URL" target="_blank" rel="noopener noreferrer">
            {{ t("Open") }} Instagram
            <UiIcon name="arrow-up-right" />
          </a>
        </div>

        <ul class="insta-grid">
          <li v-for="post in instagramPosts" :key="post.url">
            <a class="insta-card" :href="post.url" target="_blank" rel="noopener noreferrer">
              <AppImage :src="post.image" :alt="`${INSTAGRAM_HANDLE} — ${post.type === 'reel' ? t('Reel') : t('Post')}`" />
              <span class="insta-card__type">
                <UiIcon :name="post.type === 'reel' ? 'play' : 'instagram'" :size="14" />
                {{ post.type === "reel" ? t("Reel") : t("Post") }}
              </span>
              <span class="insta-card__open">
                {{ t("Open") }} <UiIcon name="arrow-up-right" :size="16" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <VideoModal :video="activeVideo" @close="activeVideo = null" />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.vp-hero {
  padding-top: calc(var(--header-h) + clamp(2.5rem, 1.5rem + 4vw, 5rem));
  padding-bottom: var(--space-7);
}

.vp-hero__inner {
  display: grid;
  gap: var(--space-5);
  justify-items: start;
}

.tabs {
  display: inline-flex;
  margin-top: var(--space-3);
  border-bottom: 1px solid var(--border-strong);
}

.tabs__btn {
  position: relative;
  min-height: 48px;
  padding: 0 var(--space-5);
  font-weight: 600;
  color: var(--text-muted);
  transition: color var(--dur) var(--ease);

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform var(--dur) var(--ease-out);
  }

  &:hover {
    color: var(--text);
  }

  &[aria-selected="true"] {
    color: var(--text);

    &::after {
      transform: scaleX(1);
    }
  }
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6) var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-7) var(--space-5);
  }
}

.follow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3) var(--space-4);
  margin-bottom: var(--space-6);
  padding: var(--space-4) var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
}

.follow__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--surface-alt);
  color: var(--accent-ink);
}

.follow__handle {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
}

.follow__btn {
  margin-left: auto;

  @include down(sm) {
    margin-left: 0;
    width: 100%;
  }
}

.insta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-5);
  }
}

.insta-card {
  position: relative;
  display: block;
  aspect-ratio: 9 / 14;
  overflow: hidden;
  background: var(--surface-alt);
  color: var(--c-ivory);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    inset: 0;
    background: linear-gradient(180deg, rgba(36, 35, 32, 0.35) 0%, transparent 30%, transparent 60%, rgba(36, 35, 32, 0.7) 100%);
  }

  :deep(img) {
    transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out);
  }

  &:hover :deep(img) {
    transform: scale(1.04);
  }
}

.insta-card__type,
.insta-card__open {
  position: absolute;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.insta-card__type {
  top: var(--space-4);
  left: var(--space-4);
}

.insta-card__open {
  left: var(--space-4);
  bottom: var(--space-4);
}
</style>
