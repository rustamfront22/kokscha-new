<script setup>
import { useI18n } from "vue-i18n";
import CtaBand from "@/components/sections/CtaBand.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { partners, partnerStats, industries } from "@/content/partners";
import { PHONE_TEL } from "@/config/company";

const { t } = useI18n();
</script>

<template>
  <div class="our-partners">
    <section class="op-hero">
      <div class="container op-hero__grid">
        <div class="op-hero__text">
          <p class="eyebrow">{{ t("Our partners") }}</p>
          <h1 class="h1">{{ t("Companies that trust Ko'kcha doors") }}</h1>
        </div>
        <p class="lead op-hero__lead">
          {{ t("From boutique hotels and bridal salons to manufacturing and media brands — these are some of the companies we've worked with across Tashkent.") }}
        </p>
      </div>
      <div class="container">
        <dl class="stat-row op-hero__stats">
          <div v-for="s in partnerStats" :key="s.text" class="stat">
            <dt class="stat__label">{{ t(s.text) }}</dt>
            <dd class="stat__value">{{ s.num }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section section--white">
      <div class="container">
        <SectionHeader :title="t('Our partners')" :eyebrow="t('Partner brands')" />
        <ul class="logo-grid">
          <li v-for="(p, i) in partners" :key="p.name" class="logo-card" v-reveal="(i % 3) * 80">
            <div class="logo-card__logo">
              <img :src="p.logo" :alt="p.name" loading="lazy" decoding="async" width="160" height="160" />
            </div>
            <div class="logo-card__body">
              <h3 class="logo-card__name">{{ p.name }}</h3>
              <p class="logo-card__category">{{ t(p.category) }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container industries" v-reveal>
        <div>
          <p class="eyebrow">{{ t("Industries") }}</p>
          <h2 class="h2">{{ t("Industries we work with") }}</h2>
        </div>
        <ul class="industries__list">
          <li v-for="(item, i) in industries" :key="item">
            <span class="industries__num">{{ String(i + 1).padStart(2, "0") }}</span>
            {{ t(item) }}
          </li>
        </ul>
      </div>
      <div class="container op-links">
        <RouterLink :to="{ name: 'partners' }" class="btn btn--primary">
          {{ t("Partner Program") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </RouterLink>
        <a class="btn btn--outline" :href="`tel:${PHONE_TEL}`">
          <UiIcon name="phone" />
          {{ t("To call") }}
        </a>
      </div>
    </section>

    <CtaBand
      :title="t('Want to become our partner too?')"
      :text="t('Leave a request and our team will get in touch to discuss cooperation terms.')"
      origin="our-partners"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.op-hero {
  padding-block: clamp(2.5rem, 1.5rem + 4vw, 5.5rem) var(--space-6);
}

.op-hero__grid {
  display: grid;
  gap: var(--space-5);

  @include up(lg) {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
    align-items: end;
    gap: var(--space-8);
  }
}

.op-hero__text {
  display: grid;
  gap: var(--space-5);
}

.op-hero__stats {
  margin-top: clamp(2.5rem, 2rem + 3vw, 4.5rem);
}

.stat {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
}

.logo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);

  @include up(md) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }
}

.logo-card {
  display: grid;
  border: 1px solid var(--border);
  background: var(--c-ivory);
  transition: border-color var(--dur) var(--ease);

  &:hover {
    border-color: var(--border-strong);
  }
}

.logo-card__logo {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  padding: var(--space-5);

  img {
    max-height: 120px;
    width: auto;
    object-fit: contain;
    border-radius: var(--radius);
  }
}

.logo-card__body {
  padding: var(--space-4);
  border-top: 1px solid var(--border);
}

.logo-card__name {
  font-family: var(--font-display);
  font-size: 1.375rem;
  line-height: 1.2;
}

.logo-card__category {
  margin-top: var(--space-1);
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

.industries {
  display: grid;
  gap: var(--space-6);

  > div {
    display: grid;
    gap: var(--space-4);
  }

  @include up(lg) {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-8);
  }
}

.industries__list {
  border-top: 1px solid var(--border-strong);

  li {
    display: flex;
    align-items: baseline;
    gap: var(--space-4);
    padding-block: var(--space-4);
    border-bottom: 1px solid var(--border);
    font-family: var(--font-display);
    font-size: clamp(1.375rem, 1.2rem + 0.8vw, 2rem);
    line-height: 1.2;
  }
}

.industries__num {
  font-family: var(--font-sans);
  font-size: var(--fs-xs);
  color: var(--accent-ink);
}

.op-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-7);
}
</style>
