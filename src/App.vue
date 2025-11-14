<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div id="app-container">
    <header>
      <div class="wrapper">
        <NavBar />
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
    <div>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex-grow: 1;
  padding-top: 70px;
}
</style>
