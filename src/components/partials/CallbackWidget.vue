<script setup>
import { computed, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import BaseModal from "@/components/ui/BaseModal.vue";
import UiIcon from "@/components/ui/UiIcon.vue";
import { useLeadModal } from "@/composables/useLeadModal";
import { LEADS_URL, PHONE_DISPLAY, PHONE_TEL } from "@/config/company";

// Форма обратного звонка. Формат запроса в CRM не изменён:
// POST LEADS_URL { fullName, phone, source: "callback_widget", page }.

const { t } = useI18n();
const { state, open, close } = useLeadModal();

const countries = [
  { name: "Uzbekistan", flag: "🇺🇿", code: "998", max: 12 },
  { name: "Russia", flag: "🇷🇺", code: "7", max: 11 },
  { name: "Kazakhstan", flag: "🇰🇿", code: "7", max: 11 },
  { name: "Kyrgyzstan", flag: "🇰🇬", code: "996", max: 12 },
  { name: "Tajikistan", flag: "🇹🇯", code: "992", max: 12 },
  { name: "Turkmenistan", flag: "🇹🇲", code: "993", max: 11 },
  { name: "UAE", flag: "🇦🇪", code: "971", max: 12 },
  { name: "Turkey", flag: "🇹🇷", code: "90", max: 12 },
];

const fullName = ref("");
const selectedCountry = ref(countries[0]);
const rawPhone = ref(selectedCountry.value.code);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const errorMessage = ref("");
const secondsLeft = ref(27);

let timer = null;
let closeTimer = null;

const formatPhone = (digits) => {
  const code = selectedCountry.value.code;
  const local = digits.slice(code.length);

  if (code === "998" || code === "7") {
    const groups = code === "998" ? [2, 3, 2, 2] : [3, 3, 2, 2];
    const parts = [];
    let pos = 0;
    for (const size of groups) {
      parts.push(local.slice(pos, pos + size));
      pos += size;
    }
    const [p1, p2, p3, p4] = parts;
    let result = `+${code}`;
    if (p1) result += ` (${p1}`;
    if (p1.length === groups[0]) result += ")";
    if (p2) result += ` ${p2}`;
    if (p3) result += `-${p3}`;
    if (p4) result += `-${p4}`;
    return result;
  }

  return "+" + digits;
};

const displayPhone = computed(() => formatPhone(rawPhone.value));
const phoneValid = computed(() => rawPhone.value.length >= selectedCountry.value.code.length + 5);

const onCountryChange = () => {
  rawPhone.value = selectedCountry.value.code;
};

const normalizeDigits = (value) => {
  let digits = value.replace(/\D/g, "");
  const code = selectedCountry.value.code;
  if (!digits.startsWith(code)) {
    digits = code + digits.replace(new RegExp("^" + code), "");
  }
  return digits.slice(0, selectedCountry.value.max);
};

const onPhoneInput = (e) => {
  rawPhone.value = normalizeDigits(e.target.value);
  e.target.value = displayPhone.value;
  if (errorMessage.value && phoneValid.value) errorMessage.value = "";
};

const resetTimer = () => {
  secondsLeft.value = 27;
  clearInterval(timer);
  timer = setInterval(() => {
    if (secondsLeft.value > 0) secondsLeft.value--;
    else clearInterval(timer);
  }, 1000);
};

const resetForm = () => {
  isSuccess.value = false;
  errorMessage.value = "";
  fullName.value = "";
  rawPhone.value = selectedCountry.value.code;
};

watch(
  () => state.open,
  (isOpen) => {
    if (isOpen) {
      clearTimeout(closeTimer);
      resetForm();
      resetTimer();
    } else {
      clearInterval(timer);
    }
  },
);

const submitLead = async () => {
  errorMessage.value = "";

  if (!phoneValid.value) {
    errorMessage.value = t("Please enter the full phone number");
    return;
  }

  try {
    isSubmitting.value = true;

    const payload = {
      fullName: fullName.value,
      phone: `+${rawPhone.value}`,
      source: "callback_widget",
      page: window.location.pathname,
    };

    const res = await fetch(LEADS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    isSuccess.value = true;
    closeTimer = setTimeout(close, 2500);
  } catch {
    errorMessage.value = t("Failed to send the request");
  } finally {
    isSubmitting.value = false;
  }
};

// Совместимость: App.vue и старый код могли вызывать ref.openModal().
defineExpose({ openModal: () => open("legacy") });

onUnmounted(() => {
  clearInterval(timer);
  clearTimeout(closeTimer);
});
</script>

<template>
  <button class="callback-fab" type="button" :aria-label="t('Request a call back')" @click="open('fab')">
    <UiIcon name="phone" :size="22" />
  </button>

  <BaseModal :open="state.open" labelledby="callback-title" @close="close">
    <div class="callback">
      <div class="callback__head">
        <p class="eyebrow">{{ t("Submit your application") }}</p>
        <h2 id="callback-title" class="h2 callback__title">{{ t("Do you have any other questions?") }}</h2>
        <p class="callback__text">
          {{ t("Would you like to call you back for") }}
          <span class="callback__seconds">{{ secondsLeft }}</span> {{ t(" Seconds?") }}
        </p>
      </div>

      <!-- Сводка выбора из конфигуратора / примерки. В CRM не передаётся (формат запроса прежний) -->
      <div v-if="state.context" class="callback__context">
        <p class="field__label">{{ t("Your selection") }}</p>
        <p class="callback__context-title">{{ state.context.title }}</p>
        <ul v-if="state.context.lines?.length">
          <li v-for="line in state.context.lines" :key="line">{{ line }}</li>
        </ul>
        <p class="callback__context-hint">{{ t("Mention the model number when our manager calls you.") }}</p>
      </div>

      <div v-if="isSuccess" class="callback__success" role="status" aria-live="polite">
        <span class="callback__success-icon"><UiIcon name="check" :size="28" /></span>
        <p class="h3">{{ t("The application has been sent") }}</p>
      </div>

      <form v-else class="callback__form" novalidate @submit.prevent="submitLead">
        <label class="field">
          <span class="field__label">{{ t("Full name") }}</span>
          <input v-model="fullName" data-autofocus class="input" type="text" autocomplete="name" :placeholder="t('Full name')" />
        </label>

        <div class="callback__phone">
          <label class="field">
            <span class="field__label">{{ t("Country") }}</span>
            <select v-model="selectedCountry" class="select" @change="onCountryChange">
              <option v-for="country in countries" :key="country.code + country.name" :value="country">
                {{ country.flag }} +{{ country.code }}
              </option>
            </select>
          </label>

          <label class="field">
            <span class="field__label">{{ t("Phone number") }}</span>
            <input
              class="input"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              :value="displayPhone"
              :aria-invalid="!!errorMessage"
              aria-describedby="callback-error"
              @input="onPhoneInput"
            />
          </label>
        </div>

        <p id="callback-error" class="field__error" role="alert" aria-live="assertive">{{ errorMessage }}</p>

        <button class="btn btn--primary btn--lg btn--block" type="submit" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner" aria-hidden="true" />
          {{ isSubmitting ? t("Sending...") : t("Send") }}
        </button>

        <p class="callback__policy">
          {{ t("By clicking the “Submit” button, you confirm your consent to the processing of personal data.") }}
        </p>
      </form>

      <a class="callback__call" :href="`tel:${PHONE_TEL}`">
        <UiIcon name="phone" :size="16" /> {{ t("To call") }}: {{ PHONE_DISPLAY }}
      </a>
    </div>
  </BaseModal>
</template>

<style scoped lang="scss">
.callback-fab {
  position: fixed;
  right: max(var(--space-4), env(safe-area-inset-right));
  bottom: max(var(--space-4), env(safe-area-inset-bottom));
  z-index: var(--z-fab);
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--c-graphite);
  color: var(--c-ivory);
  box-shadow: var(--shadow);
  transition: transform var(--dur) var(--ease), background-color var(--dur) var(--ease);
}

.callback-fab:hover {
  background: var(--c-walnut);
  transform: translateY(-2px);
}

.callback-fab::after {
  content: "";
  position: absolute;
  inset: -5px;
  border: 1px solid var(--c-oak);
  border-radius: 50%;
  opacity: 0.6;
}

.callback {
  display: grid;
  gap: var(--space-5);
  padding: clamp(1.75rem, 1.2rem + 2vw, 2.75rem);
}

.callback__head {
  display: grid;
  gap: var(--space-3);
  padding-right: var(--space-6);
}

.callback__title {
  font-size: clamp(1.875rem, 1.5rem + 1.4vw, 2.5rem);
}

.callback__text {
  color: var(--text-muted);
}

.callback__seconds {
  display: inline-block;
  min-width: 2ch;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.callback__form {
  display: grid;
  gap: var(--space-4);
}

.callback__context {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-4);
  background: var(--c-linen);
  border-left: 2px solid var(--c-oak);

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1) var(--space-3);
    font-size: var(--fs-sm);
    color: var(--text-muted);
  }
}

.callback__context-title {
  font-weight: 600;
}

.callback__context-hint {
  margin-top: var(--space-1);
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.callback__phone {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: var(--space-3);
}

.field__error:empty {
  display: none;
}

.callback__policy {
  font-size: var(--fs-xs);
  line-height: 1.5;
  color: var(--text-muted);
}

.callback__success {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding: var(--space-6) 0;
  text-align: center;
}

.callback__success-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--c-success);
  color: var(--c-ivory);
}

.callback__call {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
  font-size: var(--fs-sm);
  font-weight: 600;
}

.callback__call:hover {
  color: var(--accent-ink);
}
</style>
