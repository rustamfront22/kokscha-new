// v-reveal — мягкое появление блока при прокрутке.
// Заменяет шесть копий IntersectionObserver на страницах.
// Использование: v-reveal или v-reveal="120" (задержка в мс).

let observer = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  return observer;
}

const supported = typeof window !== "undefined" && "IntersectionObserver" in window;

export const reveal = {
  mounted(el, binding) {
    if (!supported) return;
    if (binding.value) el.style.setProperty("--reveal-delay", `${binding.value}ms`);
    el.classList.add("reveal");
    getObserver().observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
