<script setup>
import { ref, onMounted, computed } from 'vue';
import { useGetData } from '@/composables/getData';
import api from '@/api/api';
import router from '@/router';

const { getData: getUserData, data: userData } = useGetData();
const { getData: getVendorData, data: vendorData } = useGetData();
const { getData: getOrders, data: orders, loading, error } = useGetData();
const { getData: getProducts, data: products } = useGetData();

const vendorId = ref(null);

onMounted(async () => {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    router.push('/login');
    return;
  };

  await getUserData(`http://localhost:3000/api/users/profile/${userId}`);

  const fetchedVendorId =
    userData.value?.vendor_id ??
    null;

  if (fetchedVendorId) {
    vendorId.value = fetchedVendorId;

    await getVendorData(`http://localhost:3000/api/vendor/${vendorId.value}`);
    await getOrders(`http://localhost:3000/api/orders/local/${vendorId.value}`);
    await getProducts(`http://localhost:3000/api/products/by-vendor/${vendorId.value}`);
    return;
  }

  if (
    (!fetchedVendorId && (userData.value?.role === 'vendor' || userData.value?.role === 'backoffice')) ||
    (!fetchedVendorId && userData.value?.vendor)
  ) {
    try {
      const { data } = await api.get('/vendor');
      const match = data?.find?.((vendor) => {
        const vendorUserId =
          vendor.user_id ?? vendor.userId ?? vendor.user?.id ?? vendor.owner_id ?? null;
        return String(vendorUserId ?? '') === String(userId);
      });

      if (match) {
        vendorId.value = match.id ?? match.vendor_id ?? match.vendorId ?? null;
        vendorData.value = match;

        if (vendorId.value) {
          await getOrders(`http://localhost:3000/api/orders/local/${vendorId.value}`);
          await getProducts(`http://localhost:3000/api/products/by-vendor/${vendorId.value}`);
        }
      }
    } catch (error) {
      console.error('Error buscando local del vendedor:', error);
    }
  }
  else {
    alert('No tienes permiso de entrar a este enlace. Redirigiendo al inicio.');
    router.push('/');
  }
});

const vendorInfo = computed(() => {
  const data = vendorData.value;
  if (!data) return null;
  if (Array.isArray(data)) return data[0] ?? null;
  if (data.vendor) return data.vendor;
  return data;
});

const vendorImage = computed(() => {
  if (!vendorInfo.value) return null;
  return (
    vendorInfo.value.image_url ||
    vendorInfo.value.Image_url ||
    vendorInfo.value.logo_url ||
    null
  );
});

const ordersList = computed(() => {
  const data = orders.value;
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.orders) return data.orders;
  if (data.data) return Array.isArray(data.data) ? data.data : [];
  return [];
});

const productsList = computed(() => {
  const data = products.value;
  if (!data) return null;
  if (Array.isArray(data)) return data;
  if (data.products) return data.products;
  if (data.data) return Array.isArray(data.data) ? data.data : [];
  return [];
});
</script>

<template>
  <div class="container mt-5 mb-5">

    <h1 class="mb-4">Mi Local</h1>

    <div v-if="vendorInfo" class="mb-4 card shadow-sm">
      <div class="row g-0 align-items-center">
        <div class="col-md-4" v-if="vendorImage">
          <img :src="String(vendorImage)" :alt="vendorInfo.name" class="img-fluid rounded-start vendor-img" />
        </div>
        <div :class="['col-md-8', { 'col-md-12': !vendorImage }]">
          <div class="card-body">
            <h3 class="card-title mb-3">{{ vendorInfo.name }}</h3>
            <p v-if="vendorInfo.description" class="card-text">
              <strong>Descripción:</strong> {{ vendorInfo.description }}
            </p>
            <p v-if="vendorInfo.address" class="card-text">
              <strong>Dirección:</strong> {{ vendorInfo.address }}
            </p>
            <p v-if="vendorInfo.phone" class="card-text">
              <strong>Teléfono:</strong> {{ vendorInfo.phone }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info">
      No encontramos información para tu local. Verifica que tu cuenta esté asociada a un local.
    </div>

    <h2 class="mt-4">Órdenes</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-danger"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error.message }}</div>
    <div v-else-if="ordersList.length === 0" class="alert alert-info">Aún no tienes órdenes.</div>

    <div v-else class="accordion mt-3" id="ordersAccordion">
      <div v-for="order in ordersList" :key="order.id" class="accordion-item mb-3">
        <h2 class="accordion-header" :id="'heading' + order.id">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + order.id">
            Orden #{{ order.id }} - Cliente: {{ order.user.name }}
          </button>
        </h2>
        <div :id="'collapse' + order.id" class="accordion-collapse collapse" :aria-labelledby="'heading' + order.id"
          data-bs-parent="#ordersAccordion">
          <div class="accordion-body">
            <p><strong>Fecha:</strong> {{ new Date(order.createdAt).toLocaleDateString() }}</p>
            <p><strong>Dirección:</strong> {{ order.address }}</p>

            <ul class="list-group mt-3">
              <li v-for="item in order.items" :key="item.productId"
                class="list-group-item d-flex justify-content-between">
                <span>{{ item.product.name }}</span>
                <span>Cant: {{ item.quantity }}</span>
                <span>${{ item.price }}</span>
              </li>
            </ul>

            <h5 class="mt-3">Total: ${{ order.total }}</h5>
          </div>
        </div>
      </div>
    </div>

    <h2 class="mt-5">Mis Productos</h2>
    <div v-if="!productsList">Cargando productos...</div>
    <div v-else-if="productsList.length === 0" class="alert alert-info">No tienes productos publicados.</div>

    <div class="row mt-3" v-else>
      <div v-for="prod in productsList" :key="prod.id" class="col-md-4 col-lg-3 mb-4">
        <router-link to="/productos/crear" class="btn btn-danger mb-4">
          Crear Nuevo Producto
        </router-link>
        <div class="card h-100 p-2">
          <img v-if="prod.image_url" :src="prod.image_url" class="card-img-top"
            style="height: 200px; object-fit: cover;" />
          <div class="card-body">
            <h5>{{ prod.name }}</h5>
            <p class="text-muted">${{ prod.price }}</p>
            <p>{{ prod.description }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
