import { reactive, readonly } from "vue";

// Единое состояние модального окна заявки (CallbackWidget).
// Заменяет прямые вызовы window.openCallback; сам window.openCallback
// сохранён как совместимый алиас (см. main.js).
const state = reactive({
  open: false,
  // Место, откуда открыли форму, — только для фокуса и текста; в CRM не уходит.
  origin: null,
});

export function openLeadModal(origin = null) {
  state.origin = origin;
  state.open = true;
}

export function closeLeadModal() {
  state.open = false;
}

export function useLeadModal() {
  return {
    state: readonly(state),
    open: openLeadModal,
    close: closeLeadModal,
  };
}
