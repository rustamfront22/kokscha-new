<script setup>
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import { PHONE_DISPLAY, PHONE_TEL, SHOWROOM_MAP_URL, WORKING_HOURS } from "@/config/company";

// Финальный призыв страницы — в стиле финального блока главной: заявка, звонок, шоурум.
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
  <section class="cta-band theme-dark">
    <div class="cta-band__bg" :style="{ backgroundImage: `url(${props.image})` }" aria-hidden="true" />
    <div class="container cta-band__inner">
      <div class="cta-band__text" v-reveal>
        <p class="eyebrow">{{ t("Showroom") }} · {{ t("Tashkent") }}</p>
        <h2 class="display cta-band__title">{{ title }}</h2>
        <p v-if="text" class="cta-band__lead">{{ text }}</p>
        <div class="actions cta-band__actions">
          <button class="btn btn--primary btn--lg" type="button" @click="openLeadModal(origin)">
            {{ buttonText || t("Submit your application") }}
            <UiIcon name="arrow-right" class="btn__arrow" />
          </button>
          <a class="btn btn--outline btn--lg" :href="`tel:${PHONE_TEL}`">
            <UiIcon name="phone" />
            {{ PHONE_DISPLAY }}
          </a>
        </div>
      </div>

      <dl class="cta-band__contacts" v-reveal="120">
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

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.cta-band {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: clamp(5rem, 3rem + 7vw, 9rem);
}

.cta-band__bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  opacity: 0.16;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(0deg, var(--c-graphite-deep) 0%, rgba(22, 21, 19, 0.55) 60%, var(--c-graphite-deep) 100%);
  }
}

.cta-band__inner {
  display: grid;
  gap: var(--space-8);

  @include up(lg) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.6fr);
    align-items: end;
  }
}

.cta-band__text {
  display: grid;
  gap: var(--space-5);
  justify-items: start;
}

.cta-band__title {
  max-width: 18ch;
}

.cta-band__lead {
  max-width: 54ch;
  font-size: var(--fs-lead);
  color: var(--text-muted);
}

.cta-band__actions {
  @include down(sm) {
    width: 100%;

    .btn {
      width: 100%;
    }
  }
}

.cta-band__contacts {
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
