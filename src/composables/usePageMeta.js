import { ref } from "vue";
import { COMPANY_NAME } from "@/config/company";

// Переопределение мета-данных текущей страницы (например, название модели на /products/:id).
// Сбрасывается при каждой смене маршрута в App.vue.
export const metaOverride = ref(null);

export function setPageMeta(meta) {
  metaOverride.value = meta;
}

const HTML_LANG = { en: "en", ru: "ru", uz: "uz", zh: "zh-CN" };
const OG_LOCALE = { en: "en_US", ru: "ru_RU", uz: "uz_UZ", zh: "zh_CN" };

function setMeta(selector, attr, key, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export function applyDocumentMeta({ title, description, locale }) {
  const fullTitle = title ? `${title} — ${COMPANY_NAME}` : COMPANY_NAME;
  document.title = fullTitle;
  document.documentElement.lang = HTML_LANG[locale] || locale || "en";

  if (description) {
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
  }
  setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
  setMeta('meta[property="og:locale"]', "property", "og:locale", OG_LOCALE[locale] || "en_US");
  setMeta('meta[property="og:url"]', "property", "og:url", window.location.href);
}
