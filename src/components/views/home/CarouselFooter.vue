<template>
  
    <carousel :items-to-show="1" :autoplay="3500" :wrap-around="true">
      <slide v-for="slide in 4" :key="slide">
        <img src="@/assets/img/slider/slide-2.jpg" alt="">
      </slide>
      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
  </template>
  <script setup>
  import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
  
  </script>