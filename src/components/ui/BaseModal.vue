<script setup>
import { computed, onBeforeUnmount, onMounted, ref, toRef } from "vue";
import { useI18n } from "vue-i18n";
import UiIcon from "./UiIcon.vue";
import { useFocusTrap } from "@/composables/useFocusTrap";
import { useScrollLock } from "@/composables/useScrollLock";

// Доступное модальное окно: role="dialog", aria-modal, Esc, удержание фокуса,
// блокировка прокрутки и возврат фокуса после закрытия.
const props = defineProps({
  open: { type: Boolean, default: false },
  labelledby: { type: String, default: undefined },
  label: { type: String, default: undefined },
  variant: { type: String, default: "dialog" }, // dialog | media
  initialFocus: { type: Object, default: null },
});

const emit = defineEmits(["close"]);
const { t } = useI18n();

const panel = ref(null);
const openRef = toRef(props, "open");
const initialFocusRef = computed(() => props.initialFocus?.value ?? null);

useFocusTrap(panel, openRef, { initialFocus: initialFocusRef });
useScrollLock(openRef);

const onKeydown = (e) => {
  if (props.open && e.key === "Escape") emit("close");
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" :class="`modal--${variant}`" @click.self="emit('close')">
        <div
          ref="panel"
          class="modal__panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="labelledby"
          :aria-label="labelledby ? undefined : label"
          tabindex="-1"
        >
          <button class="modal__close" type="button" :aria-label="t('Close')" @click="emit('close')">
            <UiIcon name="close" :size="22" />
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: grid;
  place-items: center;
  padding: var(--space-4);
  background: rgba(36, 35, 32, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  overflow-y: auto;
}

.modal__panel {
  position: relative;
  width: min(100%, 520px);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  background: var(--c-ivory);
  box-shadow: var(--shadow-lg);
  outline: none;
}

.modal__close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  z-index: 2;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: inherit;
  border-radius: 50%;
  transition: background-color var(--dur) var(--ease);
}

.modal__close:hover {
  background: rgba(66, 56, 47, 0.08);
}

/* Медиа: видео и крупные изображения */
.modal--media {
  background: rgba(20, 19, 17, 0.94);
}

.modal--media .modal__panel {
  width: min(100%, 1100px);
  max-height: none;
  overflow: visible;
  background: transparent;
  box-shadow: none;
  color: var(--text-on-dark);
}

.modal--media .modal__close {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  color: var(--c-ivory);
}

.modal--media .modal__close:hover {
  background: rgba(245, 241, 233, 0.12);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur) var(--ease);
}

.modal-enter-active .modal__panel,
.modal-leave-active .modal__panel {
  transition: transform var(--dur) var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__panel,
.modal-leave-to .modal__panel {
  transform: translateY(16px);
}

@media (max-width: 639px) {
  .modal--dialog {
    place-items: end center;
    padding: 0;
  }

  .modal--dialog .modal__panel {
    width: 100%;
    max-height: 92dvh;
  }
}
</style>
