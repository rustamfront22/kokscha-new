<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import CarouselMain from "@/components/views/home/CarouselMain.vue";
import NewProducts from "@/components/views/home/NewProducts.vue";
import VideoCard from "@/components/views/video/VideoCard.vue";
import VideoModal from "@/components/views/video/VideoModal.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import AppImage from "@/components/ui/AppImage.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import CtaBand from "@/components/sections/CtaBand.vue";
import { companyContent } from "@/components/content/companyContent";
import { partners } from "@/content/partners";
import { sortedVideos } from "@/content/media";
import { useProductStore } from "@/store/product";

const { t } = useI18n();
const store = useProductStore();

// Показатели — те же, что на странице «Сотрудничество» (реальные данные компании).
const stats = [
  { value: "4+", label: "years on the market" },
  { value: "10", label: "door warranty", suffix: "years" },
  { value: "GOST / ISO", label: "quality standards", small: true },
  { value: "min / max", label: "custom-made", small: true },
];

const benefits = companyContent.benefits.items;

const materials = [
  "PVC veneer, enamel, patina",
  "A wide range of models and coatings",
  "Custom size manufacturing",
  "Comprehensive interior solutions",
  "Reliable design and modern production",
];

const craft = [
  { title: "Measuring", text: "accurate and fast" },
  { title: "Production", text: "under the project" },
  { title: "Mounting", text: "clean and tidy" },
];

const audiences = [
  { route: "designers", title: "For designers", text: "Selection of finishes, textures, fittings and interior solutions.", image: "/media/door-detail.jpg" },
  { route: "builders", title: "For builders", text: "Wholesale conditions, stable supplies and facility support.", image: "/media/workshop.jpg" },
  {
    route: "partners",
    title: "Cooperation",
    text: "Stable supplies, facility support and favorable terms for construction companies, contractors and fit-out teams.",
    image: "/media/showroom.jpg",
  },
];

const categories = computed(() => store.categories);
const homeVideos = sortedVideos.slice(0, 3);
const activeVideo = ref(null);

onMounted(() => {
  store.fetchProducts().catch(() => {});
});
</script>

<template>
  <div class="home">
    <CarouselMain />

    <!-- О бренде -->
    <section class="section intro">
      <div class="container intro__grid">
        <div class="intro__text" v-reveal>
          <p class="eyebrow">{{ t("About the company") }}</p>
          <h2 class="h2">{{ t("Quality as a philosophy") }}</h2>
          <p class="lead">{{ t("About company description") }}</p>
          <p class="text-muted">
            {{ t("We keep the focus on the material, precise assembly and clean installation. The door should look neat, modern and last a long time.") }}
          </p>
          <RouterLink :to="{ name: 'about' }" class="btn btn--link">
            {{ t("More detailed") }}
            <UiIcon name="arrow-right" class="btn__arrow" />
          </RouterLink>
        </div>
        <figure class="intro__media" v-reveal="120">
          <div class="media-frame ratio-4x5">
            <AppImage src="/media/door-detail.jpg" :alt="t('Showroom')" />
          </div>
        </figure>
      </div>

      <div class="container">
        <dl class="stat-row intro__stats">
          <div v-for="(s, i) in stats" :key="s.label" class="stat" v-reveal="i * 80">
            <dt class="stat__label">{{ t(s.label) }}</dt>
            <dd class="stat__value" :class="{ 'stat__value--small': s.small }">
              {{ s.value.includes("/") ? t(s.value) : s.value }}
              <span v-if="s.suffix" class="stat__suffix">{{ t(s.suffix) }}</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Категории каталога -->
    <section class="section section--white">
      <div class="container">
        <SectionHeader :eyebrow="t('Catalog')" :title="t('Choose the perfect door for your project.')" align="split">
          <template #actions>
            <RouterLink :to="{ name: 'products' }" class="btn btn--outline">
              {{ t("View all models") }}
              <UiIcon name="arrow-right" class="btn__arrow" />
            </RouterLink>
          </template>
        </SectionHeader>

        <ul v-if="store.isLoading" class="categories" aria-hidden="true">
          <li v-for="n in 4" :key="n"><div class="skeleton categories__skeleton" /></li>
        </ul>
        <ul v-else-if="categories.length" class="categories">
          <li v-for="(cat, i) in categories" :key="cat.name" v-reveal="(i % 4) * 70">
            <RouterLink :to="{ name: 'products', query: { cat: cat.name } }" class="category-tile">
              <div class="category-tile__media">
                <AppImage :src="cat.cover" alt="" fit="contain" />
              </div>
              <div class="category-tile__body">
                <h3 class="category-tile__title">{{ cat.name }}</h3>
                <p class="category-tile__count">{{ t("Models: {count}", { count: cat.count }) }}</p>
              </div>
              <span class="category-tile__arrow" aria-hidden="true"><UiIcon name="arrow-up-right" :size="18" /></span>
            </RouterLink>
          </li>
          <li v-reveal="(categories.length % 4) * 70">
            <RouterLink :to="{ name: 'products' }" class="category-tile category-tile--all">
              <div class="category-tile__all">
                <UiIcon name="door" :size="40" :stroke-width="1.1" />
                <span class="category-tile__title">{{ t("View all models") }}</span>
                <span class="category-tile__count">{{ t("Models: {count}", { count: store.products.length }) }}</span>
              </div>
              <span class="category-tile__arrow" aria-hidden="true"><UiIcon name="arrow-right" :size="18" /></span>
            </RouterLink>
          </li>
        </ul>
        <p v-else class="text-muted">
          <RouterLink :to="{ name: 'products' }" class="btn btn--link">{{ t("Catalog") }}</RouterLink>
        </p>
      </div>
    </section>

    <!-- Новые модели -->
    <NewProducts class="section home__rail" :eyebrow="t('New products')" :lead="t('Fresh solutions for a modern interior')" />

    <!-- Преимущества -->
    <section class="section section--white">
      <div class="container benefits">
        <div class="benefits__head" v-reveal>
          <p class="eyebrow">{{ t("Advantages") }}</p>
          <h2 class="h2">{{ t("Why is it convenient to work with us") }}</h2>
          <p class="lead">{{ t("Not just doors, but clear work with the project, materials and the client.") }}</p>
        </div>
        <ol class="benefits__list">
          <li v-for="(b, i) in benefits" :key="b.title" class="benefits__item" v-reveal="i * 60">
            <span class="benefits__num">{{ String(i + 1).padStart(2, "0") }}</span>
            <div>
              <h3 class="h3">{{ t(b.title) }}</h3>
              <p class="text-muted">{{ t(b.text) }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Материалы и решения -->
    <section class="section section--dark materials">
      <div class="container materials__grid">
        <figure class="materials__media" v-reveal>
          <div class="media-frame ratio-4x5">
            <AppImage src="/media/finishing.jpg" :alt="t('Production')" />
          </div>
        </figure>
        <div class="materials__text">
          <p class="eyebrow" v-reveal>{{ t("Product Advantages") }}</p>
          <h2 class="h2" v-reveal>{{ t("The details decide everything") }}</h2>
          <p class="lead" v-reveal>
            {{ t("We assemble the product so that it looks good and fits exactly into the the project did not create any problems after installation.") }}
          </p>
          <ul class="rule-list materials__list" v-reveal>
            <li v-for="(m, i) in materials" :key="m">
              <span class="rule-list__mark">{{ String(i + 1).padStart(2, "0") }}</span>
              <span>{{ t(m) }}</span>
            </li>
          </ul>
          <dl class="materials__craft" v-reveal>
            <div v-for="c in craft" :key="c.title">
              <dt class="h4">{{ t(c.title) }}</dt>
              <dd class="text-muted">{{ t(c.text) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Профессионалам -->
    <section class="section">
      <div class="container">
        <SectionHeader
          :eyebrow="t('Partner Program')"
          :title="t('We work with partners')"
          :lead="t('Separate working conditions and a convenient format for designers, builders and project clients.')"
        />
        <ul class="audiences">
          <li v-for="(a, i) in audiences" :key="a.route" v-reveal="i * 90">
            <RouterLink :to="{ name: a.route }" class="audience">
              <div class="audience__media">
                <AppImage :src="a.image" alt="" />
              </div>
              <div class="audience__body">
                <h3 class="h3">{{ t(a.title) }}</h3>
                <p>{{ t(a.text) }}</p>
                <span class="audience__link">
                  {{ t("More detailed") }} <UiIcon name="arrow-right" :size="18" />
                </span>
              </div>
            </RouterLink>
          </li>
        </ul>

        <div class="logos" v-reveal>
          <div class="logos__head">
            <p class="eyebrow">{{ t("Our partners") }}</p>
            <RouterLink :to="{ name: 'our-partners' }" class="btn btn--link">
              {{ t("Companies that trust Ko'kcha doors") }}
              <UiIcon name="arrow-right" class="btn__arrow" />
            </RouterLink>
          </div>
          <ul class="logos__list">
            <li v-for="p in partners" :key="p.name">
              <img :src="p.logo" :alt="p.name" loading="lazy" decoding="async" />
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Видео -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeader :eyebrow="t('Video')" :title="t('Video reviews from our clients')" align="split">
          <template #actions>
            <RouterLink :to="{ name: 'video' }" class="btn btn--outline">
              {{ t("All videos") }}
              <UiIcon name="arrow-right" class="btn__arrow" />
            </RouterLink>
          </template>
        </SectionHeader>
        <ul class="home-videos">
          <li v-for="(v, i) in homeVideos" :key="v.id" v-reveal="i * 90">
            <VideoCard :video="v" :show-date="false" @play="activeVideo = $event" />
          </li>
        </ul>
      </div>
    </section>

    <CtaBand
      :title="t('Do you need help choosing?')"
      :text="t('Leave a request and we will select the doors for your interior and budget.')"
      origin="home"
    />

    <VideoModal :video="activeVideo" @close="activeVideo = null" />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

/* О бренде (стили hero — в CarouselMain.vue) */
.intro__grid {
  display: grid;
  gap: var(--space-7);
  align-items: center;

  @include up(lg) {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: clamp(3rem, 2rem + 5vw, 8rem);
  }
}

.intro__text {
  display: grid;
  gap: var(--space-5);
  justify-items: start;
}

.intro__media {
  margin: 0;
}

.intro__stats {
  margin-top: var(--space-8);
}

.stat__value--small {
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem);
}

.stat__suffix {
  font-size: 0.5em;
  color: var(--text-muted);
}

.stat {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;

  .stat__label {
    margin-top: var(--space-3);
  }
}

/* Категории */
.categories {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }

  @include up(xl) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.categories__skeleton {
  aspect-ratio: 4 / 5;
}

.category-tile {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  border: 1px solid var(--border);
  background: var(--c-ivory);
  transition: border-color var(--dur) var(--ease), background-color var(--dur) var(--ease);

  &:hover {
    border-color: var(--c-graphite);
    background: var(--c-linen);
  }
}

.category-tile--all {
  grid-template-rows: 1fr;
  background: var(--c-graphite);
  border-color: var(--c-graphite);
  color: var(--c-ivory);

  &:hover {
    background: var(--c-walnut);
    border-color: var(--c-walnut);
  }

  .category-tile__count {
    color: var(--text-on-dark-muted);
  }

  .category-tile__arrow {
    background: transparent;
    border-color: rgba(245, 241, 233, 0.4);
  }
}

.category-tile__all {
  display: grid;
  align-content: end;
  gap: var(--space-2);
  min-height: 100%;
  padding: var(--space-5) var(--space-4);
  color: var(--c-ivory);

  svg {
    margin-bottom: auto;
    color: var(--c-oak);
  }
}

.category-tile__media {
  aspect-ratio: 4 / 5;
  padding: 9% 24% 6%;
  overflow: hidden;

  :deep(img) {
    mix-blend-mode: multiply;
    object-position: center;
    transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out);
  }
}

.category-tile:hover .category-tile__media :deep(img) {
  transform: translateY(-4px) scale(1.03);
}

.category-tile__body {
  padding: var(--space-4);
  border-top: 1px solid var(--border);
}

.category-tile__title {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem);
  line-height: 1.15;
}

.category-tile__count {
  margin-top: var(--space-1);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.category-tile__arrow {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  background: var(--c-ivory);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.category-tile:hover .category-tile__arrow {
  background: var(--c-graphite);
  color: var(--c-ivory);
}

/* Лента новинок */
.home__rail {
  background: var(--bg);
}

/* Преимущества */
.benefits {
  display: grid;
  gap: var(--space-7);

  @include up(lg) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(3rem, 2rem + 4vw, 7rem);
  }
}

.benefits__head {
  display: grid;
  gap: var(--space-4);
  align-content: start;

  @include up(lg) {
    position: sticky;
    top: calc(var(--header-h) + var(--space-6));
  }
}

.benefits__list {
  border-top: 1px solid var(--border-strong);
}

.benefits__item {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  gap: var(--space-4);
  padding-block: var(--space-6);
  border-bottom: 1px solid var(--border);

  .h3 {
    margin-bottom: var(--space-2);
  }
}

.benefits__num {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1.3;
  color: var(--accent);
}

/* Материалы */
.materials__grid {
  display: grid;
  gap: var(--space-7);
  align-items: center;

  @include up(lg) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(3rem, 2rem + 5vw, 8rem);
  }
}

.materials__media {
  margin: 0;
}

.materials__text {
  display: grid;
  gap: var(--space-5);
}

.materials__craft {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-3);

  dd {
    margin-top: var(--space-1);
    font-size: var(--fs-sm);
  }

  @include down(sm) {
    grid-template-columns: 1fr;
  }
}

/* Аудитории */
.audiences {
  display: grid;
  gap: var(--space-4);

  @include up(lg) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-5);
  }
}

.audience {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: border-color var(--dur) var(--ease);

  &:hover {
    border-color: var(--c-graphite);
  }
}

.audience__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;

  :deep(img) {
    transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out);
  }
}

.audience:hover .audience__media :deep(img) {
  transform: scale(1.04);
}

.audience__body {
  display: grid;
  gap: var(--space-3);
  align-content: start;
  padding: var(--space-5);

  p {
    color: var(--text-muted);
  }
}

.audience__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-2);
  font-size: var(--fs-sm);
  font-weight: 600;
}

/* Логотипы партнёров */
.logos {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border);
}

.logos__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.logos__list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @include up(xl) {
    grid-template-columns: repeat(9, minmax(0, 1fr));
  }

  li {
    display: grid;
    place-items: center;
    aspect-ratio: 1 / 1;
    padding: var(--space-3);
    background: var(--surface);
    border: 1px solid var(--border);
  }

  img {
    max-height: 100%;
    width: auto;
    object-fit: contain;
    border-radius: var(--radius-sm);
    filter: grayscale(1);
    opacity: 0.8;
    transition: filter var(--dur) var(--ease), opacity var(--dur) var(--ease);
  }

  li:hover img {
    filter: none;
    opacity: 1;
  }
}

/* Видео */
.home-videos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);

  > li:nth-child(3) {
    display: none;
  }

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-5);

    > li:nth-child(3) {
      display: block;
    }
  }
}
</style>
