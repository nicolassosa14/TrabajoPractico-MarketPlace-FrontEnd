<script setup>
import { ref, onMounted, computed } from "vue"
import api from "@/api/api"
import { useCartStore } from "@/stores/CartStore"
import { useAuthStore } from "@/stores/auth"

const props = defineProps({
  vendorId: {
    type: String,
    required: true
  }
})

const products = ref([])
const loading = ref(true)
const error = ref(null)

const cartStore = useCartStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

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

const addToCart = (product) => {
  cartStore.agregarAlCarrito(product)
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
        <div class="card h-100">

          <img
            v-if="product.image_url"
            :src="product.image_url"
            class="card-img-top product-image"
          />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">${{ product.price }}</p>
            <p class="card-text text-muted">{{ product.description }}</p>

            <div class="mt-auto">
              <button
                v-if="isAuthenticated && product.is_available"
                @click="addToCart(product)"
                class="btn btn-primary w-100 mb-2"
              >
                Agregar al Carrito
              </button>

              <span
                class="badge w-100"
                :class="product.is_available ? 'bg-success' : 'bg-danger'"
              >
                {{ product.is_available ? 'Disponible' : 'No disponible' }}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 15px;
  border: none;
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--hover-shadow);
}

.product-image {
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.btn-primary {
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
}
</style>
