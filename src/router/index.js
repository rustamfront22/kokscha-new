import { createRouter, createWebHistory } from "vue-router";

import Index from "../views/Index.vue";

// Главная грузится сразу, остальные страницы — отдельными чанками.
// meta.title / meta.description — ключи переводов (см. App.vue → applyDocumentMeta).
// overlayHeader — у страницы тёмный первый экран под прозрачной шапкой (сейчас у всех страниц).
const routes = [
  {
    path: "/",
    component: Index,
    name: "index",
    meta: {
      overlayHeader: true,
      title: "Premium doors",
      description: "Modern interior and entrance doors.  Model selection, consultation, turnkey delivery and installation.",
    },
  },
  {
    path: "/products",
    component: () => import("../views/Products.vue"),
    name: "products",
    meta: { overlayHeader: true, title: "Catalog", description: "Choose the perfect door for your project." },
  },
  {
    path: "/products/:id",
    component: () => import("../views/Product.vue"),
    name: "product",
    meta: { overlayHeader: true, title: "Catalog", description: "Choose the perfect door for your project." },
  },
  {
    path: "/about",
    component: () => import("../views/About.vue"),
    name: "about",
    meta: { overlayHeader: true,
      title: "About the company",
      description:
        "We produce and install entrance and interior doors in Tashkent. Individual sizes, finishes, fittings and installation are turnkey.",
    },
  },
  {
    path: "/partners",
    component: () => import("../views/Partners.vue"),
    name: "partners",
    meta: { overlayHeader: true,
      title: "Cooperation",
      description:
        "Stable supplies, facility support and favorable terms for construction companies, contractors and fit-out teams.",
    },
  },
  {
    path: "/designers",
    component: () => import("../views/Designers.vue"),
    name: "designers",
    meta: { overlayHeader: true, title: "For designers", description: "For designers and architects description" },
  },
  {
    path: "/builders",
    component: () => import("../views/Builders.vue"),
    name: "builders",
    meta: { overlayHeader: true, title: "For builders", description: "Ready-made door blocks for builders description" },
  },
  {
    path: "/video",
    component: () => import("../views/Video.vue"),
    name: "video",
    meta: { overlayHeader: true,
      title: "Video",
      description:
        "Watch how Ko'kcha doors look in real interiors — hotels, salons, offices and homes of our clients.",
    },
  },
  {
    path: "/our-partners",
    component: () => import("../views/OurPartners.vue"),
    name: "our-partners",
    meta: { overlayHeader: true,
      title: "Our partners",
      description:
        "From boutique hotels and bridal salons to manufacturing and media brands — these are some of the companies we've worked with across Tashkent.",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFound.vue"),
    name: "not-found",
    meta: { overlayHeader: true, title: "Page not found", description: "The page you are looking for does not exist or has been moved." },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    // Фильтры каталога меняют только query — позицию прокрутки не сбрасываем.
    if (to.name === from.name && to.path === from.path) return false;
    if (to.hash) return { el: to.hash, top: 88, behavior: "smooth" };
    return { top: 0 };
  },
});

export default router;
