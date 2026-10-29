<script setup>
import { useI18n } from "vue-i18n";
import { companyContent } from "@/components/content/companyContent";
import PageHero from "@/components/sections/PageHero.vue";
import ProcessSteps from "@/components/sections/ProcessSteps.vue";
import CtaBand from "@/components/sections/CtaBand.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import AppImage from "@/components/ui/AppImage.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import { PHONE_TEL } from "@/config/company";

const { t } = useI18n();
const c = companyContent;

const facts = [
  { value: "Wholesale", text: "conditions for objects" },
  { value: "GOST", text: "quality standards" },
  { value: "Deadlines", text: "deliveries under stages" },
  { value: "Selection", text: "according to the specification" },
];

const kpis = [
  { value: "×7", text: "faster installation", raw: true },
  { value: "GUST", text: "Quality control" },
  { value: "Wholesale", text: "conditions for projects" },
  { value: "Deadlines", text: "delivery on schedule" },
];

const whatYouGet = [
  { title: "Ready-made kit", text: "Door leaf, frame and pre-installation prep — fewer mistakes and less rework on site." },
  { title: "Saving time", text: "Installation goes faster, without extra fitting or delays on site." },
  { title: "Stable quality", text: "Factory preparation and production control deliver a predictable result." },
  { title: "Deliveries matched to your schedule", text: "We coordinate batches, timelines and configuration to match your construction phase." },
];

const pipeline = [
  { title: "Request", text: "You send us the volume, timelines and requirements for your facility." },
  { title: "Selection", text: "We prepare the specification, models and configuration." },
  { title: "Production", text: "We start manufacturing and control quality." },
  { title: "Delivery", text: "We organize shipment and support throughout the project." },
];

const requestConditions = () => openLeadModal("builders");
</script>

<template>
  <div class="builders">
    <PageHero
      :eyebrow="t('For builders')"
      :title="t(c.builders.heroTitle)"
      :lead="t(c.builders.heroText)"
      image="/media/workshop.jpg"
      :image-alt="t('Production')"
    >
      <template #actions>
        <button class="btn btn--primary" type="button" @click="requestConditions">
          {{ t("Request conditions") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </button>
        <a class="btn btn--outline" :href="`tel:${PHONE_TEL}`">
          <UiIcon name="phone" />
          {{ t("To call") }}
        </a>
      </template>
      <ul class="hero-chips">
        <li class="chip chip--static">{{ t("Wholesale volumes") }}</li>
        <li class="chip chip--static">{{ t("Deadlines for the schedule") }}</li>
        <li class="chip chip--static">{{ t("Object support") }}</li>
      </ul>
    </PageHero>

    <!-- Ключевые условия -->
    <section class="section section--tight section--white">
      <div class="container">
        <dl class="stat-row">
          <div v-for="k in kpis" :key="k.text" class="stat">
            <dt class="stat__label">{{ t(k.text) }}</dt>
            <dd class="stat__value">{{ k.raw ? k.value : t(k.value) }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- Для кого и формат -->
    <section class="section">
      <div class="container about-work">
        <div class="about-work__notes" v-reveal>
          <div class="about-work__note">
            <p class="eyebrow">{{ t("For whom") }}</p>
            <p class="about-work__text">
              {{ t("Builders, contractors, fitters, repair crews, and companies that maintain turnkey facilities.") }}
            </p>
          </div>
          <div class="about-work__note">
            <p class="eyebrow">{{ t("The format of the work") }}</p>
            <p class="about-work__text">
              {{ t("Consultation, selection, coordination of batches, production and delivery.") }}
            </p>
          </div>
        </div>
        <ul class="facts">
          <li v-for="(f, i) in facts" :key="f.text" class="facts__item" v-reveal="i * 70">
            <span class="facts__value">{{ t(f.value) }}</span>
            <span class="facts__text">{{ t(f.text) }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Преимущества дверного блока -->
    <section class="section section--white">
      <div class="container">
        <SectionHeader :eyebrow="t('Advantages')" :title="t(c.builders.heroTitle)" />
        <ul class="perks">
          <li v-for="(p, i) in c.builders.perks" :key="p.title" class="perks__item" v-reveal="i * 70">
            <span class="perks__num">{{ String(i + 1).padStart(2, "0") }}</span>
            <h3 class="h3">{{ t(p.title) }}</h3>
            <p class="text-muted">{{ t(p.text) }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Что получаете на объекте -->
    <section class="section section--dark">
      <div class="container on-site">
        <div class="on-site__head" v-reveal>
          <p class="eyebrow">{{ t("What do you get") }}</p>
          <h2 class="h2">{{ t("What do you get at the facility") }}</h2>
          <p class="lead">
            {{ t("There are fewer delays, fewer improvements, and a more predictable result for each batch.") }}
          </p>
          <figure class="media-frame ratio-16x10 on-site__media">
            <AppImage src="/media/finishing.jpg" :alt="t('Production')" />
          </figure>
        </div>
        <ul class="rule-list on-site__list">
          <li v-for="(x, i) in whatYouGet" :key="x.title" v-reveal="i * 70">
            <span class="rule-list__mark">{{ String(i + 1).padStart(2, "0") }}</span>
            <div>
              <h3 class="h3">{{ t(x.title) }}</h3>
              <p class="on-site__text">{{ t(x.text) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Монтаж дверного блока (контент из companyContent.process) -->
    <section class="section">
      <div class="container install">
        <div class="install__head" v-reveal>
          <p class="eyebrow">{{ t("Mounting") }}</p>
          <h2 class="h2">{{ t(c.process.title) }}</h2>
        </div>
        <div>
          <ol class="install__list">
            <li v-for="(step, i) in c.process.steps" :key="step" v-reveal="i * 50">
              <span class="install__num">{{ i + 1 }}</span>
              <span>{{ t(step) }}</span>
            </li>
          </ol>
          <p class="install__finish" v-reveal>
            <UiIcon name="check" :size="20" />
            {{ t(c.process.finish) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Этапы работы -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeader
          :eyebrow="t('How we work')"
          :title="t('How the work is structured')"
          :lead="t('A simple and intuitive process so that you dont lose your pace on the site.')"
        />
        <ProcessSteps :steps="pipeline.map((s) => ({ title: t(s.title), text: t(s.text) }))" />
      </div>
    </section>

    <CtaBand
      :title="t('Do you need doors to the facility?')"
      :text="t('Leave a request and we will prepare the conditions for the volume, timing and configuration.')"
      :button-text="t('Request conditions')"
      origin="builders"
      image="/media/workshop.jpg"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.stat {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
}

.stat__value {
  font-size: clamp(1.875rem, 1.5rem + 1.3vw, 2.75rem);
}

.about-work {
  display: grid;
  gap: var(--space-7);

  @include up(lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-8);
    align-items: start;
  }
}

.about-work__notes {
  display: grid;
  gap: var(--space-6);
}

.about-work__note {
  display: grid;
  gap: var(--space-3);
}

.about-work__text {
  font-family: var(--font-display);
  font-size: clamp(1.375rem, 1.15rem + 1vw, 2rem);
  line-height: 1.3;
}

.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.facts__item {
  display: grid;
  gap: var(--space-2);
  align-content: start;
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
}

.facts__value {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.3rem + 0.8vw, 2rem);
  line-height: 1.1;
}

.facts__text {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.perks {
  display: grid;
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
  }

  @include up(xl) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.perks__item {
  display: grid;
  gap: var(--space-3);
  align-content: start;
  padding: var(--space-5);
  background: var(--c-ivory);
  border: 1px solid var(--border);
}

.perks__num {
  font-family: var(--font-display);
  font-size: 2rem;
  line-height: 1;
  color: var(--accent);
}

.on-site {
  display: grid;
  gap: var(--space-7);

  @include up(lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(3rem, 2rem + 4vw, 7rem);
    align-items: start;
  }
}

.on-site__head {
  display: grid;
  gap: var(--space-5);
}

.on-site__media {
  margin: var(--space-3) 0 0;
}

.on-site__list .h3 {
  margin-bottom: var(--space-2);
}

.on-site__text {
  color: var(--text-on-dark-muted);
}

.install {
  display: grid;
  gap: var(--space-6);

  @include up(lg) {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-8);
  }
}

.install__head {
  display: grid;
  gap: var(--space-4);
  align-content: start;
}

.install__list {
  display: grid;
  border-top: 1px solid var(--border-strong);

  li {
    display: grid;
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: var(--space-4);
    align-items: baseline;
    padding-block: var(--space-4);
    border-bottom: 1px solid var(--border);
  }
}

.install__num {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1;
  color: var(--accent);
}

.install__finish {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  margin-top: var(--space-5);
  padding: var(--space-4) var(--space-5);
  background: var(--surface);
  border-left: 2px solid var(--c-oak);
  font-weight: 500;

  svg {
    flex: 0 0 auto;
    margin-top: 0.15em;
    color: var(--accent-ink);
  }
}
</style>
