<template>
  <div class="map-card">
    <div ref="mapEl" class="map" :aria-label="t('Showroom')" role="region"></div>

    <div class="map-card__info">
      <p class="eyebrow">{{ t("Showroom") }}</p>
      <p class="map-card__address">{{ t("Tashkent, Shaikhantakhur district, Sebzar-7") }}</p>
      <a class="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer" :href="SHOWROOM_MAP_URL">
        {{ t("Open") }} Google Maps
        <UiIcon name="arrow-up-right" :size="16" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useI18n } from "vue-i18n";
import UiIcon from "@/components/ui/UiIcon.vue";
import { SHOWROOM_COORDS, SHOWROOM_MAP_URL } from "@/config/company";

const { t } = useI18n();
const mapEl = ref(null);
let map = null;

onMounted(() => {
  map = L.map(mapEl.value, {
    zoomControl: false,
    scrollWheelZoom: false, // не перехватываем прокрутку страницы
  }).setView(SHOWROOM_COORDS, 15);

  // Прежние тайлы CARTO теперь требуют API-ключ и показывали заглушку «API KEY REQUIRED».
  // Стандартные тайлы OSM работают без ключа (обязательна атрибуция).
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  const icon = L.icon({
    iconUrl: new URL("@/assets/img/kokscha_icon_transparent.svg", import.meta.url).href,
    iconSize: [52, 52],
    iconAnchor: [26, 50],
    popupAnchor: [0, -46],
  });

  L.marker(SHOWROOM_COORDS, { icon, alt: t("Showroom") })
    .addTo(map)
    .bindPopup(`Ko'kcha eshiklar — ${t("Showroom")}`);
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<style scoped>
.map-card {
  position: relative;
  border: 1px solid var(--border);
  background: var(--surface);
}

.map {
  position: relative;
  z-index: 0; /* изолируем слои Leaflet, чтобы карта не перекрывала шапку */
  height: clamp(320px, 40vw, 480px);
}

/* Тёплая приглушённая подложка под палитру сайта; маркер и подписи не трогаем */
.map :deep(.leaflet-tile-pane) {
  filter: grayscale(0.85) sepia(0.25) brightness(1.03) contrast(0.92);
}

.map-card__info {
  display: grid;
  gap: var(--space-3);
  justify-items: start;
  padding: var(--space-5);
  border-top: 1px solid var(--border);
}

.map-card__address {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  line-height: 1.2;
}

@media (min-width: 768px) {
  .map-card__info {
    position: absolute;
    left: var(--space-5);
    bottom: var(--space-5);
    z-index: 1;
    max-width: 360px;
    border: 1px solid var(--border);
    background: var(--c-ivory);
    box-shadow: var(--shadow);
  }
}
</style>
