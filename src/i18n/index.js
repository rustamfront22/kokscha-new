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

const i18n = createI18n({
    allowComposition: true,
    legacy: false,
    locale: cookies.get('locale') || 'en',
    fallbackLocale: 'en'
});

// generate url: http://localhost:3000/locales/generate/full?sourceLocale=en&targetLocale=zh&targetLocaleName=China

export default i18n