<!-- LeadForm.vue (same working logic + embedded mode for modal/panel) -->
<template>
  <section class="lead-wrap" :class="{ 'is-embedded': embedded }">
    <!-- background only for normal page section -->
    <div v-if="!embedded" class="lead-bg">
      <div class="glow glow-a"></div>
      <div class="glow glow-b"></div>
      <div class="grid"></div>
      <div class="noise"></div>
    </div>

    <form @submit.prevent="onSubmit" class="lead-form">
      <div class="head">
        <div class="badge">Заявка</div>
        <h2 class="title">Оставить заявку</h2>
        <p class="subtitle">
          Заполните форму — мы свяжемся с вами и поможем подобрать дверь и комплектацию.
        </p>
      </div>

      <div class="form-group">
        <label for="fullName">ФИО <span class="required">*</span></label>
        <input
          id="fullName"
          v-model.trim="form.fullName"
          type="text"
          placeholder="Введите ФИО"
          required
        />
      </div>

      <div class="form-group">
        <label for="doorType">Выбранная дверь <span class="required">*</span></label>
        <select id="doorType" v-model="form.doorType" required>
          <option value="">Выберите тип двери</option>
          <option value="Standard Door">Стандартная дверь</option>
          <option value="Premium Door">Премиум дверь</option>
          <option value="Custom Door">Индивидуальная дверь</option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="length">Длина (см) <span class="required">*</span></label>
          <input
            id="length"
            v-model.number="form.length"
            type="number"
            min="1"
            step="1"
            placeholder="см"
            required
          />
        </div>

        <div class="form-group">
          <label for="width">Ширина (см) <span class="required">*</span></label>
          <input
            id="width"
            v-model.number="form.width"
            type="number"
            min="1"
            step="1"
            placeholder="см"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="dobor">Добор</label>
        <input
          id="dobor"
          v-model.trim="form.dobor"
          type="text"
          placeholder="Напр: 10 см / Нет"
        />
        <div class="hint">Если не нужен — напишите “Нет”.</div>
      </div>

      <div class="form-group">
        <label>Что для вас важнее всего? <span class="required">*</span></label>
        <p class="priority-hint">Выберите ровно 2 варианта</p>

        <div class="priority-buttons" role="group">
          <button
            v-for="opt in PRIORITY_OPTIONS"
            :key="opt"
            type="button"
            class="priority-btn"
            :class="{
              selected: form.priorities.includes(opt),
              disabled: form.priorities.length >= 2 && !form.priorities.includes(opt),
            }"
            @click="togglePriority(opt)"
          >
            <span class="dot" />
            {{ opt }}
          </button>
        </div>

        <p v-if="priorityError" class="error-message">{{ priorityError }}</p>
      </div>

      <div class="form-group">
        <label for="phoneNumber">Телефон <span class="required">*</span></label>
        <input
          id="phoneNumber"
          v-model.trim="form.phoneNumber"
          type="tel"
          placeholder="+998 __ ___ __ __"
          required
        />
      </div>

      <p v-if="submitError" class="error-message">{{ submitError }}</p>
      <p v-if="submitSuccess" class="success-message">
        Ваши данные успешно отправлены. Мы свяжемся с вами в течение 24 часов.
      </p>

      <button type="submit" class="btn-submit" :disabled="loading">
        <span v-if="!loading">Отправить</span>
        <span v-else>Отправка...</span>
      </button>

      <p class="legal">
        Нажимая «Отправить», вы соглашаетесь на обработку данных.
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";

defineProps({
  embedded: { type: Boolean, default: false }, // ✅ для панели “Написать нам”
});

// Priority options — must match backend allowed list exactly
const PRIORITY_OPTIONS = [
  "Качество и надежность",
  "Цена",
  "Дизайн и стиль",
  "Гарантии и сервис",
  "Надежность и безопасность",
];

// API base URL: set in .env as VITE_API_URL.
const API_BASE =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_API_URL != null &&
  String(import.meta.env.VITE_API_URL).trim() !== ""
    ? String(import.meta.env.VITE_API_URL).trim().replace(/\/$/, "")
    : "https://crm-kukcha.vercel.app";

const form = reactive({
  fullName: "",
  phoneNumber: "",
  doorType: "",
  length: null,
  width: null,
  dobor: "",
  priorities: [],
  language: "ru",
});

const loading = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);
const priorityError = ref("");

function togglePriority(opt) {
  const idx = form.priorities.indexOf(opt);
  if (idx >= 0) form.priorities.splice(idx, 1);
  else if (form.priorities.length < 2) form.priorities.push(opt);
  priorityError.value = "";
}

function validate() {
  priorityError.value = "";
  submitError.value = "";

  if (!form.fullName?.trim()) return (submitError.value = "Заполните ФИО."), false;
  if (!form.doorType) return (submitError.value = "Выберите тип двери."), false;

  const lengthNum = Number(form.length);
  const widthNum = Number(form.width);
  if (!Number.isFinite(lengthNum) || lengthNum <= 0)
    return (submitError.value = "Введите корректную длину (число больше 0)."), false;
  if (!Number.isFinite(widthNum) || widthNum <= 0)
    return (submitError.value = "Введите корректную ширину (число больше 0)."), false;

  if (form.priorities.length !== 2)
    return (priorityError.value = "Выберите ровно 2 приоритета."), false;

  if (!form.phoneNumber?.trim()) return (submitError.value = "Введите телефон."), false;

  return true;
}

async function onSubmit() {
  submitSuccess.value = false;
  if (!validate()) return;

  loading.value = true;
  submitError.value = "";

  const measurements = `${form.length} x ${form.width}`;

  const body = {
    fullName: form.fullName.trim(),
    doorType: form.doorType,
    measurements,
    length: Number(form.length),
    width: Number(form.width),
    dobor: form.dobor.trim() || "",
    phoneNumber: form.phoneNumber.trim(),
    priorities: [...form.priorities],
    language: form.language,
  };

  const url = `${API_BASE}/api/leads`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      submitSuccess.value = true;
      form.fullName = "";
      form.phoneNumber = "";
      form.doorType = "";
      form.length = null;
      form.width = null;
      form.dobor = "";
      form.priorities = [];
    } else if (res.status === 400) {
      submitError.value = data.error || "Проверьте данные и попробуйте снова.";
    } else {
      submitError.value = data.error || "Ошибка сервера. Попробуйте позже.";
    }
  } catch (err) {
    submitError.value = "Ошибка сети. Проверьте подключение и попробуйте снова.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped lang="scss">
/* важное: чтобы не было горизонтального “плавания” */
.lead-wrap,
.lead-form {
  box-sizing: border-box;
}
.lead-wrap :deep(*) {
  box-sizing: border-box;
}

/* ============ Wrapper ============ */
.lead-wrap {
  position: relative;
  padding: clamp(24px, 4vw, 60px) 0;
  overflow-x: clip;
}

/* ✅ режим внутри панели */
.lead-wrap.is-embedded {
  padding: 0;
}

/* ============ Background (only normal) ============ */
.lead-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(900px 520px at 12% 12%, rgba(200,161,101,.20), transparent 60%),
    radial-gradient(760px 480px at 88% 18%, rgba(200,161,101,.14), transparent 62%),
    radial-gradient(900px 600px at 50% 92%, rgba(255,255,255,.10), transparent 60%),
    #0b0b0c;
  overflow: hidden;
}

.glow { position: absolute; width: 520px; height: 520px; filter: blur(30px); opacity: 0.35; pointer-events: none; }
.glow-a { left: -160px; top: 120px; background: radial-gradient(circle, rgba(200,161,101,.72), transparent 65%); }
.glow-b { right: -160px; top: 220px; background: radial-gradient(circle, rgba(200,161,101,.52), transparent 65%); }
.grid { position: absolute; inset: 0; opacity: 0.18;
  background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 48px 48px; mask-image: radial-gradient(circle at 50% 35%, black 45%, transparent 75%);
}
.noise { position: absolute; inset: 0; opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
}

/* ============ Form card ============ */
.lead-form {
  /* ✅ больше никаких calc(100% - …) → только 100% + max-width */
  width: 100%;
  max-width: 760px;
  margin: 0 auto;

  border-radius: 24px;
  padding: clamp(16px, 3vw, 28px);

  background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.06));
  border: 1px solid rgba(255,255,255,.12);
  backdrop-filter: blur(16px);
  box-shadow: 0 22px 90px rgba(0,0,0,.35);
  color: rgba(255,255,255,.92);
}

/* ✅ внутри панели — форма должна быть по ширине панели */
.lead-wrap.is-embedded .lead-form {
  max-width: none;
  margin: 0;
  border-radius: 18px;
}

/* ============ Header ============ */
.head { margin-bottom: 14px; }
.badge {
  display: inline-flex; padding: 7px 12px; border-radius: 999px;
  font-weight: 900; font-size: 12px;
  color: rgba(255,255,255,.84);
  background: rgba(200,161,101,.16);
  border: 1px solid rgba(200,161,101,.22);
}
.title { margin-top: 10px; font-size: clamp(18px, 3vw, 30px); font-weight: 1000; line-height: 1.12; }
.subtitle { margin-top: 8px; color: rgba(255,255,255,.68); line-height: 1.7; font-size: 14px; }

/* ============ Fields ============ */
.form-group { display: grid; gap: 8px; margin-bottom: 14px; }
label { font-size: 12.5px; font-weight: 800; color: rgba(255,255,255,.72); }
.required { color: rgba(200,161,101,.95); }

input, select {
  width: 100%;
  border-radius: 16px;
  padding: 12px 14px;
  outline: none;
  color: rgba(255,255,255,.92);
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;
}
input::placeholder { color: rgba(255,255,255,.40); }

input:focus, select:focus {
  border-color: rgba(200,161,101,.55);
  box-shadow: 0 0 0 5px rgba(200,161,101,.16);
  background: rgba(255,255,255,.08);
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }

.hint { font-size: 12px; color: rgba(255,255,255,.55); margin-top: -2px; }

/* ============ Priority ============ */
.priority-hint { font-size: 12px; color: rgba(255,255,255,.55); margin-top: -4px; }
.priority-buttons { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }

.priority-btn {
  display: inline-flex; align-items: center; gap: 8px;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.86);
  font-weight: 900;
  font-size: 12.5px;
  cursor: pointer;
  transition: transform .18s ease, background .18s ease, border-color .18s ease;
}
.priority-btn:hover { transform: translateY(-1px); background: rgba(255,255,255,.10); }
.priority-btn .dot {
  width: 10px; height: 10px; border-radius: 999px;
  background: rgba(255,255,255,.25);
  border: 1px solid rgba(255,255,255,.18);
}
.priority-btn.selected { background: rgba(200,161,101,.18); border-color: rgba(200,161,101,.30); }
.priority-btn.selected .dot { background: rgba(200,161,101,.92); border-color: rgba(200,161,101,.55); }
.priority-btn.disabled { opacity: .45; cursor: not-allowed; transform: none !important; }

/* ============ Messages ============ */
.error-message {
  margin-top: 6px; padding: 10px 12px; border-radius: 14px;
  background: rgba(185, 28, 28, .10);
  border: 1px solid rgba(185, 28, 28, .22);
  font-size: 13px;
}
.success-message {
  margin-top: 6px; padding: 10px 12px; border-radius: 14px;
  background: rgba(21, 128, 61, .12);
  border: 1px solid rgba(21, 128, 61, .22);
  font-size: 13px;
}

/* ============ Submit ============ */
.btn-submit {
  width: 100%;
  height: 48px;
  border-radius: 16px;
  font-weight: 1000;
  border: 1px solid rgba(200,161,101,.55);
  background: rgba(200,161,101,.92);
  color: #111;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  box-shadow: 0 18px 60px rgba(200,161,101,.18);
}
.btn-submit:hover { transform: translateY(-1px); box-shadow: 0 26px 90px rgba(200,161,101,.24); }
.btn-submit:disabled { opacity: .65; cursor: not-allowed; transform: none; }

.legal { margin-top: 10px; font-size: 12px; color: rgba(255,255,255,.55); line-height: 1.5; }
</style>