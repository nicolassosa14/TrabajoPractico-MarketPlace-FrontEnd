<script setup>
import { ref } from 'vue';

const locales = [
  {id:1, nombre:'local 1', descripcion:'descripcion 1', imagen:'imagen 1'},
  {id:2,nombre:'local 2', descripcion:'descripcion 2', imagen:'imagen 2'},
  {id:3,nombre:'local 3', descripcion:'descripcion 3', imagen:'imagen 3'},
  {id:4,nombre:'local 4', descripcion:'descripcion 4', imagen:'imagen 4'},
]

</script>

<template>
  <div class="container my-5">
    <h1 class="mb-4 text-center">Locales Disponibles</h1>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="local in locales" :key="local.id">
        <div class="card h-100">
          <img :src="local.imagen" class="card-img-top" :alt="local.nombre" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ local.nombre }}</h5>
            <p class="card-text">{{ local.descripcion }}</p>
            <p class="card-text fw-bold fs-5">hola</p>
            <div class="mt-auto">
              <button class="btn btn-danger w-100">
                <i class="bi bi-info-circle-fill me-1"></i>mas info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
</style>
