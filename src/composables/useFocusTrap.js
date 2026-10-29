import { nextTick, onBeforeUnmount, watch } from "vue";

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Удерживает фокус внутри контейнера, пока activeRef === true,
// и возвращает его на исходный элемент после закрытия.
export function useFocusTrap(containerRef, activeRef, { initialFocus } = {}) {
  let previous = null;

  const focusables = () =>
    Array.from(containerRef.value?.querySelectorAll(FOCUSABLE) || []).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );

  const onKeydown = (e) => {
    if (e.key !== "Tab" || !containerRef.value) return;
    const items = focusables();
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const activate = async () => {
    previous = document.activeElement;
    document.addEventListener("keydown", onKeydown);
    await nextTick();
    const target =
      containerRef.value?.querySelector("[data-autofocus]") ||
      initialFocus?.value ||
      focusables()[0] ||
      containerRef.value;
    target?.focus({ preventScroll: true });
  };

  const deactivate = () => {
    document.removeEventListener("keydown", onKeydown);
    if (previous && typeof previous.focus === "function" && document.contains(previous)) {
      previous.focus({ preventScroll: true });
    }
    previous = null;
  };

  watch(activeRef, (value) => (value ? activate() : deactivate()));
  onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
}
