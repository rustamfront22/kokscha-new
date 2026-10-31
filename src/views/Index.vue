<script setup>
// Главная — «цифровой шоурум»: повествование, коллекции, конфигуратор,
// примерка в интерьере, детали, вход в каталог. Все данные — из /api/doors (кэш в store).
import HomeHero from "@/components/home/HomeHero.vue";
import HomeStory from "@/components/home/HomeStory.vue";
import HomeCollections from "@/components/home/HomeCollections.vue";
import DoorConfigurator from "@/components/home/DoorConfigurator.vue";
import InteriorPreview from "@/components/home/InteriorPreview.vue";
import HomeMaterials from "@/components/home/HomeMaterials.vue";
import HomeCatalogPreview from "@/components/home/HomeCatalogPreview.vue";
import HomeFinalCta from "@/components/home/HomeFinalCta.vue";
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeStory />
    <HomeCollections />
    <DoorConfigurator />
    <InteriorPreview />
    <HomeMaterials />
    <HomeCatalogPreview />
    <HomeFinalCta />
  </div>
</template>
