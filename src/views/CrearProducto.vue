<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";
import { useRouter } from "vue-router";

const router = useRouter();

const name = ref("");
const description = ref("");
const price = ref(null);
const image_url = ref("");
const is_available = ref(true);

const categories = ref([]);
const selectedCategory = ref(null);

const loading = ref(false);
const error = ref(null);

// ✅ Cargar categorías
onMounted(async () => {
  const userId = localStorage.getItem('userId');
    if (!userId) {
    router.push('/login');
    return;
  };
  try {
    const { data } = await api.get("/categories");
    categories.value = data;
  } catch (err) {
    error.value = "Error cargando categorías";
  }

});

// ✅ Enviar producto
const crearProducto = async () => {
  loading.value = true;
  error.value = null;

  try {
    const payload = {
      name: name.value,
      description: description.value,
      image_url: image_url.value,
      price: Number(price.value),
      is_available: is_available.value,
      category_ids: selectedCategory.value // ✅ solo un ID
    };

    await api.post("/products", payload);

    alert("✅ Producto creado con éxito");
    router.push("/productos");
  } catch (err) {
    error.value = err.response?.data?.message || "Error al crear el producto";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mt-4 mb-5">
    <h2>Crear Producto</h2>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <form @submit.prevent="crearProducto" class="mt-3">

      <div class="mb-3">
        <label class="form-label">Nombre del producto</label>
        <input v-model="name" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Descripción</label>
        <textarea v-model="description" class="form-control" required></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Precio</label>
        <input v-model="price" type="number" min="0" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">URL de imagen</label>
        <input v-model="image_url" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Disponibilidad</label>
        <select v-model="is_available" class="form-select">
          <option :value="true">Disponible</option>
          <option :value="false">No disponible</option>
        </select>
      </div>

    
      <div class="mb-3">
        <label class="form-label">Categoría</label>
        <select v-model="selectedCategory" class="form-select" required>
          <option disabled value="">Seleccione una categoría</option>
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-success" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Crear Producto
      </button>
    </form>
  </div>
</template>
