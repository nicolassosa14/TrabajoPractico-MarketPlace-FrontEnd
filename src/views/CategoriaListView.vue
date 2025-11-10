<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/api'

const route = useRoute()
const categories = ref([])
const selectedCategory = ref(null)
const products = ref([])
const loadingProducts = ref(false)
const errorProducts = ref(null)
const vendorId = ref(route.params.id || null)
const vendorName = ref('')

const cargarCategorias = async () => {
  try {
    const { data } = await api.get('/categories')
    categories.value = data
  } catch (error) {
    alert('Error al cargar las categorías:', error)
  }
}

const cargarProductosPorCategoria = async () => {
  if (!selectedCategory.value) {
    products.value = []
    return
  }
  loadingProducts.value = true
  errorProducts.value = null
  try {
    const { data } = await api.get(`/products?categories=${selectedCategory.value}`)
    products.value = data
  } catch (error) {
    errorProducts.value = 'Error al cargar los productos.'
  } finally {
    loadingProducts.value = false
  }
}


const cargarProductosPorVendor = async () => {
  if (!vendorId.value) return
  loadingProducts.value = true
  errorProducts.value = null
  try {
    const { data } = await api.get(`/products?vendor_id=${vendorId.value}`)
    products.value = data
    if (data.length > 0) vendorName.value = data[0].vendor_name || 'Este local'
  } catch (error) {
    errorProducts.value = 'Error al cargar los productos del local.'
  } finally {
    loadingProducts.value = false
  }
}


onMounted(async () => {
  await cargarCategorias()
  if (vendorId.value) await cargarProductosPorVendor()
})


watch(selectedCategory, async () => {
  await cargarProductosPorCategoria()
})
</script>

<template>
  <div class="container mt-4">

    <h1 class="text-center mb-4">
      Categorías
    </h1>


    <div v-if="!vendorId" class="category-selector-wrapper">
      <div class="input-group">
        <label class="input-group-text" for="select-categoria">Elija una categoría</label>
        <select v-model="selectedCategory" id="select-categoria" class="form-select"
          @change="cargarProductosPorCategoria">
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>


    <div v-if="loadingProducts" class="text-center mt-5">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Cargando productos...</span>
      </div>
    </div>


    <div v-else-if="errorProducts" class="alert alert-danger mt-4 text-center">
      {{ errorProducts }}
    </div>


    <div v-else-if="products.length > 0" class="row mt-4">
      <div v-for="product in products" :key="product.id" class="col-md-4 col-lg-3 mb-4">
        <div class="card h-100">
          <img v-if="product.Image_url" :src="String(product.Image_url)" :alt="product.name" class="card-img-top"
            style="height: 200px; object-fit: cover;" />
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">${{ product.price }}</p>
            <p class="card-text text-muted">
              <i class="bi bi-shop me-1"></i>
              {{ product.vendor_name || 'Sin vendedor' }}
            </p>
            <p class="card-text">{{ product.description }}</p>

            <p :class="product.is_available ? 'text-success fw-bold' : 'text-danger fw-bold'">
              {{ product.is_available ? 'Disponible' : 'No disponible' }}
            </p>

            <a href="#" class="btn btn-primary" :class="{ disabled: !product.is_available }">
              <i class="bi bi-cart-plus me-2"></i>Agregar al carrito
            </a>
          </div>
        </div>
      </div>
    </div>


    <div v-else-if="!loadingProducts && selectedCategory" class="alert alert-info mt-4">
      No se encontraron productos para esta categoría.
    </div>

    <div v-else-if="!loadingProducts && vendorId" class="alert alert-info mt-4">
      No hay productos publicados por este local.
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 30px;
}

.form-select {
  text-transform: capitalize;
}

.category-selector-wrapper {
  max-width: 500px;
  margin: 0 auto 30px;
}
.form-select:focus {
  border-color: var(--primary-red) !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 107, 107, 0.25) !important;
}
</style>
