import { reactive, readonly } from "vue";

// Единое состояние модального окна заявки (CallbackWidget).
// Заменяет прямые вызовы window.openCallback; сам window.openCallback
// сохранён как совместимый алиас (см. main.js).
const state = reactive({
  open: false,
  // Место, откуда открыли форму, — только для интерфейса; в CRM не уходит.
  origin: null,
  // Необязательная сводка выбора (например, из конфигуратора): { title, lines: [] }.
  // Показывается пользователю в форме. Формат запроса в CRM не меняется —
  // для передачи сводки нужен согласованный с CRM параметр.
  context: null,
});

export function openLeadModal(origin = null, context = null) {
  state.origin = origin;
  state.context = context;
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
