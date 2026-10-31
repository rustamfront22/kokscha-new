<template>
  <section class="hero theme-dark" aria-labelledby="hero-title">
    <div class="hero__backdrop" aria-hidden="true">
      <picture>
        <source media="(max-width: 767px)" srcset="/media/hero-poster-sm.jpg" />
        <img src="/media/hero-poster.jpg" alt="" fetchpriority="high" decoding="async" />
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
        @playing="onPlaying"
        @pause="playing = false"
      />
    </div>

    <div class="container hero__grid">
      <div class="hero__text">
        <p class="label-mono hero__kicker">Ko‘kcha eshiklar · {{ t("Production") }}</p>
        <h1 id="hero-title" class="hero-title hero__title">
          <span class="hero__line">{{ t("Doors —") }}</span>
          <em class="hero__line">{{ t("part of the architecture") }}</em>
        </h1>
        <p class="hero__lead">
          {{ t("Modern interior and entrance doors.  Model selection, consultation, turnkey delivery and installation.") }}
        </p>
        <div class="actions hero__actions">
          <a href="#collections" class="btn btn--primary btn--lg" @click="scrollTo($event, '#collections')">
            {{ t("Explore the collection") }}
            <UiIcon name="arrow-right" class="btn__arrow" />
          </a>
          <a href="#configurator" class="btn btn--outline btn--lg" @click="scrollTo($event, '#configurator')">
            {{ t("Find your door") }}
          </a>
        </div>
      </div>

      <!-- Интерактив первого экрана: реальная модель из CRM в подсвеченной нише -->
      <figure class="hero__stage">
        <!-- Освещённый проём в полутёмном шоуруме: свет из проёма, наличник-контур, пол -->
        <div class="hero__niche">
          <span class="hero__floor" aria-hidden="true" />
          <div class="hero__opening">
            <Transition name="door" mode="out-in">
              <div v-if="active" :key="active.id" class="hero__door" :class="{ 'is-loaded': loadedSrc === active.thumbnail }">
                <img :src="active.thumbnail" :alt="doorAlt(active)" decoding="async" @load="loadedSrc = active.thumbnail" />
              </div>
              <!-- Пока каталог грузится — силуэт двери в тон проёма, а не тёмный блок -->
              <div v-else class="hero__door hero__door--loading" aria-hidden="true"><span /></div>
            </Transition>
          </div>
          <span class="hero__scale label-mono" aria-hidden="true">{{ active?.size || "2.40 x 0.90" }}</span>
        </div>

        <figcaption class="hero__caption">
          <span class="label-mono">{{ t("Try it") }}</span>
          <div class="hero__picks" role="group" :aria-label="t('Collections')">
            <button
              v-for="item in picks"
              :key="item.id"
              type="button"
              class="hero__pick"
              :aria-pressed="active?.id === item.id"
              @click="activeId = item.id"
            >
              {{ typeLabel(item.type) }}
            </button>
          </div>
          <RouterLink v-if="active" :to="{ name: 'product', params: { id: active.id } }" class="hero__model">
            {{ t("Model") }} {{ active.title }}
            <span>· {{ colorLabel(active.color) }}</span>
            <UiIcon name="arrow-up-right" :size="16" />
          </RouterLink>
        </figcaption>
      </figure>
    </div>

    <div class="container hero__bottom">
      <dl ref="statsEl" class="hero__stats">
        <div v-for="s in stats" :key="s.label" class="hero__stat">
          <dt class="label-mono">{{ t(s.label) }}</dt>
          <dd>{{ s.display }}<span v-if="s.suffix">{{ s.suffix }}</span></dd>
        </div>
      </dl>
      <div class="hero__tools">
        <button
          v-if="videoSrc"
          class="hero__toggle"
          type="button"
          :aria-label="playing ? t('Pause video') : t('Play video')"
          @click="togglePlay"
        >
          <UiIcon :name="playing ? 'pause' : 'play'" :size="14" />
        </button>
        <a href="#story" class="hero__scroll label-mono" @click="scrollTo($event, '#story')">
          <span class="hero__scroll-line" aria-hidden="true" />
          {{ t("Scroll") }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import { useProductStore } from "@/store/product";
import { colorLabel } from "@/utils/doorColors";
import { typeLabel } from "@/utils/crmLabels";

const { t } = useI18n();
const store = useProductStore();

// Сжатая копия /video/hero.mp4 (≈3,8 МБ вместо 68 МБ); оригинал в public не удалён.
const HERO_VIDEO = "/media/hero-720.mp4";

const video = ref(null);
const videoSrc = ref("");
const videoReady = ref(false);
const playing = ref(false);
let idleHandle = null;

// По одной модели из каждой из первых четырёх коллекций — реальные данные CRM
const picks = computed(() =>
  store.categories
    .slice(0, 4)
    .map((c) => store.products.find((p) => p.type === c.name))
    .filter(Boolean),
);
const activeId = ref(null);
// Фото проявляется после загрузки, чтобы не было «пустого» проёма и рывка
const loadedSrc = ref(null);
const active = computed(() => store.findById(activeId.value) || picks.value[0] || null);

const doorAlt = (p) => [`${t("Model")} ${p.title}`, typeLabel(p.type), colorLabel(p.color)].filter(Boolean).join(", ");

const scrollTo = (e, selector) => {
  const el = document.querySelector(selector);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  history.replaceState(null, "", selector);
};

/* ---------- Счётчики ---------- */
const statsEl = ref(null);
const stats = reactive([
  { label: "models in the catalog", target: 0, display: "—" },
  { label: "collections", target: 0, display: "—" },
  { label: "projects", target: 1740, display: "1740", suffix: "+" },
  { label: "door warranty", target: 10, display: "10", suffix: "" },
]);

watch(
  () => store.status,
  () => {
    if (store.status !== "success") return;
    stats[0].target = store.products.length;
    stats[1].target = store.categories.length;
    stats[0].display = String(stats[0].target);
    stats[1].display = String(stats[1].target);
  },
  { immediate: true },
);

let counterObserver = null;
let rafId = null;

const runCounters = () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / 1200);
    const ease = 1 - Math.pow(1 - p, 3);
    stats.forEach((s) => {
      if (s.target) s.display = String(Math.round(s.target * ease));
    });
    if (p < 1) rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
};

/* ---------- Видео ---------- */
const shouldLoadVideo = () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = navigator.connection;
  return !(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")));
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
  store.fetchProducts().catch(() => {});

  const schedule = () => {
    const start = () => shouldLoadVideo() && (videoSrc.value = HERO_VIDEO);
    idleHandle = "requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 1200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  if ("IntersectionObserver" in window && statsEl.value) {
    counterObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || store.status !== "success") return;
        runCounters();
        counterObserver.disconnect();
      },
      { threshold: 0.6 },
    );
    // Ждём данные каталога, чтобы анимировать реальные значения.
    // Важно: без immediate — иначе при повторном заходе (каталог уже в кэше) колбэк
    // вызывался до объявления stop, падал с ReferenceError и «замораживал» навигацию.
    const observeCounters = () => counterObserver?.observe(statsEl.value);
    if (store.status === "success") {
      observeCounters();
    } else {
      const stop = watch(
        () => store.status,
        (s) => {
          if (s === "success") {
            observeCounters();
            stop();
          }
        },
      );
    }
  }
});

onBeforeUnmount(() => {
  counterObserver?.disconnect();
  if (rafId) cancelAnimationFrame(rafId);
  if (idleHandle && "cancelIdleCallback" in window) cancelIdleCallback(idleHandle);
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
  min-height: max(680px, min(100svh, 1000px));
  padding-top: var(--header-h);
  overflow: hidden;
}

.hero__backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  z-index: -1;
  background: var(--c-graphite-deep);

  img,
  video {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.32;
  }

  video {
    opacity: 0;
    transition: opacity 1.4s var(--ease);

    &.is-ready {
      opacity: 0.3;
    }
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    inset: 0;
    background:
      linear-gradient(90deg, var(--c-graphite-deep) 0%, rgba(22, 21, 19, 0.72) 45%, rgba(22, 21, 19, 0.35) 100%),
      linear-gradient(0deg, var(--c-graphite-deep) 0%, transparent 30%);
  }
}

.hero__grid {
  display: grid;
  gap: var(--space-7);
  align-items: center;
  padding-block: var(--space-7) var(--space-6);

  @include up(lg) {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
    gap: var(--space-8);
  }
}

.hero__text {
  display: grid;
  gap: var(--space-5);
  justify-items: start;
}

.hero__kicker {
  color: var(--c-oak-light);
}

.hero__line {
  display: block;
  animation: rise var(--dur-slow) var(--ease-out) both;
}

.hero__line + .hero__line {
  animation-delay: 120ms;
}

.hero__lead {
  max-width: 46ch;
  font-size: var(--fs-lead);
  color: var(--text-muted);
  animation: rise var(--dur-slow) var(--ease-out) 220ms both;
}

.hero__actions {
  animation: rise var(--dur-slow) var(--ease-out) 320ms both;

  @include down(sm) {
    width: 100%;

    .btn {
      flex: 1 1 100%;
    }
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}

/* Ниша с дверью */
.hero__stage {
  display: grid;
  gap: var(--space-4);
  justify-items: center;
  margin: 0;
  animation: rise 900ms var(--ease-out) 200ms both;
}

.hero__niche {
  position: relative;
  width: min(100%, 440px);
  aspect-ratio: 3 / 4;

  // Тёплый рассеянный свет, который проём отбрасывает в тёмную комнату — без жёстких краёв
  &::before {
    content: "";
    position: absolute;
    top: -12%;
    right: -30%;
    bottom: -6%;
    left: -30%;
    background:
      radial-gradient(ellipse 34% 46% at 50% 48%, rgba(240, 226, 204, 0.2) 0%, rgba(212, 174, 126, 0.08) 55%, transparent 100%);
    pointer-events: none;
  }

  @include down(lg) {
    width: min(82%, 340px);
  }

  // На телефоне ниша ниже, чтобы выбор коллекции помещался ближе к первому экрану
  @include down(sm) {
    width: min(78%, 280px);
  }
}

// Сам проём: светлый «просвет» с арочным верхом. Светлый фон нужен, чтобы белый фон
// фото двери растворялся через multiply; края смягчены свечением, а не залиты плашкой.
.hero__opening {
  position: absolute;
  top: 5%;
  right: 22%;
  bottom: 15%;
  left: 22%;
  border-radius: 999px 999px 0 0;
  background:
    radial-gradient(ellipse 80% 45% at 50% 18%, #fbf7f0 0%, transparent 100%),
    linear-gradient(180deg, #f3ece1 0%, #ebe1d1 62%, #dccdb6 100%);
  box-shadow:
    0 0 40px 4px rgba(243, 232, 214, 0.16),
    0 0 140px 30px rgba(212, 174, 126, 0.16),
    inset 0 -36px 40px -28px rgba(96, 74, 50, 0.35);

  // Наличник — тонкий контур арки в тон дуба
  &::before {
    content: "";
    position: absolute;
    top: -12px;
    right: -12px;
    bottom: 0;
    left: -12px;
    border: 1px solid rgba(212, 174, 126, 0.5);
    border-bottom: 0;
    border-radius: 999px 999px 0 0;
    pointer-events: none;
  }
}

// Пол: линия порога и световое пятно, которое проём бросает вперёд
.hero__floor {
  position: absolute;
  top: 85%;
  right: -8%;
  left: -8%;
  height: 15%;
  background: radial-gradient(ellipse 42% 70% at 50% 0%, rgba(240, 226, 204, 0.2) 0%, rgba(212, 174, 126, 0.06) 55%, transparent 100%);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(243, 238, 230, 0.28) 30%, rgba(243, 238, 230, 0.28) 70%, transparent);
  }
}

// Дверь стоит на пороге; верх ниже начала арки, чтобы углы фото не выходили за светлый проём
.hero__door {
  position: absolute;
  top: 15%;
  right: 11%;
  bottom: 0;
  left: 11%;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: 50% 100%;
    mix-blend-mode: multiply; // белый фон фото растворяется в проёме
  }
}

.hero__door img {
  opacity: 0;
  transition: opacity 360ms var(--ease);
}

.hero__door.is-loaded img {
  opacity: 1;
}

// Силуэт двери: наличник и филёнка тонкими линиями, по ним проходит мягкий блик
.hero__door--loading {
  display: grid;
  place-items: end center;

  span {
    position: relative;
    display: block;
    height: 100%;
    aspect-ratio: 0.44;
    max-width: 100%;
    overflow: hidden;
    border: 1px solid rgba(160, 138, 74, 0.35);
    border-bottom: 0;
    background: linear-gradient(180deg, rgba(160, 138, 74, 0.06), rgba(160, 138, 74, 0.12));

    // филёнка
    &::before {
      content: "";
      position: absolute;
      top: 12%;
      right: 18%;
      bottom: 10%;
      left: 18%;
      border: 1px solid rgba(160, 138, 74, 0.25);
    }

    // блик
    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: -60%;
      width: 60%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
      animation: hero-shimmer 1.6s var(--ease) infinite;
    }
  }
}

@keyframes hero-shimmer {
  to {
    left: 110%;
  }
}

.hero__scale {
  position: absolute;
  left: 50%;
  bottom: 2%;
  transform: translateX(-50%);
  white-space: nowrap;
  color: var(--text-muted);
}

.hero__caption {
  display: grid;
  gap: var(--space-3);
  justify-items: center;
  text-align: center;
}

.hero__picks {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-1);
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: rgba(22, 21, 19, 0.6);
}

.hero__pick {
  min-height: 36px;
  padding: 0 0.9rem;
  border-radius: var(--radius-pill);
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--text-muted);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);

  &:hover {
    color: var(--text);
  }

  &[aria-pressed="true"] {
    background: var(--c-oak-light);
    color: var(--c-graphite-deep);
  }
}

.hero__model {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-sm);
  font-weight: 600;

  span {
    font-weight: 400;
    color: var(--text-muted);
  }

  &:hover {
    color: var(--c-oak-light);
  }
}

.door-enter-active,
.door-leave-active {
  transition: opacity 320ms var(--ease), transform 420ms var(--ease-out);
}

.door-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.door-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* Низ: счётчики и подсказка прокрутки */
.hero__bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-5);
  padding-bottom: var(--space-5);
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4) var(--space-6);
  flex: 1;
  padding-top: var(--space-5);
  border-top: 1px solid var(--border);

  @include up(md) {
    grid-template-columns: repeat(4, minmax(0, auto));
    justify-content: start;
  }

  dd {
    margin-top: var(--space-1);
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem);
    font-weight: 300;
    letter-spacing: -0.03em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
}

.hero__tools {
  display: flex;
  align-items: center;
  gap: var(--space-4);

  @include down(md) {
    display: none;
  }
}

.hero__toggle {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-strong);
  border-radius: 50%;

  &:hover {
    background: rgba(245, 241, 233, 0.08);
  }
}

.hero__scroll {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
}

.hero__scroll-line {
  position: relative;
  width: 1px;
  height: 44px;
  overflow: hidden;
  background: var(--border-strong);

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: -40%;
    width: 1px;
    height: 40%;
    background: var(--c-oak-light);
    animation: scroll-hint 1.8s var(--ease) infinite;
  }
}

@keyframes scroll-hint {
  to {
    top: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__line,
  .hero__lead,
  .hero__actions,
  .hero__stage {
    animation: none;
  }

  .hero__door--loading span::after {
    animation: none;
  }

  .hero__scroll-line::after {
    animation: none;
    top: 30%;
  }
}
</style>
