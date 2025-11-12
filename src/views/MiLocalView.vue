<script setup>
import { ref, onMounted } from 'vue';
import { useGetData } from '@/composables/getData';

const { getData: getUserData, data: userData } = useGetData();
const { getData: getVendorData, data: vendorData } = useGetData();
const { getData: getOrders, data: orders, loading, error } = useGetData();
const { getData: getProducts, data: products } = useGetData();

const vendorId = ref(null);

onMounted(async () => {
  const userId = localStorage.getItem('userId');

  if (!userId) return;

  await getUserData(`http://localhost:3000/api/users/profile/${userId}`);

  if (userData.value && userData.value.vendor_id) {
    vendorId.value = userData.value.vendor_id;

    await getVendorData(`http://localhost:3000/api/vendor/${vendorId.value}`);
    await getOrders(`http://localhost:3000/api/orders/local/${vendorId.value}`);
    await getProducts(`http://localhost:3000/api/products/by-vendor/${vendorId.value}`);
  }
});
</script>

<template>
  <div class="container mt-5">

    <h1 class="mb-4">Mi Local</h1>

    <div v-if="vendorData" class="mb-4 p-3 border rounded">
      <h3>{{ vendorData.name }}</h3>
      <p><strong>Dirección:</strong> {{ vendorData.address }}</p>
      <p><strong>Teléfono:</strong> {{ vendorData.phone }}</p>
      <p><strong>Descripción:</strong> {{ vendorData.description }}</p>
    </div>

    <h2 class="mt-4">Órdenes</h2>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-danger"></div>
    </div>
    <div v-else-if="error" class="alert alert-danger">{{ error.message }}</div>
    <div v-else-if="orders?.length === 0" class="alert alert-info">Aún no tienes órdenes.</div>

    <div v-else class="accordion mt-3" id="ordersAccordion">
      <div v-for="order in orders" :key="order.id" class="accordion-item mb-3">
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
    <div v-if="!products">Cargando productos...</div>
    <div v-else-if="products.length === 0" class="alert alert-info">No tienes productos publicados.</div>

    <div class="row mt-3" v-else>
      <div v-for="prod in products" :key="prod.id" class="col-md-4 col-lg-3 mb-4">
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
