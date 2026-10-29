<template>
  <div class="about">
    <PageHero
      :eyebrow="t('About the company')"
      :lead="t('We produce and install entrance and interior doors in Tashkent. Individual sizes, finishes, fittings and installation are turnkey.')"
      image="/media/showroom.jpg"
      :image-alt="t('Showroom')"
      :caption="t('Showroom')"
    >
      <template #title>
        Ko‘kcha Eshiklar — <em>{{ t("modern doors") }}</em> {{ t("for interior and entrance solutions") }}
      </template>
      <template #actions>
        <RouterLink class="btn btn--primary" :to="{ name: 'products' }">
          {{ t("Catalog") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </RouterLink>
        <RouterLink class="btn btn--outline" :to="{ name: 'builders' }">{{ t("For builders") }}</RouterLink>
        <RouterLink class="btn btn--ghost" :to="{ name: 'designers' }">{{ t("For designers") }}</RouterLink>
      </template>
      <ul class="about__chips">
        <li class="chip chip--static">{{ t("Individual production") }}</li>
        <li class="chip chip--static">{{ t("Turnkey installation") }}</li>
        <li class="chip chip--static">{{ t("Quality assurance") }}</li>
      </ul>
    </PageHero>

    <!-- Показатели (значения прежнего сайта) -->
    <section class="section section--tight section--white" aria-label="Ko'kcha eshiklar">
      <div class="container">
        <dl ref="statsEl" class="stat-row">
          <div class="stat">
            <dt class="stat__label">{{ t("on the market") }}</dt>
            <dd class="stat__value">{{ display.year }}</dd>
          </div>
          <div class="stat">
            <dt class="stat__label">{{ t("projects") }}</dt>
            <dd class="stat__value">{{ display.projects }}+</dd>
          </div>
          <div class="stat">
            <dt class="stat__label">{{ t("cities/countries") }}</dt>
            <dd class="stat__value">{{ display.cities }}</dd>
          </div>
          <div class="stat">
            <dt class="stat__label">{{ t("support") }}</dt>
            <dd class="stat__value">24/7</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Качество -->
    <section class="section">
      <div class="container split">
        <figure class="split__media" v-reveal>
          <div class="media-frame ratio-4x5">
            <AppImage src="/media/workshop.jpg" :alt="t('Production')" />
          </div>
        </figure>
        <div class="split__text">
          <p class="eyebrow" v-reveal>{{ t("Production") }}</p>
          <h2 class="h2" v-reveal>{{ t("Quality as a philosophy") }}</h2>
          <p class="lead" v-reveal>
            {{ t("We keep the focus on the material, precise assembly and clean installation. The door should look neat, modern and last a long time.") }}
          </p>
          <p class="text-muted" v-reveal>{{ t("About company description") }}</p>
          <ul class="rule-list" v-reveal>
            <li v-for="(b, i) in bullets" :key="b.title">
              <span class="rule-list__mark">{{ String(i + 1).padStart(2, "0") }}</span>
              <div>
                <h3 class="h4">{{ t(b.title) }}</h3>
                <p class="text-muted">{{ t(b.text) }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Детали -->
    <section class="section section--dark">
      <div class="container">
        <div class="details">
          <div class="details__text" v-reveal>
            <p class="eyebrow">{{ t("Service") }}</p>
            <h2 class="h2">{{ t("The details decide everything") }}</h2>
            <p class="lead">
              {{ t("We assemble the product so that it looks good and fits exactly into the the project did not create any problems after installation.") }}
            </p>
          </div>
          <ol class="details__cards">
            <li v-for="(m, i) in craft" :key="m.title" class="details__card" v-reveal="i * 90">
              <span class="details__num">{{ String(i + 1).padStart(2, "0") }}</span>
              <h3 class="h3">{{ t(m.title) }}</h3>
              <p>{{ t(m.text) }}</p>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Партнёрам -->
    <section class="section">
      <div class="container">
        <SectionHeader
          :eyebrow="t('Partner Program')"
          :title="t('We work with partners')"
          :lead="t('Separate working conditions and a convenient format for designers, builders and project clients.')"
        />
        <div class="partner-links">
          <RouterLink class="card card--link" :to="{ name: 'designers' }" v-reveal>
            <h3 class="h3">{{ t("For designers") }}</h3>
            <p class="text-muted">{{ t("Selection of finishes, textures, fittings and interior solutions.") }}</p>
            <span class="partner-links__more">{{ t("Go over") }} <UiIcon name="arrow-right" :size="18" /></span>
          </RouterLink>
          <RouterLink class="card card--link" :to="{ name: 'builders' }" v-reveal="90">
            <h3 class="h3">{{ t("For builders") }}</h3>
            <p class="text-muted">{{ t("Wholesale conditions, stable supplies and facility support.") }}</p>
            <span class="partner-links__more">{{ t("Go over") }} <UiIcon name="arrow-right" :size="18" /></span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Контакты -->
    <section id="contacts" class="section section--alt" aria-labelledby="contacts-title">
      <div class="container">
        <SectionHeader
          :eyebrow="t('Contacts')"
          :title="t('Contacts')"
          :lead="t('Contact us and we will tell you about the models, terms and cost.')"
          title-id="contacts-title"
        />
        <div class="contacts">
          <div class="contacts__item">
            <span class="contacts__icon"><UiIcon name="phone" /></span>
            <p class="field__label">{{ t("Telephone") }}</p>
            <a class="contacts__value" :href="`tel:${PHONE_TEL}`">{{ PHONE_DISPLAY }}</a>
            <p class="text-muted">{{ t("Daily") }} {{ WORKING_HOURS }}</p>
          </div>
          <div class="contacts__item">
            <span class="contacts__icon"><UiIcon name="pin" /></span>
            <p class="field__label">{{ t("Address") }}</p>
            <p class="contacts__value">{{ t("Tashkent, Shaikhantakhur district, Sebzar-7") }}</p>
            <p class="text-muted">{{ t("Showroom") }}</p>
          </div>
          <div class="contacts__item">
            <span class="contacts__icon"><UiIcon name="globe" /></span>
            <p class="field__label">{{ t("Geography") }}</p>
            <p class="contacts__value">{{ t("Tashkent • Bishkek • Dushanbe") }}</p>
            <p class="text-muted">{{ t("Delivery by region") }}</p>
          </div>
        </div>
        <div class="contacts__map">
          <AboutMap />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import AboutMap from "@/components/partials/AboutMap.vue";
import PageHero from "@/components/sections/PageHero.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import AppImage from "@/components/ui/AppImage.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { PHONE_DISPLAY, PHONE_TEL, WORKING_HOURS } from "@/config/company";

const { t } = useI18n();

const bullets = [
  { title: "Control at each stage", text: "From measurement to installation and final inspection." },
  { title: "Customized solutions", text: "Sizes, finishes, fittings — for your project." },
  { title: "Modern design", text: "From classics to minimalism, its neat and relevant." },
];

const craft = [
  { title: "Measuring", text: "accurate and fast" },
  { title: "Production", text: "under the project" },
  { title: "Mounting", text: "clean and tidy" },
];

// Счётчики: те же значения, что были на прежней странице.
const TARGET = { projects: 1740, cities: 3 };
const display = reactive({ year: 2022, projects: TARGET.projects, cities: TARGET.cities });
const statsEl = ref(null);
let observer = null;
let rafId = null;

const animate = () => {
  const start = performance.now();
  const duration = 1100;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const ease = 1 - Math.pow(1 - p, 3);
    display.projects = Math.round(TARGET.projects * ease);
    display.cities = Math.max(1, Math.round(TARGET.cities * ease));
    if (p < 1) rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  display.projects = 0;
  display.cities = 1;
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        animate();
        observer.disconnect();
      }
    },
    { threshold: 0.4 },
  );
  observer.observe(statsEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.about__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.stat {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
}

.split {
  display: grid;
  gap: var(--space-7);
  align-items: center;

  @include up(lg) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(3rem, 2rem + 5vw, 8rem);
  }
}

.split__media {
  margin: 0;
}

.split__text {
  display: grid;
  gap: var(--space-5);
}

.details {
  display: grid;
  gap: var(--space-7);

  @include up(lg) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: clamp(3rem, 2rem + 4vw, 6rem);
    align-items: end;
  }
}

.details__text {
  display: grid;
  gap: var(--space-5);
}

.details__cards {
  display: grid;
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.details__card {
  display: grid;
  gap: var(--space-3);
  align-content: start;
  padding: var(--space-5);
  border: 1px solid rgba(243, 238, 230, 0.16);

  p {
    color: var(--text-on-dark-muted);
  }
}

.details__num {
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1;
  color: var(--c-oak);
}

.partner-links {
  display: grid;
  gap: var(--space-4);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-5);
  }
}

.partner-links__more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: auto;
  font-size: var(--fs-sm);
  font-weight: 600;
}

.contacts {
  display: grid;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-5);
  }
}

.contacts__item {
  display: grid;
  gap: var(--space-2);
  align-content: start;
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
}

.contacts__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--space-2);
  border-radius: 50%;
  background: var(--surface-alt);
  color: var(--accent-ink);
}

.contacts__value {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  line-height: 1.2;
}

a.contacts__value:hover {
  color: var(--accent-ink);
}
</style>
