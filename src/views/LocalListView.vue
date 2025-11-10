<script setup>
import { ref, onMounted, computed } from "vue"
import api from "@/api/api"

const localItems = ref([])
const loading = ref(true)
const error = ref(null)


const userRole = ref(null)

const cargarLocales = async () => {
  loading.value = true
  error.value = null

  try {
    const { data } = await api.get("/vendor")
    localItems.value = data
  } catch (err) {
    error.value = "Error al cargar los elementos locales."
  } finally {
    loading.value = false
  }
}


const cargarPerfil = async () => {
  try {
    const { data } = await api.get("/users")
    userRole.value = data.role
  } catch (err) {
    userRole.value = null
  }
}
const cargarProductos = async () => {
  try {
    const { data } = await api.get(`/products/vendor/${vendorId}`)
    products.value = data
  } catch (err) {
    error.value = "Error al cargar productos del local."
  }
}


onMounted(() => {
  cargarLocales()
  cargarPerfil()
  if (route.query.search) {
    filtro.value = String(route.query.search);
  }

})
import { useRoute } from "vue-router";

const route = useRoute();
const filtro = ref("");


const localesFiltrados = computed(() => {
  if (!filtro.value.trim()) return localItems.value;

  const buscar = filtro.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return localItems.value.filter(local => {
    const name = (local.name || "").toLowerCase();
    const desc = (local.description || "").toLowerCase();

    return (
      name.includes(buscar) ||
      desc.includes(buscar)
    );
  });
});

</script>

<template>
  <div class="container mt-4">
    <div v-if="loading" class="text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando elementos locales...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger text-center mt-3">
      {{ error }}
    </div>

    <div v-else class="row mt-3">

      <div v-for="local in localesFiltrados" :key="local.id" class="col-md-4 col-lg-3 mb-4">
        <div class="card h-100 text-center shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ local.name }}</h5>
            <img v-if="local.image_url" :src="local.image_url" :alt="local.name" class="img-fluid rounded mb-3"
              style="height: 200px; object-fit: cover;" />
            <p class=""> {{ local.description }}</p>

            <router-link v-if="local.id" :to="{ name: 'ProductsByLocal', params: { vendorId: local.id } }"
              class="btn btn-primary d-block mt-2">
              Ver productos
            </router-link>

          </div>

        </div>

      </div>
    </div>
    <RouterLink v-if="userRole === 'vendor'" to="/locales/crear" class="btn btn-success mt-3">
      <i class="bi bi-plus-circle me-1"></i> Crear Local
    </RouterLink>

    <RouterLink v-if="userRole === 'vendor'" to="/productos/crear" class="btn btn-success mt-3">
      <i class="bi bi-plus-circle me-1"></i> Crear Producto
    </RouterLink>
  </div>
</template>
