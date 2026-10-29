import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'
import router from "@/router";
import i18n, {loadLocales} from "@/i18n";
import locales from "@/i18n/locales.json";
import {pinia} from "@/store";
const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(router)
loadLocales(locales).then((elems => {
    for (const elemsKey in elems) {
        i18n.global.setLocaleMessage(elemsKey, elems[elemsKey])
    }
    app.mount('#app')
})).catch(console.error)
