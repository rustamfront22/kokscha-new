<script setup>
// Логотип собран по мотивам src/assets/img/kokscha_logo_transparent.svg:
// та же пиктограмма двери латунного цвета, а надпись наследует currentColor,
// поэтому логотип читается и на светлом, и на тёмном фоне.
defineProps({
  compact: { type: Boolean, default: false },
});
</script>

<template>
  <svg
    v-if="compact"
    class="brand-logo"
    viewBox="0 0 160 200"
    role="img"
    aria-label="Ko'kcha eshiklar"
  >
    <g fill="none" stroke="#a08a4a" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
      <path d="M46 6 L18 16 L18 176 L46 190" />
      <path d="M80 22 L80 176" />
      <path d="M80 22 L142 40 L142 196 L80 176" />
      <path d="M28 38 L28 66" />
      <path d="M28 122 L28 150" />
    </g>
    <circle cx="126" cy="122" r="5.5" fill="#a08a4a" />
  </svg>
  <svg v-else class="brand-logo" viewBox="0 0 330 92" role="img" aria-label="Ko'kcha eshiklar fabrikasi">
    <g
      transform="translate(2,4) scale(0.52)"
      fill="none"
      stroke="#a08a4a"
      stroke-width="8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M42 0 L12 10 L12 138 L42 150" />
      <path d="M70 12 L70 140" />
      <path d="M70 12 L128 28 L128 162 L70 140" />
      <path d="M22 26 L22 48" />
      <path d="M22 96 L22 118" />
      <circle cx="112" cy="96" r="4" fill="#a08a4a" stroke="none" />
    </g>
    <g fill="currentColor">
      <text x="84" y="44" font-size="40" font-weight="600" font-family="'Cormorant Garamond', Georgia, serif">
        Ko‘kcha
      </text>
      <text x="86" y="66" font-size="13.5" font-weight="700" letter-spacing="4.2" font-family="Manrope, Arial, sans-serif">
        ESHIKLAR
      </text>
      <text x="86" y="83" font-size="10" font-weight="600" letter-spacing="3.6" font-family="Manrope, Arial, sans-serif" opacity="0.7">
        FABRIKASI
      </text>
    </g>
  </svg>
</template>

<style scoped>
.brand-logo {
  display: block;
  height: 100%;
  width: auto;
}
</style>
