<template>
  <div class="products__new">
    <div class="container">
      <div class="title flex justify-between mb-8">
        Наши партнеры
        <div class="products__carousel">
          <div class="products__carousel-navigation flex justify-center gap-3">
            <button class="btn btn-secondary" @click.prevent="leftHandle"><Icon icon="fluent:arrow-up-16-filled" :rotate="3" /></button>
            <button class="btn btn-secondary" @click.prevent="rightHandle"><Icon icon="fluent:arrow-up-16-filled" :rotate="1" /></button>
          </div>
        </div>
      </div>
      <carousel
        ref="slider"
        :itemsToScroll="2"
        :mouseDrag="true"
        :touchDrag="true"
        :breakpoints="breakpoints"
      >
        <slide :key="1">
          <img src="@/assets/img/n-partners.svg" alt="" />
        </slide>
        <slide :key="2">
          <img src="@/assets/img/a-partners.svg" alt="" />
        </slide>
        <slide :key="3">
          <img src="@/assets/img/apple-partners.svg" alt="" />
        </slide>
        <slide :key="4">
          <img src="@/assets/img/bnb-partners.svg" alt="" />
        </slide>
        <slide :key="5">
          <img src="@/assets/img/Ethereum-partners.svg" alt="" />
        </slide>
        <slide :key="6">
          <img src="@/assets/img/google-partners.svg" alt="" />
        </slide>
        <slide :key="7">
          <img src="@/assets/img/foursquare-partners.svg" alt="" />
        </slide>
      </carousel>
    </div>
  </div>
</template>
  <script setup>
import { ref } from "vue";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import {Icon} from "@iconify/vue";

const slider = ref(null);
const breakpoints = ref({
  0: {
    itemsToShow: 3,
  },
  768: {
    itemsToShow: 4,
  },
  1280: {
    itemsToShow: 6,
  },
  1536: {
    itemsToShow: 7,
  },
});
const leftHandle = () => {
  slider.value.prev();
};
const rightHandle = () => {
  slider.value.next();
};
</script>