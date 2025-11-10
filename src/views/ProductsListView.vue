<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/api'
import { useRoute } from 'vue-router'

const route = useRoute()
const vendorId = route.params.vendorId

const products = ref([])
const loading = ref(true)
const error = ref(null)

const cargarProductos = async () => {
  try {
    const { data } = await api.get(`/vendor/${vendorId}/products`)
    products.value = data
  } catch (err) {
    error.value = 'Error al cargar productos'
  } finally {
    loading.value = false
  }
}

onMounted(cargarProductos)
</script>


<template>
  <div class="card-body">

    <h5 class="card-title">{{ product.name }}</h5>

    <p class="card-text">${{ product.price }}</p>

    <p class="card-text text-muted">
      <i class="bi bi-shop me-1"></i>
      {{ product.vendor_name || "Local desconocido" }}
    </p>

    <p class="card-text">
      {{ product.description }}
    </p>

    <div v-if="product.is_available">
      <p class="text-success fw-bold">Disponible</p>
    </div>
    <div v-else>
      <p class="text-danger fw-bold">No disponible</p>
    </div>

    <button class="btn btn-primary" :disabled="!product.is_available">
      <i class="bi bi-cart-plus me-2"></i> Agregar al carrito
    </button>

  </div>

</template>
