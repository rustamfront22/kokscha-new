<script setup>
import { useI18n } from "vue-i18n";
import BrandLogo from "@/components/ui/BrandLogo.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  EMAIL,
  WORKING_HOURS,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
} from "@/config/company";

const { t } = useI18n();
const year = new Date().getFullYear();

const company = [
  { name: "about", label: "Company" },
  { name: "our-partners", label: "Our partners" },
  { name: "video", label: "Video" },
];

const services = [
  { name: "products", label: "Catalog" },
  { name: "partners", label: "Cooperation" },
  { name: "builders", label: "For builders" },
  { name: "designers", label: "For designers" },
];
</script>

<template>
  <footer class="footer" id="site-footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <RouterLink :to="{ name: 'index' }" class="footer__logo" :aria-label="t('Home')">
            <BrandLogo />
          </RouterLink>
          <p class="footer__text">
            {{ t("Modern doors and interior design solutions. Selection, delivery, and turnkey installation.") }}
          </p>
          <button class="btn btn--accent" type="button" @click="openLeadModal('footer')">
            {{ t("Submit your application") }}
          </button>
        </div>

        <nav class="footer__col" :aria-label="t('Company')">
          <h2 class="footer__title">{{ t("Company") }}</h2>
          <ul>
            <li v-for="link in company" :key="link.name">
              <RouterLink :to="{ name: link.name }">{{ t(link.label) }}</RouterLink>
            </li>
          </ul>
        </nav>

        <nav class="footer__col" :aria-label="t('Catalog')">
          <h2 class="footer__title">{{ t("Catalog") }}</h2>
          <ul>
            <li v-for="link in services" :key="link.name">
              <RouterLink :to="{ name: link.name }">{{ t(link.label) }}</RouterLink>
            </li>
          </ul>
        </nav>

        <div class="footer__col">
          <h2 class="footer__title">{{ t("Contacts") }}</h2>
          <ul class="footer__contacts">
            <li>
              <a :href="`tel:${PHONE_TEL}`"><UiIcon name="phone" :size="16" />{{ PHONE_DISPLAY }}</a>
            </li>
            <li>
              <a :href="`mailto:${EMAIL}`"><UiIcon name="mail" :size="16" />{{ EMAIL }}</a>
            </li>
            <li>
              <RouterLink :to="{ name: 'about', hash: '#contacts' }">
                <UiIcon name="pin" :size="16" />{{ t("Tashkent, Shaikhantakhur district, Sebzar-7") }}
              </RouterLink>
            </li>
            <li>
              <span><UiIcon name="clock" :size="16" />{{ t("Daily") }} {{ WORKING_HOURS }}</span>
            </li>
            <li>
              <a :href="INSTAGRAM_URL" target="_blank" rel="noopener noreferrer">
                <UiIcon name="instagram" :size="16" />{{ INSTAGRAM_HANDLE }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© {{ year }} Ko'kcha eshiklar. {{ t("All rights reserved.") }}</span>
        <span>{{ t("Tashkent Uzbekistan") }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.footer {
  padding-top: clamp(3.5rem, 2.5rem + 4vw, 6rem);
  background: var(--surface-dark);
  color: var(--text-on-dark);
}

.footer__top {
  display: grid;
  gap: var(--space-7) var(--space-6);
  padding-bottom: clamp(3rem, 2rem + 3vw, 5rem);

  @include up(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include up(lg) {
    grid-template-columns: 1.5fr 0.8fr 0.8fr 1.3fr;
  }
}

.footer__brand {
  display: grid;
  gap: var(--space-5);
  justify-items: start;
  align-content: start;
}

.footer__logo {
  display: block;
  height: 56px;
  color: var(--c-ivory);
}

.footer__text {
  max-width: 36ch;
  color: var(--text-on-dark-muted);
}

.footer__title {
  margin-bottom: var(--space-4);
  font-size: var(--fs-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--c-sand);
}

.footer__col ul {
  display: grid;
  gap: var(--space-3);
}

.footer__col a,
.footer__col span {
  color: var(--text-on-dark-muted);
  transition: color var(--dur) var(--ease);
}

.footer__col a:hover {
  color: var(--c-ivory);
}

.footer__contacts a,
.footer__contacts span {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--space-3);

  svg {
    flex: 0 0 auto;
    margin-top: 0.25em;
    color: var(--c-oak);
  }
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-3);
  padding-block: var(--space-5);
  padding-right: 76px; /* место под плавающую кнопку звонка */
  border-top: 1px solid rgba(243, 238, 230, 0.12);
  font-size: var(--fs-sm);
  color: rgba(243, 238, 230, 0.5);
}
</style>
