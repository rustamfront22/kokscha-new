import {createI18n} from "vue-i18n";
import {useCookies} from "@vueuse/integrations/useCookies";

const cookies = useCookies(['locale'])
export async function loadLocales(locales) {
    return await locales.reduce(async (accPromise, locale) => {
        const acc = await accPromise;
        const content = await import(`./locales/${locale.file}.json`);
        acc[locale.code] = content.default || content;
        return acc;
    }, Promise.resolve({}));
}

// Язык при первом визите: из настроек браузера, если сайт его поддерживает, иначе русский
// (основная аудитория — Ташкент). Явный выбор пользователя хранится в cookie и важнее.
const SUPPORTED = ['ru', 'uz', 'en', 'zh'];
function detectLocale() {
    const list = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
    for (const lang of list) {
        const code = String(lang || '').toLowerCase().split('-')[0];
        if (SUPPORTED.includes(code)) return code;
    }
    return 'ru';
}

const i18n = createI18n({
    allowComposition: true,
    legacy: false,
    locale: cookies.get('locale') || detectLocale(),
    fallbackLocale: 'en'
});

// generate url: http://localhost:3000/locales/generate/full?sourceLocale=en&targetLocale=zh&targetLocaleName=China

export default i18n