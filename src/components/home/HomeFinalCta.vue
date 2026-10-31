<template>
  <section class="final theme-dark" aria-labelledby="final-title">
    <div class="final__bg" aria-hidden="true" />
    <div class="container final__inner">
      <div class="final__text" v-reveal>
        <p class="label-mono">{{ t("Showroom") }} · {{ t("Tashkent") }}</p>
        <h2 id="final-title" class="hero-title final__title">
          {{ t("Ready to choose") }} <em>{{ t("your door?") }}</em>
        </h2>
        <p class="lead">{{ t("Leave a request and we will select the doors for your interior and budget.") }}</p>
        <div class="actions">
          <a href="#configurator" class="btn btn--primary btn--lg" @click="toConfigurator">
            {{ t("Find your door") }}
            <UiIcon name="arrow-right" class="btn__arrow" />
          </a>
          <button class="btn btn--outline btn--lg" type="button" @click="openLeadModal('home-final')">
            {{ t("Submit your application") }}
          </button>
        </div>
      </div>

      <dl class="final__contacts" v-reveal="120">
        <div>
          <dt class="label-mono">{{ t("Telephone") }}</dt>
          <dd><a :href="`tel:${PHONE_TEL}`">{{ PHONE_DISPLAY }}</a></dd>
        </div>
        <div>
          <dt class="label-mono">{{ t("Address") }}</dt>
          <dd>
            <a :href="SHOWROOM_MAP_URL" target="_blank" rel="noopener noreferrer">
              {{ t("Tashkent, Shaikhantakhur district, Sebzar-7") }}
            </a>
          </dd>
        </div>
        <div>
          <dt class="label-mono">{{ t("Daily") }}</dt>
          <dd>{{ WORKING_HOURS }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import { PHONE_DISPLAY, PHONE_TEL, SHOWROOM_MAP_URL, WORKING_HOURS } from "@/config/company";

const { t } = useI18n();

const toConfigurator = (e) => {
  const el = document.querySelector("#configurator");
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.final {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: clamp(5rem, 3rem + 8vw, 10rem);
}

.final__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: url("/media/showroom.jpg") center / cover no-repeat;
  opacity: 0.18;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, var(--c-graphite-deep) 0%, rgba(22, 21, 19, 0.6) 60%, var(--c-graphite-deep) 100%);
  }
}

.final__inner {
  display: grid;
  gap: var(--space-8);

  @include up(lg) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
    align-items: end;
  }
}

.final__text {
  display: grid;
  gap: var(--space-5);
  justify-items: start;

  .actions .btn {
    @include down(sm) {
      width: 100%;
    }
  }
}

.final__title {
  font-size: clamp(2.75rem, 1.4rem + 5.4vw, 6.5rem);
}

.final__contacts {
  display: grid;
  gap: var(--space-5);

  div {
    display: grid;
    gap: var(--space-1);
    padding-top: var(--space-4);
    border-top: 1px solid var(--border);
  }

  dd {
    font-family: var(--font-display);
    font-size: 1.375rem;
    font-weight: 400;
    letter-spacing: -0.02em;
  }

  a:hover {
    color: var(--c-oak-light);
  }
}
</style>
