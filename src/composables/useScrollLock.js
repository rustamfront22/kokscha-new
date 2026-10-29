import { onBeforeUnmount, watch } from "vue";

// Счётчик блокировок: несколько открытых слоёв (меню + модалка) не снимают блокировку друг у друга.
let locks = 0;

function apply() {
  const root = document.documentElement;
  if (locks > 0) {
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
  } else {
    root.style.overflow = "";
    root.style.paddingRight = "";
  }
}

export function useScrollLock(activeRef) {
  let held = false;

  const set = (value) => {
    if (value && !held) {
      held = true;
      locks += 1;
      apply();
    } else if (!value && held) {
      held = false;
      locks = Math.max(0, locks - 1);
      apply();
    }
  };

  watch(activeRef, set, { immediate: true });
  onBeforeUnmount(() => set(false));
}
