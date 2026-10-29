<script setup>
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import { PHONE_DISPLAY, PHONE_TEL } from "@/config/company";

// Финальный призыв страницы: заявка + звонок.
const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, default: "" },
  buttonText: { type: String, default: "" },
  origin: { type: String, default: "cta" },
  image: { type: String, default: "/media/showroom.jpg" },
});

const { t } = useI18n();
</script>

<template>
  <section class="cta-band">
    <div class="cta-band__bg" :style="{ backgroundImage: `url(${props.image})` }" aria-hidden="true" />
    <div class="container cta-band__inner" v-reveal>
      <div class="cta-band__text">
        <h2 class="h2">{{ title }}</h2>
        <p v-if="text" class="cta-band__lead">{{ text }}</p>
      </div>
      <div class="actions cta-band__actions">
        <button class="btn btn--light btn--lg" type="button" @click="openLeadModal(origin)">
          {{ buttonText || t("Submit your application") }}
          <UiIcon name="arrow-right" class="btn__arrow" />
        </button>
        <a class="btn btn--outline-light btn--lg" :href="`tel:${PHONE_TEL}`">
          <UiIcon name="phone" />
          {{ PHONE_DISPLAY }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.cta-band {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: clamp(4.5rem, 3rem + 6vw, 8.5rem);
  background: var(--c-graphite);
  color: var(--c-ivory);
}

.cta-band__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  opacity: 0.32;
  filter: grayscale(0.2);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(36, 35, 32, 0.92) 0%, rgba(36, 35, 32, 0.55) 100%);
  }
}

.cta-band__inner {
  display: grid;
  gap: var(--space-6);

  @include up(lg) {
    grid-template-columns: minmax(0, 1.2fr) auto;
    align-items: end;
  }
}

.cta-band__text {
  display: grid;
  gap: var(--space-4);
  max-width: 720px;
}

.cta-band__lead {
  font-size: var(--fs-lead);
  color: var(--text-on-dark-muted);
}

.cta-band__actions {
  @include down(sm) {
    .btn {
      width: 100%;
    }
  }
}
</style>
