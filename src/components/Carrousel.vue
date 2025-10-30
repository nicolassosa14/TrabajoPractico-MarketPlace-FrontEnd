<template>
  <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div v-for="(image, index) in images" :key="index" :class="['carousel-item', { active: index === 0 }]">
        <img :src="image" class="d-block w-100" alt="Carousel image">
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  images: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.carousel-inner {
  max-height: 800px;
  min-height: 800px;
}

.carousel-item img {
  object-fit: contain;
  height: 100%;
  width: 100%;
}
</style>