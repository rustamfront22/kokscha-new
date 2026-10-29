<script setup>
import { computed, watch } from "vue";
import locales from "@/i18n/locales.json";
import { useCookies } from "@vueuse/integrations/useCookies";
import { useI18n } from "vue-i18n";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";
import UiIcon from "@/components/ui/UiIcon.vue";

defineOptions({ inheritAttrs: false });

// Названия языков на самих языках (в locales.json — служебные английские имена).
const NATIVE = { en: "English", ru: "Русский", uz: "O‘zbekcha", zh: "中文" };
const SHORT = { en: "EN", ru: "RU", uz: "UZ", zh: "中文" };

const cookies = useCookies(["locale"]);
const { locale, t } = useI18n();

const current = computed(() => locales.find((l) => l.code === locale.value) ?? locales[0]);

const setLocale = (code) => {
  locale.value = code;
};

// Cookie «locale» сохраняем как раньше, но с path=/ — иначе выбор языка
// на вложенной странице (например, /products) не применялся к остальным.
watch(locale, (value) => {
  cookies.set("locale", value, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
});
</script>

<template>
  <Dropdown>
    <DropdownTrigger v-bind="$attrs" :aria-label="`${t('Language')}: ${NATIVE[current.code] || current.name}`">
      <UiIcon name="globe" :size="16" />
      <span>{{ SHORT[current.code] || current.code.toUpperCase() }}</span>
      <UiIcon name="chevron-down" :size="14" />
    </DropdownTrigger>

    <DropdownContent align="end">
      <DropdownItem v-for="item in locales" :key="item.code" @select="setLocale(item.code)">
        <span class="flex-1" :lang="item.code">{{ NATIVE[item.code] || item.name }}</span>
        <UiIcon v-if="item.code === locale" name="check" :size="16" />
      </DropdownItem>
    </DropdownContent>
  </Dropdown>
</template>
