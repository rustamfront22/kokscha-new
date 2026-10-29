/** @type {import('tailwindcss').Config} */
// Цвета и шрифты берутся из CSS-переменных (src/assets/styles/tokens.scss),
// чтобы Tailwind-утилиты и SCSS-компоненты использовали одну палитру.
export default {
  content: [
    "./index.html",
    "./src/App.vue",
    "./src/{assets,components,composables,config,content,directives,views}/**/*.{js,vue,scss}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        ivory: "var(--c-ivory)",
        linen: "var(--c-linen)",
        sand: "var(--c-sand)",
        oak: "var(--c-oak)",
        "oak-ink": "var(--c-oak-ink)",
        walnut: "var(--c-walnut)",
        graphite: "var(--c-graphite)",
        muted: "var(--c-muted)",
        line: "var(--c-line)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        display: "var(--font-display)",
      },
      maxWidth: {
        container: "var(--container)",
        narrow: "var(--container-narrow)",
      },
    },
  },
  // .container определён в src/assets/styles/layout.scss
  corePlugins: {
    container: false,
  },
  plugins: [],
};
