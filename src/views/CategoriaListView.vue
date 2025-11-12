<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/api'
import { useCartStore } from '@/stores/CartStore'

const route = useRoute()
const categories = ref([])
const selectedCategory = ref(null)
const products = ref([])
const loadingProducts = ref(false)
const errorProducts = ref(null)
const vendorId = ref(route.params.id || null)
const vendorName = ref('')
const cartStore = useCartStore()


const sortOption = ref('none')


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
    const { data } = await api.get(`/products/bycategoria`, {
      params: { categories: selectedCategory.value },
    })
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


const agregarAlCarrito = (product) => {
  const item = {
    id: product.id,
    nombre: product.name,
    precio: product.price,
    imagen: product.image_url || product.Image_url,
    descripcion: product.description,
    cantidad: 1
  }
  cartStore.agregarAlCarrito(item)
}


const productosOrdenados = computed(() => {
  if (sortOption.value === 'asc') {
    return [...products.value].sort((a, b) => a.price - b.price)
  } else if (sortOption.value === 'desc') {
    return [...products.value].sort((a, b) => b.price - a.price)
  }
  return products.value
})


onMounted(async () => {
  await cargarCategorias()

  if (vendorId.value) {
    await cargarProductosPorVendor()
  } else if (route.query.categoria) {
    selectedCategory.value = route.query.categoria
    await cargarProductosPorCategoria()
  }
})


watch(() => route.query.categoria, async (newCategoria) => {
  if (newCategoria) {
    selectedCategory.value = newCategoria
    await cargarProductosPorCategoria()
  }
})

watch(selectedCategory, async () => {
  await cargarProductosPorCategoria()
})
</script>

<template>
  <div class="container mt-4">

    <h1 class="text-center mb-4">Productos</h1>


    <div v-if="!vendorId" class="category-selector-wrapper">
      <div class="input-group mb-3">
        <label class="input-group-text" for="select-categoria">Filtrar por categoría</label>
        <select v-model="selectedCategory" id="select-categoria" class="form-select"
          @change="cargarProductosPorCategoria">
          <option :value="null">Seleccione una categoría</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>
      </div>


      <div v-if="selectedCategory && products.length > 0" class="input-group mb-3">
        <label class="input-group-text" for="select-sort">Ordenar por precio</label>
        <select v-model="sortOption" id="select-sort" class="form-select">
          <option value="none">Ninguno</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
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


    <div v-else-if="productosOrdenados.length > 0" class="row mt-4">
      <div v-for="product in productosOrdenados" :key="product.id" class="col-md-4 col-lg-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img v-if="product.image_url || product.Image_url" :src="String(product.image_url || product.Image_url)"
            :alt="product.name" class="card-img-top" style="height: 200px; object-fit: cover;" />
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
            <button @click.prevent="agregarAlCarrito(product)" class="btn btn-primary w-100"
              :disabled="!product.is_available">
              <i class="bi bi-cart-plus me-2"></i>Agregar al carrito
            </button>
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

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
</style>
