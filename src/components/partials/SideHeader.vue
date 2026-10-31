<template>
  <!-- LEFT SIDEBAR -->
  <aside class="side" :class="{ 'is-hidden': navOpen || formOpen }">
    <div class="side__top">
      <RouterLink to="/" class="side__logo" @click="closeAll">
        <img
          src="@/assets/img/kokscha_icon_transparent.svg"
          alt="logo"
          width="34"
          height="34"
        />
      </RouterLink>

      <!-- Burger -->
      <button
        type="button"
        class="side__burger"
        @click="navOpen ? closeAll() : openNav()"
        aria-label="Menu"
      >
        <span></span><span></span>
      </button>
    </div>

    <div class="side__scroll">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" />
      </svg>
      <div class="side__percent">{{ scroll }}%</div>
    </div>

    <div class="side__label">
      <span>{{ currentLabel }}</span>
    </div>

    <div class="side__bottom">
      <button class="side__icon" type="button" @click="scrollToLead" title="scroll">
        ↓
      </button>
    </div>
  </aside>

  <!-- RIGHT FLOAT BUTTON -->
  <button class="contact-fab" type="button" @click="openForm">Написать нам</button>

  <!-- OVERLAY -->
  <transition name="fade">
    <div v-if="navOpen || formOpen" class="overlay" @click="closeAll"></div>
  </transition>

  <!-- NAV PANEL -->
  <transition name="slide-left">
    <div v-if="navOpen" class="panel panel--nav">
      <div class="panel__head">
        <div class="panel__title">Меню</div>
        <button class="panel__close" type="button" @click="closeAll" aria-label="Close">
          ✕
        </button>
      </div>

      <nav class="panel__nav">
        <RouterLink @click="closeAll" :to="{ name: 'index' }">Главная</RouterLink>
        <RouterLink @click="closeAll" :to="{ name: 'products' }">Каталог</RouterLink>
        <RouterLink @click="closeAll" :to="{ name: 'about' }">О нас</RouterLink>
        <RouterLink @click="closeAll" :to="{ name: 'partners' }">Партнёры</RouterLink>
        <RouterLink @click="closeAll" :to="{ name: 'designers' }">Дизайнерам</RouterLink>
        <RouterLink @click="closeAll" :to="{ name: 'builders' }">Строителям</RouterLink>
      </nav>

      <div class="panel__footer">
        <button class="btn btn-primary w-full" type="button" @click="scrollToLead">
          Оставить заявку
        </button>

        <a class="btn btn-secondary w-full mt-3 text-center" href="tel:+998901301010">
          Позвонить
        </a>
      </div>
    </div>
  </transition>

  <!-- FORM PANEL -->
  <transition name="slide-right">
    <div v-if="formOpen" class="panel panel--form">
      <div class="panel__head">
        <div class="panel__title">Оставить заявку</div>
        <button class="panel__close" type="button" @click="closeAll" aria-label="Close">
          ✕
        </button>
      </div>

      <!-- ✅ ВАЖНО: тут не мини-форма, а готовый LeadForm -->
      <div class="lead-wrap">
        <LeadForm />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";

// ✅ подключаем ТВОЙ рабочий LeadForm
import LeadForm from "@/components/views/home/LeadForm.vue";

const route = useRoute();

const navOpen = ref(false);
const formOpen = ref(false);

const currentLabel = computed(() => {
  const map = {
    index: "ГЛАВНАЯ",
    products: "КАТАЛОГ",
    about: "О НАС",
    partners: "ПАРТНЁРЫ",
    designers: "ДИЗАЙНЕРАМ",
    builders: "СТРОИТЕЛЯМ",
  };
  return map[route.name] || "KO'KCHA";
});

const lockScroll = (lock) => {
  document.documentElement.style.overflow = lock ? "hidden" : "";
};

const openNav = () => {
  navOpen.value = true;
  formOpen.value = false;
  lockScroll(true);
};

const openForm = () => {
  formOpen.value = true;
  navOpen.value = false;
  lockScroll(true);
};

const closeAll = () => {
  navOpen.value = false;
  formOpen.value = false;
  lockScroll(false);
};

const onKey = (e) => {
  if (e.key === "Escape") closeAll();
};

// scroll to big LeadForm (id="lead-form")
const scrollToLead = () => {
  closeAll();
  requestAnimationFrame(() => {
    document.querySelector("#lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
};

// percent scroll
const scroll = ref(0);
const updateScroll = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  scroll.value = Math.round(scrolled || 0);
};

onMounted(() => {
  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("keydown", onKey);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScroll);
  window.removeEventListener("keydown", onKey);
});
</script>

<style scoped lang="scss">
/* Sidebar */
.side {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 84px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-right: 1px solid rgba(255, 255, 255, 0.28);
}

@media (max-width: 1024px) {
  .side { width: 72px; }
}

@media (max-width: 768px) {
  /* 1) сам aside тоже делаем row */
  .side {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;

    width: auto !important;
    height: auto !important;

    top: calc(12px + env(safe-area-inset-top)) !important;
    left: 12px !important;

    padding: 8px 10px !important;
    gap: 8px !important;

    border-radius: 16px !important;
  }

  /* 2) блок с кнопками — строго в ряд */
  .side__top {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;
    gap: 8px !important;
    padding-top: 0 !important;
  }

  /* 3) скрываем всё лишнее */
  .side__scroll,
  .side__label,
  .side__bottom {
    display: none !important;
  }

  /* 4) размеры кнопок */
  .side__logo,
  .side__burger {
    width: 40px !important;
    height: 40px !important;
    border-radius: 12px !important;
  }
}

.side__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-top: 14px;
}

.side__logo {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e7e5e4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.side__burger {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #e7e5e4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.side__burger span {
  display: block;
  height: 2px;
  width: 22px;
  border-radius: 999px;
  background: #111;
}
.side__burger span:last-child { width: 16px; }

.side__scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.side__scroll svg { width: 60px; height: 60px; transform: rotate(-90deg); }
.side__scroll circle {
  fill: none;
  stroke: rgba(17, 17, 17, 0.18);
  stroke-width: 3;
  stroke-dasharray: 290;
  stroke-dashoffset: calc(290 - (290 * v-bind(scroll)) / 100);
  transition: 0.2s;
}
.side__percent { font-size: 12px; color: #111; opacity: 0.55; }

.side__label span {
  color: #111;
  opacity: 0.6;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight: 700;
  letter-spacing: 0.06em;
}

.side__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.is-hidden {
  opacity: 0;
  transform: translateX(-10px);
  pointer-events: none;
}

/* FAB */
.contact-fab {
  position: fixed;
  right: 24px;
  top: 24px;
  z-index: 3000;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 700;
  background: #fff;
  border: 1px solid #e7e5e4;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: 0.2s ease;
}
@media (max-width: 768px) {
  .contact-fab {
    right: 14px;
    bottom: calc(14px + env(safe-area-inset-bottom));
    top: auto;
    z-index: 4500;
  }
}

/* Overlay + Panels */
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.35);
}
.panel {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 380px;
  z-index: 9999;
  padding: 18px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}
.panel--nav { left: 0; border-right: 1px solid #e7e5e4; }
.panel--form { right: 0; border-left: 1px solid #e7e5e4; }
@media (max-width: 768px) {
  .panel { width: min(92vw, 420px); }
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel__title { font-size: 18px; font-weight: 800; color: #111; }
.panel__close {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
  color: #111;
  cursor: pointer;
}

/* ✅ Обёртка для LeadForm — чтобы влезало на всех экранах */
.lead-wrap {
  margin-top: 12px;
  height: calc(100vh - 70px);
  overflow: auto;
  padding-right: 6px;
}

/* Навигация */
.panel__nav {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.panel__nav a {
  padding: 14px;
  border-radius: 14px;
  font-weight: 700;
  color: #111;
  background: #fff;
  border: 1px solid #e7e5e4;
  text-decoration: none;
  transition: 0.2s ease;
}
.panel__nav a.router-link-active {
  background: rgba(200, 161, 101, 0.18);
  border-color: rgba(200, 161, 101, 0.65);
}

/* Footer */
.panel__footer { margin-top: auto; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  padding: 12px 14px;
  font-weight: 800;
  border: 1px solid transparent;
}
.btn-primary {
  background: #c8a165;
  border-color: rgba(200, 161, 101, 0.6);
  color: #111;
}
.btn-secondary {
  background: #fff;
  border-color: #e7e5e4;
  color: #111;
}
.w-full { width: 100%; }
.mt-3 { margin-top: 12px; }

@media (max-width: 768px) {
  .hero__overlay {
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.88) 0%,
      rgba(255,255,255,0.55) 35%,
      rgba(255,255,255,0.10) 70%,
      rgba(0,0,0,0.05) 100%
    );
  }
}


@media (max-width: 380px) {
  .hero__stats {
    grid-template-columns: 1fr;   /* на очень маленьких — в столбик */
  }
}
/* Transitions */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.slide-left-enter-active,
.slide-left-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.slide-left-enter-from,
.slide-left-leave-to { transform: translateX(-100%); opacity: 0; }
.slide-left-enter-to,
.slide-left-leave-from { transform: translateX(0); opacity: 1; }

.slide-right-enter-active,
.slide-right-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.slide-right-enter-from,
.slide-right-leave-to { transform: translateX(100%); opacity: 0; }
.slide-right-enter-to,
.slide-right-leave-from { transform: translateX(0); opacity: 1; }
</style>