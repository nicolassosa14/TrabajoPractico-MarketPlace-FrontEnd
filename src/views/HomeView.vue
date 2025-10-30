<script setup>
import { ref } from 'vue';
import Carrousel from '@/components/Carrousel.vue';
import HeroSection from '@/components/HeroSection.vue';
import CategorySection from '@/components/CategorySection.vue';

const images = ref([
  '/Banner-1.webp',
  '/Banner-2.webp',
  '/Banner-3.webp',
]);
</script>

<template>
  <main>
    <HeroSection />
    <!-- <div class="carousel-container">
      <Carrousel :images="images" />
    </div> -->
    <CategorySection/>
  </main>
</template>



