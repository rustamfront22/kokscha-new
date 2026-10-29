# Редизайн Ko'kcha eshiklar — заметки для разработчиков

Концепция: Premium Architecture / Warm Minimalism. Стек не менялся: Vue 3, Vite, Vue Router, Pinia, vue-i18n, Tailwind, SCSS.

## Дизайн-система

| Что | Где |
|---|---|
| Токены (цвета, шрифты, отступы, контейнеры, z-index, движение) | `src/assets/styles/tokens.scss` (CSS-переменные на `:root`) |
| Брейкпоинты и миксины `up()` / `down()` | `src/assets/styles/_mixins.scss` — подключать `@use "@/assets/styles/mixins" as *;` |
| База: фокус, выделение, skip-link, `.sr-only` | `src/assets/styles/base.scss` |
| Контейнер, секции, типографика (`.display`, `.h1`…`.h4`, `.eyebrow`, `.lead`), `.rule-list` | `src/assets/styles/layout.scss` |
| Кнопки, чипы, поля, карточки, показатели, крошки, скелетоны, `v-reveal`, dropdown | `src/assets/styles/components.scss` |
| Tailwind | `tailwind.config.js` — цвета и шрифты ссылаются на те же CSS-переменные; плагин `container` отключён |

Палитра: ivory `#F5F1E9`, linen `#EDE6DA`, sand `#E5D8C5`, oak `#B18A62`, walnut `#42382F`, graphite `#242320`, латунь логотипа `#8A7B3A`.
Для мелкого акцентного текста используется `--c-oak-ink` (#7A5C3B, контраст 5.4:1).
Шрифты: Cormorant Garamond (заголовки) + Manrope (текст), подключены в `index.html`.

Брейкпоинты совпадают с Tailwind: 640 / 768 / 1024 / 1280 / 1536. Десктопное меню — от 1280px.

## Общие компоненты

- `components/ui/` — `UiIcon` (встроенные SVG вместо Iconify), `BrandLogo`, `AppImage` (lazy + заглушка без повторных запросов), `SectionHeader`, `StateMessage` (loading/error/empty), `BaseModal` (dialog/media, Esc, focus trap, scroll lock), `Breadcrumbs`, dropdown-кит.
- `components/sections/` — `PageHero`, `CtaBand`, `ProcessSteps`.
- `components/views/product/Card.vue` — карточка двери: ссылка растянута на карточку, кнопка заявки рядом (без вложенных интерактивных элементов).
- `components/views/home/NewProducts.vue` — горизонтальная лента моделей (scroll-snap), используется для «Новинок» и «Похожих моделей».
- `components/views/home/AllProducts.vue` — сетка дверей с «Показать ещё».
- `composables/` — `useLeadModal`, `useScrollLock`, `useFocusTrap`, `usePageMeta`.
- `directives/reveal.js` — `v-reveal` (появление при прокрутке, учитывает prefers-reduced-motion).
- `config/company.js` — телефон, email, Instagram, координаты шоурума, адрес CRM.
- `content/media.js`, `content/partners.js` — видео, Instagram-публикации, партнёры.

## Интеграции (контракты не менялись)

- Каталог: `GET /api/doors` (proxy в `vite.config.js`, rewrite в `vercel.json`). Store `store/product.js` загружает список один раз за сессию и кэширует; прежние методы `getProducts / getProductsByCategory / getProduct / getCategories` сохранены. URL изображения: `CRM_ORIGIN + item.image`, как раньше.
- Заявки: `CallbackWidget.vue` → `POST /api/leads` с телом `{ fullName, phone, source: "callback_widget", page }`. Тело и эндпоинт CRM прежние; запрос идёт через тот же прокси, что и каталог. Прямой запрос на `crm-kukcha.vercel.app` из браузера блокируется CORS (CRM отдаёт `Access-Control-Allow-Origin` только для собственного домена).
- Открытие формы: `openLeadModal()` из `composables/useLeadModal`. `window.openCallback()` сохранён как совместимый алиас (`main.js`).
- Фильтры каталога в URL: `?cat=` (как раньше) и необязательный `?style=`.
- i18n: cookie `locale` сохранена (теперь с `path=/`), 4 языка, ключи не переименовывались. Новые ключи добавлены во все 4 файла.

## Медиа

- `public/media/hero-720.mp4` — сжатая копия `public/video/hero.mp4` (≈3,8 МБ вместо 68,6 МБ, 720p, без звука и финальной заставки). Оригинал не удалён.
- `public/media/*.jpg` — кадры из того же видео (постер hero, шоурум, производство, отделка).
- Видео в hero подключается после загрузки страницы и не грузится при `prefers-reduced-motion`, Save-Data и 2G.

## Что не удалялось (кандидаты на очистку после проверки)

Не используются текущей сборкой: `components/partials/SideHeader.vue`, `components/views/home/LeadForm.vue` (подробная форма — интеграция отдельно после изучения контракта CRM), `components/views/home/CarouselFooter.vue`, `components/views/home/Partners.vue` (заглушечные логотипы), `components/sections/{HeroSimple,BenefitGrid,StatsRow,Steps,InfoSection}.vue`, `components/ui/dropdown/example.vue`, `utils/stars-reting.js`, `store/cart.js`, `src/main.ts`, `src/assets/img/slider/*` (баннеры старого шаблона), SVG-логотипы-заглушки и платёжные иконки в `src/assets/img/`, `public/video/video-page/5.MOV`.
Зависимости `vue3-carousel` и `@iconify/vue` остались в `package.json`, но в работающем коде больше не используются.

Удалены только устаревшие глобальные SCSS (`assets/styles/{partials,views,ui,plugins}`), которые конфликтовали с новыми стилями.
