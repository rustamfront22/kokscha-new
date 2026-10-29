<script setup>
import { useI18n } from "vue-i18n";
import PageHero from "@/components/sections/PageHero.vue";
import ProcessSteps from "@/components/sections/ProcessSteps.vue";
import CtaBand from "@/components/sections/CtaBand.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import { PHONE_DISPLAY, PHONE_TEL } from "@/config/company";

const { t } = useI18n();

const kpis = [
  { value: "4+", label: "years on the market" },
  { value: "10", suffix: "years", label: "door warranty" },
  { value: "GOST / ISO", label: "quality standards", key: true },
  { value: "min / max", label: "custom-made", key: true },
];

const offer = [
  "Stable supplies and clear deadlines",
  "Selection of models for the object",
  "Volume discounts and special conditions",
  "Consultations on assortment and configuration",
  "Support at the approval stage",
  "Presentation materials for clients",
];

const advantages = [
  "Custom size manufacturing",
  "A wide range of models and coatings",
  "PVC veneer, enamel, patina",
  "Comprehensive interior solutions",
  "Reliable design and modern production",
  "Short production time",
];

const audience = ["Object configuration", "Wholesale supplies", "Salons and sections", "Contracting organizations"];

const steps = [
  { title: "Leave a request", text: "Write down what your project is, the scope, and what exactly is required." },
  { title: "Well agree on the terms", text: "We will select the assortment, finishes, terms and convenient format of work." },
  { title: "Launching deliveries", text: "We support the project and provide stable equipment." },
];

// Раньше кнопка вызывала несуществующую функцию openCallback и не работала.
const requestPartnership = () => openLeadModal("partners");
</script>

<template>
  <div class="partners">
    <PageHero
      :eyebrow="t('Partner Program')"
      :title="t('Cooperation')"
      :lead="t('Stable supplies, facility support and favorable terms for construction companies, contractors and fit-out teams.')"
      image="/media/showroom.jpg"
      :image-alt="t('Showroom')"
    >
      <template #actions>
        <button class="btn btn--primary" type="button" @click="requestPartnership">
          {{ t("Submit your application") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </button>
        <a class="btn btn--outline" :href="`tel:${PHONE_TEL}`">
          <UiIcon name="phone" />
          {{ t("To call") }}
        </a>
      </template>
    </PageHero>

    <section class="section section--tight section--white">
      <div class="container">
        <dl class="stat-row">
          <div v-for="k in kpis" :key="k.label" class="stat">
            <dt class="stat__label">{{ t(k.label) }}</dt>
            <dd class="stat__value" :class="{ 'stat__value--small': k.key }">
              {{ k.key ? t(k.value) : k.value }}
              <span v-if="k.suffix" class="stat__suffix">{{ t(k.suffix) }}</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section">
      <div class="container offer">
        <div class="offer__intro" v-reveal>
          <p class="eyebrow">{{ t("Partner Program") }}</p>
          <h2 class="h2">{{ t("Cooperation that is convenient for construction projects") }}</h2>
          <p class="lead">
            {{ t("We supply interior doors for facilities and private orders. We accompany our partners at all stages and help them find solutions. for the budget, project format and deadlines.") }}
          </p>
          <div class="actions">
            <button class="btn btn--primary" type="button" @click="requestPartnership">
              {{ t("Submit your application") }}
            </button>
            <a class="btn btn--link" :href="`tel:${PHONE_TEL}`">{{ PHONE_DISPLAY }}</a>
          </div>
        </div>

        <div class="offer__lists">
          <div class="offer__col" v-reveal>
            <h3 class="h3">{{ t("What we offer") }}</h3>
            <ul class="rule-list">
              <li v-for="(item, i) in offer" :key="item">
                <span class="rule-list__mark">{{ String(i + 1).padStart(2, "0") }}</span>
                <span>{{ t(item) }}</span>
              </li>
            </ul>
          </div>
          <div class="offer__col" v-reveal="100">
            <h3 class="h3">{{ t("Product Advantages") }}</h3>
            <ul class="rule-list">
              <li v-for="(item, i) in advantages" :key="item">
                <span class="rule-list__mark">{{ String(i + 1).padStart(2, "0") }}</span>
                <span>{{ t(item) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--dark">
      <div class="container audience" v-reveal>
        <div class="audience__text">
          <p class="eyebrow">{{ t("Suitable for whom") }}</p>
          <p class="audience__lead">
            {{ t("We work with builders, contractors, salons, and companies that complete facilities with doors. We supply solutions for apartments, houses, commercial premises and development projects.") }}
          </p>
        </div>
        <ul class="audience__chips">
          <li v-for="item in audience" :key="item">{{ t(item) }}</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <SectionHeader
          :eyebrow="t('How we work')"
          :title="t('How to start a collaboration')"
          :lead="t('A fast and clear process — from the application to the launch of deliveries.')"
        />
        <ProcessSteps :steps="steps.map((s) => ({ title: t(s.title), text: t(s.text) }))" :columns="3" />
      </div>
    </section>

    <CtaBand
      :title="t('Want to become our partner too?')"
      :text="t('Leave a request and our team will get in touch to discuss cooperation terms.')"
      origin="partners"
      image="/media/workshop.jpg"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.stat {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
}

.stat__value--small {
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.5rem);
}

.stat__suffix {
  font-size: 0.5em;
  color: var(--text-muted);
}

.offer {
  display: grid;
  gap: var(--space-8);

  @include up(lg) {
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: clamp(3rem, 2rem + 4vw, 7rem);
    align-items: start;
  }
}

.offer__intro {
  display: grid;
  gap: var(--space-5);

  @include up(lg) {
    position: sticky;
    top: calc(var(--header-h) + var(--space-6));
  }
}

.offer__lists {
  display: grid;
  gap: var(--space-7);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-6);
  }
}

.offer__col {
  display: grid;
  gap: var(--space-4);
  align-content: start;
}

.audience {
  display: grid;
  gap: var(--space-6);

  @include up(lg) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: end;
    gap: var(--space-8);
  }
}

.audience__text {
  display: grid;
  gap: var(--space-4);
}

.audience__lead {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.2rem + 1.4vw, 2.375rem);
  line-height: 1.25;
}

.audience__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);

  li {
    padding: 0.5rem 1rem;
    border: 1px solid rgba(243, 238, 230, 0.3);
    border-radius: var(--radius-pill);
    font-size: var(--fs-sm);
  }
}
</style>
