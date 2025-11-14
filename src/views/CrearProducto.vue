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
const vendorId = ref(null);
const userId = ref(null);
const loading = ref(false);
const error = ref(null);


onMounted(async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    router.push('/login');
    return;
  }

  try {

    const { data: categoriesData } = await api.get("/categories");
    categories.value = categoriesData;


    const { data: userData } = await api.get(`/users/profile/${userId}`);

    console.log('userId:', userId.value);

    vendorId.value =
      userData?.vendor_id?.toString() ||
      userData?.vendorId?.toString() ||
      userData?.vendor?.id?.toString() ||
      userData?.localId?.toString() ||
      null;


    if (!vendorId.value) {
      try {
        const { data: vendorsData } = await api.get('/vendor');
        const match = vendorsData?.find?.((vendor) => {
          const vendorUserId =
            vendor.user_id ?? vendor.userId ?? vendor.user?.id ?? vendor.owner_id ?? null;
          return String(vendorUserId ?? '') === String(userId);
        });

        if (match) {
          vendorId.value = (match.id ?? match.vendor_id ?? match.vendorId)?.toString() || null;
        }
      } catch (vendorErr) {
        console.error('Error buscando vendor:', vendorErr);
      }
    }

    if (!vendorId.value) {
      error.value = "No se encontró un local asociado a tu cuenta. Por favor, crea un local primero.";
    }
  } catch (err) {
    error.value = "Error cargando datos: " + (err.response?.data?.message || err.message);
  }
});


const crearProducto = async () => {
  loading.value = true;
  error.value = null;


  if (!vendorId.value) {
    error.value = "No se encontró un local asociado. Por favor, crea un local primero.";
    loading.value = false;
    return;
  }


  if (!selectedCategory.value) {
    error.value = "Por favor, selecciona una categoría.";
    loading.value = false;
    return;
  }

  try {
    const categoryId = selectedCategory.value?.user_id || selectedCategory.value?.id || selectedCategory.value;
    const categoryName = selectedCategory.value?.name || '';

    if (!categoryId) {
      error.value = "Por favor, selecciona una categoría válida.";
      loading.value = false;
      return;
    }

    const payload = {
      name: name.value,
      description: description.value,
      image_url: image_url.value,
      price: Number(price.value),
      is_available: is_available.value,
      vendor_id: String(vendorId.value),
      category_ids: String(categoryId),
    };

    console.log('Payload a enviar:', payload);
    console.log('selectedCategory.value:', selectedCategory.value);
    console.log('categoryId enviado:', categoryId);
    console.log('categoryName enviado:', categoryName);

    await api.post("/products", payload);

    alert("✅ Producto creado con éxito");
    router.push("/productos");
  } catch (err) {

    const errorMessage = err.response?.data?.message ||
      err.response?.data ||
      "Error al crear el producto";
    error.value = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mt-4 mb-5">
    <h2>Crear Producto</h2>

    <div v-if="error" class="alert alert-danger">
      <div v-if="Array.isArray(error)">{{ error.join(', ') }}</div>
      <div v-else>{{ error }}</div>
    </div>

    <div v-if="!vendorId && !loading" class="alert alert-warning">
      <i class="bi bi-exclamation-triangle me-2"></i>
      No tienes un local asociado.
      <RouterLink to="/locales/crear" class="alert-link">Crea un local primero</RouterLink> para poder agregar
      productos.
    </div>

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
        <label class="form-label">Categoría <span class="text-danger">*</span></label>
        <select v-model="selectedCategory" class="form-select" required>
          <option disabled :value="null">Seleccione una categoría</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat">
            {{ cat.name }}
          </option>
        </select>
        <small v-if="selectedCategory" class="text-muted">
          Categoría seleccionada: {{ selectedCategory?.name }} 
        </small>
      </div>

      <button type="submit" class="btn btn-success" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Crear Producto
      </button>
    </form>
  </div>
</template>
