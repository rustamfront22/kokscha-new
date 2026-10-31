<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ChangeLocale from "./ChangeLocale.vue";
import BrandLogo from "@/components/ui/BrandLogo.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { openLeadModal } from "@/composables/useLeadModal";
import { useFocusTrap } from "@/composables/useFocusTrap";
import { useScrollLock } from "@/composables/useScrollLock";
import { PHONE_DISPLAY, PHONE_TEL, INSTAGRAM_URL } from "@/config/company";

const { t } = useI18n();
const route = useRoute();

const links = [
  { name: "about", label: "Company" },
  { name: "products", label: "Catalog", also: ["product"] },
  { name: "partners", label: "Cooperation" },
  { name: "our-partners", label: "Our partners" },
  { name: "builders", label: "For builders" },
  { name: "designers", label: "For designers" },
  { name: "video", label: "Video" },
];

// Активный пункт: учитываем и вложенные страницы (карточка модели → «Каталог»).
const isActive = (link) => route.name === link.name || link.also?.includes(route.name);

const scrolled = ref(false);
const menuOpen = ref(false);
const drawer = ref(null);

const overlay = computed(() => route.meta.overlayHeader && !scrolled.value && !menuOpen.value);
// Главная — тёмный «шоурум»: после прокрутки шапка становится тёмным стеклом, а не светлой
const darkGlass = computed(() => route.meta.overlayHeader && scrolled.value && !menuOpen.value);
const onDark = computed(() => overlay.value || darkGlass.value);

const onScroll = () => {
  scrolled.value = window.scrollY > 24;
};

useFocusTrap(drawer, menuOpen);
useScrollLock(menuOpen);

const closeMenu = () => (menuOpen.value = false);
const onKeydown = (e) => {
  if (e.key === "Escape" && menuOpen.value) closeMenu();
};

const requestCall = () => {
  closeMenu();
  openLeadModal("header");
};

watch(() => route.fullPath, closeMenu);

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <header
    class="header"
    :class="{ 'header--overlay': overlay, 'header--dark': darkGlass, 'header--scrolled': scrolled || menuOpen }"
  >
    <div class="container header__inner">
      <RouterLink :to="{ name: 'index' }" class="header__logo" :aria-label="t('Home')">
        <BrandLogo />
      </RouterLink>

      <nav class="header__nav" :aria-label="t('Navigation')">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="header__link"
          :class="{ 'is-active': isActive(link) }"
          :aria-current="isActive(link) ? 'page' : undefined"
        >
          {{ t(link.label) }}
        </RouterLink>
      </nav>

      <div class="header__tools">
        <ChangeLocale class="header__locale" />
        <button class="btn btn--sm header__cta" :class="onDark ? 'btn--light' : 'btn--primary'" type="button" @click="requestCall">
          {{ t("Submit your application") }}
        </button>
        <button
          class="header__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? t('Close menu') : t('Open menu')"
          @click="menuOpen = !menuOpen"
        >
          <UiIcon :name="menuOpen ? 'close' : 'menu'" :size="24" />
        </button>
      </div>
    </div>

    <!-- Teleport: backdrop-filter шапки иначе становится контейнером для position: fixed -->
    <Teleport to="body">
    <Transition name="drawer">
      <div v-if="menuOpen" id="mobile-menu" ref="drawer" class="drawer" role="dialog" aria-modal="true" :aria-label="t('Menu')">
        <div class="drawer__top">
          <RouterLink :to="{ name: 'index' }" class="header__logo" :aria-label="t('Home')">
            <BrandLogo />
          </RouterLink>
          <button class="header__burger drawer__close" type="button" :aria-label="t('Close menu')" @click="closeMenu">
            <UiIcon name="close" :size="24" />
          </button>
        </div>
        <nav class="drawer__nav" :aria-label="t('Navigation')">
          <RouterLink
            :to="{ name: 'index' }"
            class="drawer__link"
            :class="{ 'is-active': route.name === 'index' }"
          >
            {{ t("Home") }}
          </RouterLink>
          <RouterLink
            v-for="link in links"
            :key="link.name"
            :to="{ name: link.name }"
            class="drawer__link"
            :class="{ 'is-active': isActive(link) }"
            :aria-current="isActive(link) ? 'page' : undefined"
          >
            {{ t(link.label) }}
          </RouterLink>
        </nav>

        <div class="drawer__footer">
          <button class="btn btn--primary btn--block" type="button" @click="requestCall">
            {{ t("Submit your application") }}
          </button>
          <div class="drawer__contacts">
            <a :href="`tel:${PHONE_TEL}`" class="drawer__contact">
              <UiIcon name="phone" :size="18" /> {{ PHONE_DISPLAY }}
            </a>
            <a :href="INSTAGRAM_URL" target="_blank" rel="noopener noreferrer" class="drawer__contact">
              <UiIcon name="instagram" :size="18" /> Instagram
            </a>
          </div>
          <ChangeLocale class="drawer__locale" />
        </div>
      </div>
    </Transition>
    </Teleport>
  </header>
</template>

<style scoped lang="scss">
@use "@/assets/styles/mixins" as *;

.header {
  position: fixed;
  top: 0;
  right: 0;
  bottom: auto;
  left: 0;
  inset: 0 0 auto;
  z-index: var(--z-header);
  color: var(--text);
  background: rgba(245, 241, 233, 0.92);
  backdrop-filter: saturate(1.4) blur(14px);
  -webkit-backdrop-filter: saturate(1.4) blur(14px);
  border-bottom: 1px solid var(--border);
  transition:
    background-color var(--dur) var(--ease),
    color var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}

.header--overlay {
  color: var(--c-ivory);
  background: transparent;
  border-color: rgba(245, 241, 233, 0.16);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.header--dark {
  color: var(--c-ivory);
  background: rgba(22, 21, 19, 0.82);
  border-color: rgba(245, 241, 233, 0.1);
}

.header__inner {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  height: var(--header-h);
}

.header__logo {
  flex: 0 0 auto;
  display: block;
  height: 48px;

  @include down(md) {
    height: 40px;
  }

  @media (max-width: 379px) {
    height: 32px;
  }
}

@media (max-width: 379px) {
  .header__inner {
    gap: var(--space-2);
  }
}

.header__nav {
  display: none;
  align-items: center;
  gap: clamp(1rem, 0.2rem + 1.2vw, 1.75rem);
  margin-left: auto;

  @media (min-width: 1280px) {
    display: flex;
  }
}

.header__link {
  position: relative;
  padding-block: var(--space-2);
  font-size: var(--fs-sm);
  font-weight: 500;
  white-space: nowrap;
  opacity: 0.86;
  transition: opacity var(--dur) var(--ease);

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--dur) var(--ease-out);
  }

  &:hover,
  &.is-active {
    opacity: 1;
  }

  &:hover::after,
  &.is-active::after {
    transform: scaleX(1);
  }
}

.header__tools {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;

  @media (min-width: 1280px) {
    margin-left: 0;
  }
}

.header__cta {
  display: none;

  @include up(sm) {
    display: inline-flex;
  }
}

.header__locale {
  @include down(sm) {
    display: none;
  }
}

.header__burger {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: inherit;

  @media (min-width: 1280px) {
    display: none;
  }
}

/* Мобильное меню */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  z-index: var(--z-drawer);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 var(--gutter) calc(var(--space-6) + env(safe-area-inset-bottom));
  background: var(--c-ivory);
  color: var(--text);
}

.drawer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-h);
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.drawer__close {
  display: grid;
  margin-right: -10px;
}

.drawer__nav {
  display: grid;
}

.drawer__link {
  padding-block: 0.7rem;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-display);
  font-size: clamp(1.625rem, 1.2rem + 2vw, 2.25rem);
  line-height: 1.15;

  &.is-active {
    color: var(--accent-ink);
  }
}

.drawer__footer {
  display: grid;
  gap: var(--space-5);
  margin-top: auto;
  padding-top: var(--space-6);
}

.drawer__contacts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
}

.drawer__contact {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 600;
}

.drawer__locale {
  justify-self: start;
  border-color: var(--border-strong);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease-out);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
