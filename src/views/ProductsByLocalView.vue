<script setup>
import { ref, onMounted } from "vue"
import api from "@/api/api"

const props = defineProps({
  vendorId: {
    type: String,
    required: true
  }
})

const products = ref([])
const loading = ref(true)
const error = ref(null)

const cargarProductos = async () => {
  loading.value = true
  error.value = null

  try {
    const { data } = await api.get(`/products/by-vendor/${props.vendorId}`)
    products.value = data
  } catch (err) {
    error.value = "Error al cargar productos del local."
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarProductos()
})
</script>

<template>
  <div class="container mt-4">
    <h2>Productos del Local</h2>

    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger mt-4">
      {{ error }}
    </div>

    <div v-else-if="products.length === 0" class="alert alert-info mt-4">
      Este local no tiene productos cargados.
    </div>

    <div v-else class="row mt-4">
      <div v-for="product in products" :key="product.id" class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">

          <img
            v-if="product.image_url"
            :src="product.image_url"
            class="card-img-top"
            style="height: 200px; object-fit: cover;"
          />

          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">${{ product.price }}</p>
            <p class="card-text">{{ product.description }}</p>

            <span
              class="badge"
              :class="product.is_available ? 'bg-success' : 'bg-danger'"
            >
              {{ product.is_available ? 'Disponible' : 'No disponible' }}
            </span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
