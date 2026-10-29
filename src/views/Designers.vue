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

const heroList = ["Matching the style", "Catalogs and samples", "Decor in a unified style", "Custom sizes"];

const perks = [
  { title: "Catalogs and materials", text: "Catalogs of finishes, textures and samples for convenient client work and project presentation." },
  { title: "Matching the style", text: "We select doors to match the interior: classic, minimalist, modern and complex custom solutions." },
  { title: "Decor in a unified style", text: "Casings, cornices, panels and other elements so the interior looks cohesive and neat." },
  { title: "Custom sizes", text: "We manufacture doors for your project factoring in dimensions, preferences and room features." },
];

const steps = [
  { title: "Request", text: "You send your project, references or a description of the task." },
  { title: "Selection", text: "We offer models, finishes, decor and suitable solutions." },
  { title: "Approval", text: "We clarify details, dimensions, configuration and final materials." },
  { title: "Delivery", text: "We organize delivery and support the project through to completion." },
];

const getMaterials = () => openLeadModal("designers");
</script>

<template>
  <div class="designers">
    <PageHero
      :eyebrow="t('For designers')"
      :title="t(c.designers.heroTitle)"
      :lead="t(c.designers.heroText)"
      image="/media/door-detail.jpg"
      :image-alt="t('Showroom')"
    >
      <template #actions>
        <button class="btn btn--primary" type="button" @click="getMaterials">
          {{ t("Get materials") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </button>
        <a class="btn btn--outline" :href="`tel:${PHONE_TEL}`">
          <UiIcon name="phone" />
          {{ t("To call") }}
        </a>
      </template>
      <ul class="hero-chips">
        <li class="chip chip--static">{{ t("Catalogs") }}</li>
        <li class="chip chip--static">{{ t("Matching the style") }}</li>
        <li class="chip chip--static">{{ t("Decor") }}</li>
      </ul>
    </PageHero>

    <!-- Что вы получите -->
    <section class="section section--dark">
      <div class="container receive">
        <div class="receive__text" v-reveal>
          <p class="eyebrow">{{ t("What will you get") }}</p>
          <p class="receive__lead">{{ t("We work with designers, architects and private projects.") }}</p>
        </div>
        <ul class="rule-list receive__list" v-reveal="100">
          <li v-for="(item, i) in heroList" :key="item">
            <span class="rule-list__mark">{{ String(i + 1).padStart(2, "0") }}</span>
            <span class="receive__item">{{ t(item) }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Почему удобно -->
    <section class="section">
      <div class="container">
        <SectionHeader
          :eyebrow="t('For designers and architects')"
          :title="t('Why is it convenient to work with us')"
          :lead="t('Not just doors, but clear work with the project, materials and the client.')"
        />
        <div class="blocks">
          <article v-for="(b, i) in c.designers.blocks" :key="b.title" class="blocks__item" v-reveal="(i % 2) * 90">
            <span class="blocks__num">{{ String(i + 1).padStart(2, "0") }}</span>
            <h3 class="h3">{{ t(b.title) }}</h3>
            <p class="text-muted">{{ t(b.text) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Что вы получаете -->
    <section class="section section--white">
      <div class="container gets">
        <div class="gets__intro">
          <SectionHeader
            :eyebrow="t('Catalogs and materials')"
            :title="t('What do you get')"
            :lead="t('Everything that helps to coordinate decisions faster and close the project beautifully.')"
          />
          <figure class="media-frame ratio-4x5 gets__media" v-reveal>
            <AppImage src="/media/showroom.jpg" :alt="t('Showroom')" />
          </figure>
        </div>
        <ul class="gets__list">
          <li v-for="(p, i) in perks" :key="p.title" class="gets__item" v-reveal="i * 70">
            <h3 class="h3">{{ t(p.title) }}</h3>
            <p class="text-muted">{{ t(p.text) }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Как мы работаем -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeader
          :eyebrow="t('How we work')"
          :title="t('How we work')"
          :lead="t('A simple process so that you can quickly bring the project to the result.')"
        />
        <ProcessSteps :steps="steps.map((s) => ({ title: t(s.title), text: t(s.text) }))" />
      </div>
    </section>

    <CtaBand
      :title="t('Do you need catalogs and materials?')"
      :text="t('Leave a request and we will send you the materials and help you with the selection for your project.')"
      :button-text="t('Get materials')"
      origin="designers"
      image="/media/door-detail.jpg"
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

.receive {
  display: grid;
  gap: var(--space-6);

  @include up(lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-8);
    align-items: center;
  }
}

.receive__text {
  display: grid;
  gap: var(--space-4);
}

.receive__lead {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 1.3rem + 2vw, 3rem);
  line-height: 1.15;
}

.receive__item {
  font-size: var(--fs-lead);
}

.blocks {
  display: grid;
  border-top: 1px solid var(--border-strong);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.blocks__item {
  display: grid;
  gap: var(--space-3);
  align-content: start;
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--border);

  @include up(md) {
    padding: var(--space-6) var(--space-6) var(--space-6) 0;

    &:nth-child(even) {
      padding-left: var(--space-6);
      border-left: 1px solid var(--border);
    }
  }
}

.blocks__num {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--accent);
}

.gets {
  display: grid;
  gap: var(--space-7);

  @include up(lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(3rem, 2rem + 4vw, 7rem);
    align-items: start;
  }
}

.gets__media {
  margin: 0;

  @include down(lg) {
    display: none;
  }
}

.gets__list {
  display: grid;
  gap: var(--space-3);
}

.gets__item {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-5);
  background: var(--c-ivory);
  border: 1px solid var(--border);
  border-left: 2px solid var(--c-oak);
}
</style>
