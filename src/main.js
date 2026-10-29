import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./index.css";
import "./assets/styles/_styles.scss";
import router from "./router/index.js";
import axios from "axios";
import VueAxios from "vue-axios";
import i18n, { loadLocales } from "@/i18n";
import locales from "@/i18n/locales.json";
import { reveal } from "@/directives/reveal";
import { openLeadModal } from "@/composables/useLeadModal";

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(VueAxios, axios);
app.use(i18n);
app.directive("reveal", reveal);

// Совместимость с прежним глобальным API: window.openCallback() открывает форму заявки.
window.openCallback = () => openLeadModal("legacy");

loadLocales(locales)
  .then((elems) => {
    for (const elemsKey in elems) {
      i18n.global.setLocaleMessage(elemsKey, elems[elemsKey]);
    }
    app.mount("#app");
  })
  .catch(console.error);
